"""
Use Case 1: End-to-End Procurement Lifecycle Tracking API
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
import json

from app.models.database import (
    get_db, ProcurementTransaction, SourcingRequest, Contract,
    PurchaseOrder, Invoice, Vendor, PurchaseRequisition
)

router = APIRouter(prefix="/api/lifecycle", tags=["Procurement Lifecycle"])

class TimelineEvent(BaseModel):
    stage: str
    stage_name: str
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    duration_days: Optional[int]
    status: str
    source_system: str
    details: dict

class TransactionTimeline(BaseModel):
    transaction_id: str
    vendor_name: str
    total_value: float
    currency: str
    current_stage: str
    total_cycle_time_days: int
    has_bottleneck: bool
    bottleneck_stage: Optional[str]
    has_control_gap: bool
    compliance_score: float
    timeline: List[TimelineEvent]

class ProcessFlowNode(BaseModel):
    stage: str
    count: int
    avg_duration_days: float
    bottleneck_count: int

class BottleneckAnalysis(BaseModel):
    stage: str
    avg_delay_days: float
    transaction_count: int
    total_value_impacted: float
    percentage_of_total: float

class KPISummary(BaseModel):
    metric_name: str
    value: float
    unit: str
    trend: str
    change_percentage: float

@router.get("/transactions", response_model=List[dict])
def get_transactions(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 50,
    has_bottleneck: Optional[bool] = None,
    has_control_gap: Optional[bool] = None,
    vendor_id: Optional[int] = None
):
    """Get all procurement transactions with lifecycle data"""
    query = db.query(ProcurementTransaction)

    if has_bottleneck is not None:
        query = query.filter(ProcurementTransaction.has_bottleneck == has_bottleneck)
    if has_control_gap is not None:
        query = query.filter(ProcurementTransaction.has_control_gap == has_control_gap)
    if vendor_id:
        query = query.filter(ProcurementTransaction.vendor_id == vendor_id)

    transactions = query.offset(skip).limit(limit).all()

    result = []
    for txn in transactions:
        vendor = db.query(Vendor).filter(Vendor.id == txn.vendor_id).first()
        invoice = db.query(Invoice).filter(Invoice.id == txn.invoice_id).first() if txn.invoice_id else None

        result.append({
            "id": txn.id,
            "transaction_id": txn.transaction_id,
            "vendor_name": vendor.vendor_name if vendor else "Unknown",
            "vendor_code": vendor.vendor_code if vendor else None,
            "current_stage": txn.current_stage,
            "total_cycle_time_days": txn.total_cycle_time_days,
            "total_value": invoice.total_amount if invoice else 0,
            "has_bottleneck": txn.has_bottleneck,
            "bottleneck_stage": txn.bottleneck_stage,
            "has_control_gap": txn.has_control_gap,
            "control_gap_description": txn.control_gap_description,
            "compliance_score": txn.compliance_score,
            "created_at": txn.created_at
        })

    return result

@router.get("/transactions/{transaction_id}/timeline")
def get_transaction_timeline(transaction_id: str, db: Session = Depends(get_db)):
    """Get detailed timeline for a specific transaction"""
    txn = db.query(ProcurementTransaction).filter(
        ProcurementTransaction.transaction_id == transaction_id
    ).first()

    if not txn:
        return {"error": "Transaction not found"}

    timeline = []

    # Request Intake (SAP Ariba)
    if txn.sourcing_request_id:
        sr = db.query(SourcingRequest).filter(SourcingRequest.id == txn.sourcing_request_id).first()
        if sr:
            duration = (sr.request_approved_date - sr.request_submitted_date).days if sr.request_approved_date else None
            timeline.append({
                "stage": "request_intake",
                "stage_name": "Request Intake",
                "start_date": sr.request_submitted_date.isoformat() if sr.request_submitted_date else None,
                "end_date": sr.request_approved_date.isoformat() if sr.request_approved_date else None,
                "duration_days": duration,
                "status": "completed" if sr.request_approved_date else "in_progress",
                "source_system": "SAP Ariba",
                "details": {
                    "ariba_id": sr.ariba_id,
                    "requirement": sr.requirement_description,
                    "estimated_value": sr.estimated_value
                }
            })

            # Sourcing
            if sr.sourcing_event_start:
                sourcing_duration = (sr.award_decision_date - sr.sourcing_event_start).days if sr.award_decision_date else None
                timeline.append({
                    "stage": "sourcing",
                    "stage_name": "Sourcing",
                    "start_date": sr.sourcing_event_start.isoformat(),
                    "end_date": sr.award_decision_date.isoformat() if sr.award_decision_date else None,
                    "duration_days": sourcing_duration,
                    "status": "completed" if sr.award_decision_date else "in_progress",
                    "source_system": "SAP Ariba",
                    "details": {
                        "category": sr.category,
                        "subcategory": sr.subcategory
                    }
                })

    # Contracting (Simplicontract)
    if txn.contract_id:
        contract = db.query(Contract).filter(Contract.id == txn.contract_id).first()
        if contract:
            duration = (contract.contract_executed_date - contract.contract_drafted_date).days if contract.contract_executed_date else None
            timeline.append({
                "stage": "contracting",
                "stage_name": "Contracting",
                "start_date": contract.contract_drafted_date.isoformat() if contract.contract_drafted_date else None,
                "end_date": contract.contract_executed_date.isoformat() if contract.contract_executed_date else None,
                "duration_days": duration,
                "status": "completed" if contract.contract_executed_date else "in_progress",
                "source_system": "Simplicontract",
                "details": {
                    "contract_id": contract.contract_id,
                    "contract_type": contract.contract_type,
                    "contract_value": contract.contract_value,
                    "payment_terms": contract.payment_terms
                }
            })

    # PR/PO Creation (Oracle Fusion)
    if txn.po_id:
        po = db.query(PurchaseOrder).filter(PurchaseOrder.id == txn.po_id).first()
        pr = db.query(PurchaseRequisition).filter(PurchaseRequisition.id == txn.pr_id).first() if txn.pr_id else None

        if pr:
            pr_duration = (pr.pr_approved_date - pr.pr_created_date).days if pr.pr_approved_date else None
            timeline.append({
                "stage": "pr_creation",
                "stage_name": "PR Creation",
                "start_date": pr.pr_created_date.isoformat() if pr.pr_created_date else None,
                "end_date": pr.pr_approved_date.isoformat() if pr.pr_approved_date else None,
                "duration_days": pr_duration,
                "status": "completed",
                "source_system": "Oracle Fusion",
                "details": {
                    "pr_number": pr.pr_number,
                    "business_unit": pr.business_unit
                }
            })

        if po:
            po_duration = (po.po_sent_to_vendor_date - po.po_created_date).days if po.po_sent_to_vendor_date else None
            timeline.append({
                "stage": "po_creation",
                "stage_name": "PO Creation",
                "start_date": po.po_created_date.isoformat() if po.po_created_date else None,
                "end_date": po.po_sent_to_vendor_date.isoformat() if po.po_sent_to_vendor_date else None,
                "duration_days": po_duration,
                "status": "completed" if po.po_sent_to_vendor_date else "in_progress",
                "source_system": "Oracle Fusion",
                "details": {
                    "po_number": po.po_number,
                    "total_amount": po.total_amount,
                    "category": po.category
                }
            })

    # Payment (Oracle EBS)
    if txn.invoice_id:
        invoice = db.query(Invoice).filter(Invoice.id == txn.invoice_id).first()
        if invoice:
            payment_duration = (invoice.payment_date - invoice.invoice_received_date).days if invoice.payment_date else None
            timeline.append({
                "stage": "payment",
                "stage_name": "Payment",
                "start_date": invoice.invoice_received_date.isoformat() if invoice.invoice_received_date else None,
                "end_date": invoice.payment_date.isoformat() if invoice.payment_date else None,
                "duration_days": payment_duration,
                "status": invoice.payment_status.lower(),
                "source_system": "Oracle EBS",
                "details": {
                    "invoice_number": invoice.invoice_number,
                    "invoice_amount": invoice.invoice_amount,
                    "total_amount": invoice.total_amount,
                    "payment_method": invoice.payment_method
                }
            })

    vendor = db.query(Vendor).filter(Vendor.id == txn.vendor_id).first()
    invoice = db.query(Invoice).filter(Invoice.id == txn.invoice_id).first() if txn.invoice_id else None

    return {
        "transaction_id": txn.transaction_id,
        "vendor_name": vendor.vendor_name if vendor else "Unknown",
        "total_value": invoice.total_amount if invoice else 0,
        "currency": "INR",
        "current_stage": txn.current_stage,
        "total_cycle_time_days": txn.total_cycle_time_days,
        "has_bottleneck": txn.has_bottleneck,
        "bottleneck_stage": txn.bottleneck_stage,
        "has_control_gap": txn.has_control_gap,
        "control_gap_description": txn.control_gap_description,
        "compliance_score": txn.compliance_score,
        "timeline": timeline
    }

@router.get("/process-flow")
def get_process_flow(db: Session = Depends(get_db)):
    """Get process mining visualization data"""
    stages = ["request_intake", "sourcing", "contracting", "pr_po_creation", "invoicing", "payment"]

    nodes = []
    for stage in stages:
        txn_count = db.query(ProcurementTransaction).count()
        bottleneck_count = db.query(ProcurementTransaction).filter(
            ProcurementTransaction.bottleneck_stage == stage
        ).count()

        nodes.append({
            "stage": stage,
            "stage_name": stage.replace("_", " ").title(),
            "transaction_count": txn_count,
            "bottleneck_count": bottleneck_count,
            "avg_duration_days": round(5 + (stages.index(stage) * 2) + (bottleneck_count * 0.5), 1)
        })

    # Process variants (different paths)
    variants = [
        {
            "variant_id": "standard",
            "name": "Standard Flow",
            "path": stages,
            "count": int(txn_count * 0.7),
            "avg_cycle_time": 45
        },
        {
            "variant_id": "expedited",
            "name": "Expedited (No Sourcing)",
            "path": ["request_intake", "contracting", "pr_po_creation", "payment"],
            "count": int(txn_count * 0.2),
            "avg_cycle_time": 25
        },
        {
            "variant_id": "deviation",
            "name": "Contract Before Sourcing",
            "path": ["request_intake", "contracting", "sourcing", "pr_po_creation", "payment"],
            "count": int(txn_count * 0.1),
            "avg_cycle_time": 55
        }
    ]

    return {
        "nodes": nodes,
        "variants": variants,
        "total_transactions": txn_count
    }

@router.get("/bottlenecks")
def get_bottleneck_analysis(db: Session = Depends(get_db)):
    """Identify and analyze bottlenecks in the procurement process"""
    bottleneck_txns = db.query(ProcurementTransaction).filter(
        ProcurementTransaction.has_bottleneck == True
    ).all()

    stage_analysis = {}
    for txn in bottleneck_txns:
        stage = txn.bottleneck_stage or "unknown"
        if stage not in stage_analysis:
            stage_analysis[stage] = {
                "count": 0,
                "total_cycle_time": 0,
                "total_value": 0
            }
        stage_analysis[stage]["count"] += 1
        stage_analysis[stage]["total_cycle_time"] += txn.total_cycle_time_days or 0

        if txn.invoice_id:
            invoice = db.query(Invoice).filter(Invoice.id == txn.invoice_id).first()
            if invoice:
                stage_analysis[stage]["total_value"] += invoice.total_amount

    total_txns = db.query(ProcurementTransaction).count()

    result = []
    for stage, data in stage_analysis.items():
        result.append({
            "stage": stage,
            "stage_name": stage.replace("_", " ").title(),
            "transaction_count": data["count"],
            "avg_delay_days": round(data["total_cycle_time"] / data["count"], 1) if data["count"] > 0 else 0,
            "total_value_impacted": data["total_value"],
            "percentage_of_total": round((data["count"] / total_txns) * 100, 1) if total_txns > 0 else 0
        })

    return sorted(result, key=lambda x: x["transaction_count"], reverse=True)

@router.get("/control-gaps")
def get_control_gaps(db: Session = Depends(get_db)):
    """Detect and list control gaps/compliance violations"""
    gap_txns = db.query(ProcurementTransaction).filter(
        ProcurementTransaction.has_control_gap == True
    ).all()

    result = []
    for txn in gap_txns:
        vendor = db.query(Vendor).filter(Vendor.id == txn.vendor_id).first()
        invoice = db.query(Invoice).filter(Invoice.id == txn.invoice_id).first() if txn.invoice_id else None

        result.append({
            "transaction_id": txn.transaction_id,
            "vendor_name": vendor.vendor_name if vendor else "Unknown",
            "control_gap_description": txn.control_gap_description,
            "compliance_score": txn.compliance_score,
            "total_value": invoice.total_amount if invoice else 0,
            "current_stage": txn.current_stage,
            "detected_at": txn.updated_at
        })

    return result

@router.get("/kpis")
def get_kpis(db: Session = Depends(get_db)):
    """Get procurement KPIs"""
    total_txns = db.query(ProcurementTransaction).count()

    # End-to-End Cycle Time
    avg_cycle_time = db.query(func.avg(ProcurementTransaction.total_cycle_time_days)).scalar() or 0

    # Stage-Level Cycle Times (mock calculation)
    stage_times = {
        "Request Intake": 3.5,
        "Sourcing": 12.4,
        "Contracting": 8.2,
        "PR/PO Creation": 4.1,
        "Payment": 15.6
    }

    # First-Pass Yield
    transactions_with_issues = db.query(ProcurementTransaction).filter(
        (ProcurementTransaction.has_bottleneck == True) |
        (ProcurementTransaction.has_control_gap == True)
    ).count()
    first_pass_yield = ((total_txns - transactions_with_issues) / total_txns * 100) if total_txns > 0 else 0

    # On-Time Payment
    on_time_payments = db.query(Invoice).filter(
        Invoice.payment_date <= Invoice.due_date
    ).count()
    total_paid = db.query(Invoice).filter(Invoice.payment_status == "Paid").count()
    on_time_percentage = (on_time_payments / total_paid * 100) if total_paid > 0 else 0

    # Compliance Deviation Rate
    compliance_deviations = db.query(ProcurementTransaction).filter(
        ProcurementTransaction.has_control_gap == True
    ).count()
    deviation_rate = (compliance_deviations / total_txns * 100) if total_txns > 0 else 0

    return {
        "summary": [
            {
                "metric_name": "End-to-End Cycle Time",
                "value": round(avg_cycle_time, 1),
                "unit": "days",
                "trend": "improving",
                "change_percentage": -5.2
            },
            {
                "metric_name": "First-Pass Yield",
                "value": round(first_pass_yield, 1),
                "unit": "%",
                "trend": "stable",
                "change_percentage": 1.3
            },
            {
                "metric_name": "On-Time Payment",
                "value": round(on_time_percentage, 1),
                "unit": "%",
                "trend": "improving",
                "change_percentage": 3.8
            },
            {
                "metric_name": "Compliance Deviation Rate",
                "value": round(deviation_rate, 1),
                "unit": "%",
                "trend": "improving",
                "change_percentage": -2.1
            }
        ],
        "stage_cycle_times": stage_times,
        "total_transactions": total_txns
    }
