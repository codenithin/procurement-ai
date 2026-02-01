"""
Use Case 4: AI-Powered Post-Payment Audit & Leakage Detection API
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, desc
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
import json

from app.models.database import (
    get_db, LeakageCase, Invoice, PurchaseOrder, Contract, Vendor,
    InvoiceLineItem, POLineItem
)

router = APIRouter(prefix="/api/leakage", tags=["Leakage Detection"])

class CaseUpdateRequest(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    validated_by: Optional[str] = None
    recovered_amount: Optional[float] = None
    notes: Optional[str] = None

class ValidationRequest(BaseModel):
    is_valid_leakage: bool
    validated_by: str
    leakage_amount: Optional[float] = None
    notes: Optional[str] = None

@router.get("/dashboard")
def get_leakage_dashboard(db: Session = Depends(get_db)):
    """Get overview dashboard for leakage detection"""
    cases = db.query(LeakageCase).all()

    total_leakage = sum(c.leakage_amount for c in cases)
    total_recovered = sum(c.recovered_amount or 0 for c in cases)

    # Status breakdown
    status_counts = {}
    for case in cases:
        status = case.status or "Unknown"
        if status not in status_counts:
            status_counts[status] = {"count": 0, "value": 0}
        status_counts[status]["count"] += 1
        status_counts[status]["value"] += case.leakage_amount

    # Leakage by type
    type_breakdown = {}
    for case in cases:
        ltype = case.leakage_type or "Unknown"
        if ltype not in type_breakdown:
            type_breakdown[ltype] = {"count": 0, "value": 0}
        type_breakdown[ltype]["count"] += 1
        type_breakdown[ltype]["value"] += case.leakage_amount

    # Severity breakdown
    severity_counts = {}
    for case in cases:
        sev = case.severity or "Unknown"
        if sev not in severity_counts:
            severity_counts[sev] = {"count": 0, "value": 0}
        severity_counts[sev]["count"] += 1
        severity_counts[sev]["value"] += case.leakage_amount

    # Monthly trend
    monthly_trend = {}
    for case in cases:
        if case.created_at:
            month_key = case.created_at.strftime("%Y-%m")
            if month_key not in monthly_trend:
                monthly_trend[month_key] = {"detected": 0, "recovered": 0}
            monthly_trend[month_key]["detected"] += case.leakage_amount
            monthly_trend[month_key]["recovered"] += case.recovered_amount or 0

    return {
        "summary": {
            "total_cases": len(cases),
            "total_leakage_identified": total_leakage,
            "total_recovered": total_recovered,
            "recovery_rate": round(total_recovered/total_leakage*100, 1) if total_leakage > 0 else 0,
            "pending_investigation": len([c for c in cases if c.status in ["New", "Under Investigation"]]),
            "currency": "INR"
        },
        "status_breakdown": [
            {"status": k, "count": v["count"], "value": v["value"]}
            for k, v in status_counts.items()
        ],
        "type_breakdown": [
            {"type": k, "count": v["count"], "value": v["value"]}
            for k, v in sorted(type_breakdown.items(), key=lambda x: x[1]["value"], reverse=True)
        ],
        "severity_breakdown": [
            {"severity": k, "count": v["count"], "value": v["value"]}
            for k, v in severity_counts.items()
        ],
        "monthly_trend": [
            {"month": k, "detected": v["detected"], "recovered": v["recovered"]}
            for k, v in sorted(monthly_trend.items())
        ]
    }

@router.get("/cases")
def get_leakage_cases(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    severity: Optional[str] = None,
    leakage_type: Optional[str] = None,
    min_amount: Optional[float] = None
):
    """Get all leakage cases with filtering"""
    query = db.query(LeakageCase)

    if status:
        query = query.filter(LeakageCase.status == status)
    if severity:
        query = query.filter(LeakageCase.severity == severity)
    if leakage_type:
        query = query.filter(LeakageCase.leakage_type == leakage_type)
    if min_amount:
        query = query.filter(LeakageCase.leakage_amount >= min_amount)

    cases = query.order_by(desc(LeakageCase.created_at)).offset(skip).limit(limit).all()

    result = []
    for case in cases:
        invoice = db.query(Invoice).filter(Invoice.id == case.invoice_id).first()
        vendor = db.query(Vendor).filter(Vendor.id == invoice.vendor_id).first() if invoice else None

        result.append({
            "case_id": case.case_id,
            "leakage_type": case.leakage_type,
            "description": case.description,
            "expected_amount": case.expected_amount,
            "actual_amount": case.actual_amount,
            "leakage_amount": case.leakage_amount,
            "severity": case.severity,
            "status": case.status,
            "assigned_to": case.assigned_to,
            "vendor_name": vendor.vendor_name if vendor else "Unknown",
            "invoice_number": invoice.invoice_number if invoice else None,
            "created_at": case.created_at.isoformat() if case.created_at else None,
            "recovered_amount": case.recovered_amount
        })

    return result

@router.get("/cases/{case_id}")
def get_case_details(case_id: str, db: Session = Depends(get_db)):
    """Get detailed view of a leakage case with all supporting documents"""
    case = db.query(LeakageCase).filter(LeakageCase.case_id == case_id).first()

    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    invoice = db.query(Invoice).filter(Invoice.id == case.invoice_id).first()
    invoice_items = db.query(InvoiceLineItem).filter(InvoiceLineItem.invoice_id == invoice.id).all() if invoice else []

    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == invoice.po_id).first() if invoice else None
    po_items = db.query(POLineItem).filter(POLineItem.po_id == po.id).all() if po else []

    contract = db.query(Contract).filter(Contract.id == po.contract_id).first() if po and po.contract_id else None
    vendor = db.query(Vendor).filter(Vendor.id == invoice.vendor_id).first() if invoice else None

    # Build comparison view
    comparison = {
        "invoice_vs_po": [],
        "invoice_vs_contract": []
    }

    if invoice_items and po_items:
        for i, inv_item in enumerate(invoice_items):
            po_item = po_items[i] if i < len(po_items) else None
            comparison["invoice_vs_po"].append({
                "line": i + 1,
                "invoice_description": inv_item.description,
                "invoice_qty": inv_item.quantity,
                "invoice_unit_price": inv_item.unit_price,
                "invoice_total": inv_item.total_price,
                "po_description": po_item.item_description if po_item else None,
                "po_qty": po_item.quantity if po_item else None,
                "po_unit_price": po_item.unit_price if po_item else None,
                "po_total": po_item.total_price if po_item else None,
                "variance": round(inv_item.total_price - (po_item.total_price if po_item else 0), 2)
            })

    return {
        "case_info": {
            "case_id": case.case_id,
            "leakage_type": case.leakage_type,
            "description": case.description,
            "expected_amount": case.expected_amount,
            "actual_amount": case.actual_amount,
            "leakage_amount": case.leakage_amount,
            "severity": case.severity,
            "status": case.status,
            "assigned_to": case.assigned_to,
            "validated_by": case.validated_by,
            "validation_date": case.validation_date.isoformat() if case.validation_date else None,
            "recovered_amount": case.recovered_amount,
            "notes": case.notes,
            "created_at": case.created_at.isoformat() if case.created_at else None
        },
        "vendor_info": {
            "vendor_id": vendor.id if vendor else None,
            "vendor_name": vendor.vendor_name if vendor else "Unknown",
            "vendor_code": vendor.vendor_code if vendor else None,
            "contact_email": vendor.contact_email if vendor else None
        },
        "invoice_data": {
            "invoice_number": invoice.invoice_number if invoice else None,
            "invoice_date": invoice.invoice_date.isoformat() if invoice and invoice.invoice_date else None,
            "invoice_amount": invoice.invoice_amount if invoice else None,
            "tax_amount": invoice.tax_amount if invoice else None,
            "total_amount": invoice.total_amount if invoice else None,
            "payment_date": invoice.payment_date.isoformat() if invoice and invoice.payment_date else None,
            "payment_status": invoice.payment_status if invoice else None,
            "line_items": [
                {
                    "line": item.line_number,
                    "description": item.description,
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                    "total": item.total_price
                }
                for item in invoice_items
            ]
        },
        "po_data": {
            "po_number": po.po_number if po else None,
            "po_date": po.po_created_date.isoformat() if po and po.po_created_date else None,
            "po_amount": po.total_amount if po else None,
            "category": po.category if po else None,
            "line_items": [
                {
                    "line": item.line_number,
                    "description": item.item_description,
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                    "total": item.total_price
                }
                for item in po_items
            ]
        },
        "contract_data": {
            "contract_id": contract.contract_id if contract else None,
            "contract_type": contract.contract_type if contract else None,
            "contract_value": contract.contract_value if contract else None,
            "payment_terms": contract.payment_terms if contract else None,
            "rate_card": json.loads(contract.rate_card) if contract and contract.rate_card else None,
            "start_date": contract.start_date.isoformat() if contract and contract.start_date else None,
            "end_date": contract.end_date.isoformat() if contract and contract.end_date else None
        },
        "comparison": comparison,
        "audit_trail": [
            {"action": "Case Created", "date": case.created_at.isoformat() if case.created_at else None, "user": "System"},
            {"action": "Assigned", "date": case.created_at.isoformat() if case.created_at else None, "user": case.assigned_to},
        ]
    }

@router.put("/cases/{case_id}")
def update_case(case_id: str, request: CaseUpdateRequest, db: Session = Depends(get_db)):
    """Update leakage case status or details"""
    case = db.query(LeakageCase).filter(LeakageCase.case_id == case_id).first()

    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    if request.status:
        case.status = request.status
    if request.assigned_to:
        case.assigned_to = request.assigned_to
    if request.validated_by:
        case.validated_by = request.validated_by
        case.validation_date = datetime.now()
    if request.recovered_amount is not None:
        case.recovered_amount = request.recovered_amount
    if request.notes:
        case.notes = request.notes

    case.updated_at = datetime.now()
    db.commit()

    return {"message": "Case updated successfully", "case_id": case_id}

@router.post("/cases/{case_id}/validate")
def validate_case(case_id: str, request: ValidationRequest, db: Session = Depends(get_db)):
    """Validate if a flagged case is a true leakage"""
    case = db.query(LeakageCase).filter(LeakageCase.case_id == case_id).first()

    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    if request.is_valid_leakage:
        case.status = "Validated"
        case.validated_by = request.validated_by
        case.validation_date = datetime.now()
        if request.leakage_amount:
            case.leakage_amount = request.leakage_amount
    else:
        case.status = "Closed"
        case.notes = f"False positive - {request.notes}" if request.notes else "False positive"

    case.updated_at = datetime.now()
    db.commit()

    return {
        "message": "Case validated" if request.is_valid_leakage else "Case closed as false positive",
        "case_id": case_id,
        "status": case.status
    }

@router.post("/cases/{case_id}/initiate-recovery")
def initiate_recovery(case_id: str, db: Session = Depends(get_db)):
    """Initiate recovery process for validated leakage"""
    case = db.query(LeakageCase).filter(LeakageCase.case_id == case_id).first()

    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    if case.status != "Validated":
        raise HTTPException(status_code=400, detail="Case must be validated before initiating recovery")

    case.status = "Recovery Initiated"
    case.recovery_initiated_date = datetime.now()
    case.updated_at = datetime.now()
    db.commit()

    # Get vendor info for communication
    invoice = db.query(Invoice).filter(Invoice.id == case.invoice_id).first()
    vendor = db.query(Vendor).filter(Vendor.id == invoice.vendor_id).first() if invoice else None

    return {
        "message": "Recovery process initiated",
        "case_id": case_id,
        "leakage_amount": case.leakage_amount,
        "vendor": {
            "name": vendor.vendor_name if vendor else "Unknown",
            "contact": vendor.contact_email if vendor else None
        },
        "next_steps": [
            "Send recovery notice to vendor",
            "Request credit note",
            "Track vendor response",
            "Update case upon resolution"
        ]
    }

@router.get("/analytics/by-vendor")
def get_leakage_by_vendor(db: Session = Depends(get_db)):
    """Get leakage analytics grouped by vendor"""
    cases = db.query(LeakageCase).all()

    vendor_leakage = {}
    for case in cases:
        invoice = db.query(Invoice).filter(Invoice.id == case.invoice_id).first()
        if invoice:
            vendor = db.query(Vendor).filter(Vendor.id == invoice.vendor_id).first()
            vendor_name = vendor.vendor_name if vendor else "Unknown"
            vendor_id = vendor.id if vendor else None

            if vendor_id not in vendor_leakage:
                vendor_leakage[vendor_id] = {
                    "vendor_id": vendor_id,
                    "vendor_name": vendor_name,
                    "case_count": 0,
                    "total_leakage": 0,
                    "recovered": 0,
                    "leakage_types": {}
                }

            vendor_leakage[vendor_id]["case_count"] += 1
            vendor_leakage[vendor_id]["total_leakage"] += case.leakage_amount
            vendor_leakage[vendor_id]["recovered"] += case.recovered_amount or 0

            ltype = case.leakage_type
            if ltype not in vendor_leakage[vendor_id]["leakage_types"]:
                vendor_leakage[vendor_id]["leakage_types"][ltype] = 0
            vendor_leakage[vendor_id]["leakage_types"][ltype] += 1

    return sorted(
        vendor_leakage.values(),
        key=lambda x: x["total_leakage"],
        reverse=True
    )[:20]

@router.get("/analytics/by-category")
def get_leakage_by_category(db: Session = Depends(get_db)):
    """Get leakage analytics grouped by spend category"""
    cases = db.query(LeakageCase).all()

    category_leakage = {}
    for case in cases:
        invoice = db.query(Invoice).filter(Invoice.id == case.invoice_id).first()
        if invoice:
            po = db.query(PurchaseOrder).filter(PurchaseOrder.id == invoice.po_id).first()
            category = po.category if po else "Uncategorized"

            if category not in category_leakage:
                category_leakage[category] = {
                    "category": category,
                    "case_count": 0,
                    "total_leakage": 0,
                    "recovered": 0
                }

            category_leakage[category]["case_count"] += 1
            category_leakage[category]["total_leakage"] += case.leakage_amount
            category_leakage[category]["recovered"] += case.recovered_amount or 0

    return sorted(
        category_leakage.values(),
        key=lambda x: x["total_leakage"],
        reverse=True
    )

@router.get("/validation-rules")
def get_validation_rules():
    """Get the validation rules used for leakage detection"""
    rules = [
        {
            "rule_id": "RATE_001",
            "name": "Rate Card Adherence",
            "category": "Logistics",
            "description": "Compare invoiced rate against contracted rate for transportation services",
            "severity": "High",
            "threshold": "Any variance > 2%"
        },
        {
            "rule_id": "LIC_001",
            "name": "License Compliance",
            "category": "IT Software & SaaS",
            "description": "Compare billed licenses against PO/contract quantity",
            "severity": "Medium",
            "threshold": "Billed > Contracted"
        },
        {
            "rule_id": "DUP_001",
            "name": "Duplicate Invoice Detection",
            "category": "All",
            "description": "Identify invoices with same vendor, number, and amount paid multiple times",
            "severity": "High",
            "threshold": "Exact match"
        },
        {
            "rule_id": "TAX_001",
            "name": "Tax Calculation Verification",
            "category": "All",
            "description": "Verify tax amounts against applicable rates",
            "severity": "Medium",
            "threshold": "Variance > 0.5%"
        },
        {
            "rule_id": "QTY_001",
            "name": "Quantity Mismatch",
            "category": "All",
            "description": "Compare invoiced quantity against PO quantity",
            "severity": "Medium",
            "threshold": "Invoice > PO"
        },
        {
            "rule_id": "ADD_001",
            "name": "Addendum Timing",
            "category": "All",
            "description": "Verify payment uses correct rate card version based on service date",
            "severity": "High",
            "threshold": "Wrong addendum applied"
        }
    ]

    return {
        "rules": rules,
        "total_rules": len(rules),
        "last_updated": datetime.now().isoformat()
    }

@router.post("/run-audit")
def run_audit_scan(db: Session = Depends(get_db)):
    """Trigger a new audit scan on recent payments (mock)"""
    # In production, this would trigger the actual audit process

    return {
        "message": "Audit scan initiated",
        "scan_id": f"SCAN-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "status": "Running",
        "parameters": {
            "date_range": "Last 30 days",
            "categories": "All",
            "rules_applied": 6
        },
        "estimated_completion": "Processing will complete in background"
    }
