"""
Use Case 3: AI-Powered Procurement Insights and Decision Support API
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, desc
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
import json
import random

from app.models.database import (
    get_db, SpendRecord, Vendor, Invoice, PurchaseOrder, Contract,
    KPIMetric, ProcurementTransaction
)

router = APIRouter(prefix="/api/analytics", tags=["Procurement Analytics"])

# Constants
CATEGORIES = {
    "Logistics & Transportation": ["Freight", "Last Mile Delivery", "Warehousing"],
    "Packaging Supplies": ["Boxes", "Bubble Wrap", "Tape"],
    "IT Hardware": ["Laptops", "Desktops", "Monitors", "Peripherals"],
    "IT Software & SaaS": ["Cloud Services", "Productivity Software", "Security Software"],
    "HR Services": ["Recruitment", "Staffing", "Training"],
    "Professional Services": ["Consulting", "Legal", "Audit"],
    "Corporate Services": ["Employee Transport", "Food Services", "Office Supplies"],
    "Marketing & Advertising": ["Digital Marketing", "Print Media", "Events"],
    "Facilities": ["Maintenance", "Security", "Cleaning"],
}

@router.get("/spend/overview")
def get_spend_overview(
    db: Session = Depends(get_db),
    fiscal_year: Optional[str] = None,
    business_unit: Optional[str] = None
):
    """Get overall spend analytics overview"""
    query = db.query(SpendRecord)

    if fiscal_year:
        query = query.filter(SpendRecord.fiscal_year == fiscal_year)
    if business_unit:
        query = query.filter(SpendRecord.business_unit == business_unit)

    records = query.all()

    # Total spend
    total_spend = sum(r.amount for r in records)

    # Spend by category
    category_spend = {}
    for record in records:
        cat = record.category
        if cat not in category_spend:
            category_spend[cat] = 0
        category_spend[cat] += record.amount

    # Spend by business unit
    bu_spend = {}
    for record in records:
        bu = record.business_unit
        if bu not in bu_spend:
            bu_spend[bu] = 0
        bu_spend[bu] += record.amount

    # Top vendors by spend
    vendor_spend = {}
    for record in records:
        vid = record.vendor_id
        if vid not in vendor_spend:
            vendor = db.query(Vendor).filter(Vendor.id == vid).first()
            vendor_spend[vid] = {
                "vendor_id": vid,
                "vendor_name": vendor.vendor_name if vendor else "Unknown",
                "amount": 0
            }
        vendor_spend[vid]["amount"] += record.amount

    top_vendors = sorted(vendor_spend.values(), key=lambda x: x["amount"], reverse=True)[:10]

    # Monthly trend
    monthly_trend = {}
    for record in records:
        month_key = record.spend_date.strftime("%Y-%m") if record.spend_date else "Unknown"
        if month_key not in monthly_trend:
            monthly_trend[month_key] = 0
        monthly_trend[month_key] += record.amount

    return {
        "total_spend": total_spend,
        "currency": "INR",
        "spend_by_category": [
            {"category": k, "amount": v, "percentage": round(v/total_spend*100, 1) if total_spend > 0 else 0}
            for k, v in sorted(category_spend.items(), key=lambda x: x[1], reverse=True)
        ],
        "spend_by_business_unit": [
            {"business_unit": k, "amount": v, "percentage": round(v/total_spend*100, 1) if total_spend > 0 else 0}
            for k, v in sorted(bu_spend.items(), key=lambda x: x[1], reverse=True)
        ],
        "top_vendors": top_vendors,
        "monthly_trend": [
            {"month": k, "amount": v}
            for k, v in sorted(monthly_trend.items())
        ]
    }

@router.get("/spend/categorization")
def get_ai_categorization(db: Session = Depends(get_db)):
    """Get AI-powered spend categorization results"""
    records = db.query(SpendRecord).all()

    categorized = [r for r in records if r.ai_categorized]
    uncategorized = [r for r in records if not r.ai_categorized]

    # Confidence distribution
    confidence_buckets = {
        "High (>90%)": 0,
        "Medium (75-90%)": 0,
        "Low (<75%)": 0
    }

    for record in categorized:
        if record.confidence_score > 0.9:
            confidence_buckets["High (>90%)"] += 1
        elif record.confidence_score > 0.75:
            confidence_buckets["Medium (75-90%)"] += 1
        else:
            confidence_buckets["Low (<75%)"] += 1

    # Category hierarchy
    hierarchy = {}
    for record in records:
        cat = record.category
        subcat = record.subcategory

        if cat not in hierarchy:
            hierarchy[cat] = {"total": 0, "subcategories": {}}

        hierarchy[cat]["total"] += record.amount

        if subcat not in hierarchy[cat]["subcategories"]:
            hierarchy[cat]["subcategories"][subcat] = 0
        hierarchy[cat]["subcategories"][subcat] += record.amount

    return {
        "categorization_stats": {
            "total_records": len(records),
            "ai_categorized": len(categorized),
            "pending_review": len(uncategorized),
            "categorization_rate": round(len(categorized)/len(records)*100, 1) if records else 0
        },
        "confidence_distribution": confidence_buckets,
        "category_hierarchy": [
            {
                "category": cat,
                "total_amount": data["total"],
                "subcategories": [
                    {"name": k, "amount": v}
                    for k, v in data["subcategories"].items()
                ]
            }
            for cat, data in sorted(hierarchy.items(), key=lambda x: x[1]["total"], reverse=True)
        ]
    }

@router.get("/spend/anomalies")
def detect_spend_anomalies(db: Session = Depends(get_db)):
    """Detect spending anomalies and maverick spend"""
    records = db.query(SpendRecord).all()

    anomalies = []

    # Maverick spend detection
    maverick_records = [r for r in records if r.is_maverick_spend]

    for record in maverick_records:
        vendor = db.query(Vendor).filter(Vendor.id == record.vendor_id).first()
        anomalies.append({
            "type": "Maverick Spend",
            "severity": "Medium",
            "amount": record.amount,
            "category": record.category,
            "vendor_name": vendor.vendor_name if vendor else "Unknown",
            "description": "Purchase from non-preferred vendor",
            "spend_date": record.spend_date.isoformat() if record.spend_date else None
        })

    # Unusual amount detection (amounts > 2x category average)
    category_avgs = {}
    for record in records:
        cat = record.category
        if cat not in category_avgs:
            category_avgs[cat] = {"total": 0, "count": 0}
        category_avgs[cat]["total"] += record.amount
        category_avgs[cat]["count"] += 1

    for cat in category_avgs:
        category_avgs[cat]["avg"] = category_avgs[cat]["total"] / category_avgs[cat]["count"]

    for record in records:
        cat_avg = category_avgs.get(record.category, {}).get("avg", 0)
        if cat_avg > 0 and record.amount > cat_avg * 2.5:
            vendor = db.query(Vendor).filter(Vendor.id == record.vendor_id).first()
            anomalies.append({
                "type": "Unusual Amount",
                "severity": "High",
                "amount": record.amount,
                "category": record.category,
                "vendor_name": vendor.vendor_name if vendor else "Unknown",
                "description": f"Amount is {round(record.amount/cat_avg, 1)}x the category average",
                "spend_date": record.spend_date.isoformat() if record.spend_date else None
            })

    # Summary stats
    total_anomaly_value = sum(a["amount"] for a in anomalies)
    total_spend = sum(r.amount for r in records)

    return {
        "summary": {
            "total_anomalies": len(anomalies),
            "total_anomaly_value": total_anomaly_value,
            "percentage_of_spend": round(total_anomaly_value/total_spend*100, 2) if total_spend > 0 else 0
        },
        "by_type": {
            "Maverick Spend": len([a for a in anomalies if a["type"] == "Maverick Spend"]),
            "Unusual Amount": len([a for a in anomalies if a["type"] == "Unusual Amount"])
        },
        "anomalies": sorted(anomalies, key=lambda x: x["amount"], reverse=True)[:50]
    }

@router.get("/spend/tail-spend")
def analyze_tail_spend(db: Session = Depends(get_db)):
    """Analyze tail spend and consolidation opportunities"""
    records = db.query(SpendRecord).all()
    tail_records = [r for r in records if r.is_tail_spend]

    total_spend = sum(r.amount for r in records)
    tail_spend = sum(r.amount for r in tail_records)

    # Vendor fragmentation in tail spend
    tail_vendors = {}
    for record in tail_records:
        vid = record.vendor_id
        if vid not in tail_vendors:
            vendor = db.query(Vendor).filter(Vendor.id == vid).first()
            tail_vendors[vid] = {
                "vendor_id": vid,
                "vendor_name": vendor.vendor_name if vendor else "Unknown",
                "amount": 0,
                "transaction_count": 0
            }
        tail_vendors[vid]["amount"] += record.amount
        tail_vendors[vid]["transaction_count"] += 1

    # Consolidation opportunities
    consolidation_opportunities = []
    category_vendors = {}

    for record in tail_records:
        cat = record.category
        vid = record.vendor_id

        if cat not in category_vendors:
            category_vendors[cat] = set()
        category_vendors[cat].add(vid)

    for cat, vendors in category_vendors.items():
        if len(vendors) > 3:
            cat_spend = sum(r.amount for r in tail_records if r.category == cat)
            consolidation_opportunities.append({
                "category": cat,
                "current_vendor_count": len(vendors),
                "recommended_vendor_count": min(3, len(vendors)),
                "current_spend": cat_spend,
                "potential_savings": round(cat_spend * 0.15, 2),  # Estimated 15% savings
                "recommendation": f"Consolidate from {len(vendors)} to 3 preferred vendors"
            })

    return {
        "summary": {
            "total_tail_spend": tail_spend,
            "percentage_of_total": round(tail_spend/total_spend*100, 1) if total_spend > 0 else 0,
            "tail_vendor_count": len(tail_vendors),
            "tail_transaction_count": len(tail_records)
        },
        "vendor_distribution": sorted(tail_vendors.values(), key=lambda x: x["amount"], reverse=True)[:20],
        "consolidation_opportunities": sorted(
            consolidation_opportunities,
            key=lambda x: x["potential_savings"],
            reverse=True
        )
    }

@router.get("/suppliers/risk")
def get_supplier_risk_analysis(db: Session = Depends(get_db)):
    """Get comprehensive supplier risk analysis"""
    vendors = db.query(Vendor).filter(Vendor.is_active == True).all()

    risk_distribution = {
        "Low": [],
        "Medium": [],
        "High": []
    }

    for vendor in vendors:
        # Calculate composite risk score
        risk_level = "Low" if vendor.risk_score < 40 else "Medium" if vendor.risk_score < 70 else "High"

        vendor_data = {
            "vendor_id": vendor.id,
            "vendor_name": vendor.vendor_name,
            "vendor_code": vendor.vendor_code,
            "risk_score": vendor.risk_score,
            "performance_score": vendor.performance_score,
            "compliance_status": vendor.compliance_status,
            "risk_factors": []
        }

        # Add risk factors
        if vendor.risk_score > 60:
            vendor_data["risk_factors"].append("High internal risk score")
        if vendor.performance_score < 60:
            vendor_data["risk_factors"].append("Poor performance history")
        if vendor.compliance_status != "Compliant":
            vendor_data["risk_factors"].append("Compliance issues")

        risk_distribution[risk_level].append(vendor_data)

    # Calculate total spend at risk
    high_risk_vendor_ids = [v["vendor_id"] for v in risk_distribution["High"]]
    high_risk_spend = db.query(func.sum(SpendRecord.amount)).filter(
        SpendRecord.vendor_id.in_(high_risk_vendor_ids)
    ).scalar() or 0

    return {
        "summary": {
            "total_suppliers": len(vendors),
            "high_risk_count": len(risk_distribution["High"]),
            "medium_risk_count": len(risk_distribution["Medium"]),
            "low_risk_count": len(risk_distribution["Low"]),
            "spend_at_high_risk": high_risk_spend
        },
        "risk_distribution": {
            "high": risk_distribution["High"][:10],
            "medium": risk_distribution["Medium"][:10],
            "low": risk_distribution["Low"][:10]
        }
    }

@router.get("/suppliers/{vendor_id}/performance")
def get_supplier_performance(vendor_id: int, db: Session = Depends(get_db)):
    """Get detailed supplier performance scorecard"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()

    if not vendor:
        return {"error": "Vendor not found"}

    # Get all invoices for this vendor
    invoices = db.query(Invoice).filter(Invoice.vendor_id == vendor_id).all()
    pos = db.query(PurchaseOrder).filter(PurchaseOrder.vendor_id == vendor_id).all()

    # Calculate KPIs
    total_invoices = len(invoices)
    on_time_payments = len([i for i in invoices if i.payment_date and i.due_date and i.payment_date <= i.due_date])

    delivered_pos = [p for p in pos if p.actual_delivery_date]
    on_time_deliveries = len([p for p in delivered_pos if p.actual_delivery_date <= p.expected_delivery_date])

    return {
        "vendor_info": {
            "vendor_id": vendor.id,
            "vendor_name": vendor.vendor_name,
            "vendor_code": vendor.vendor_code,
            "categories": json.loads(vendor.categories) if vendor.categories else []
        },
        "overall_scores": {
            "performance_score": vendor.performance_score,
            "risk_score": vendor.risk_score,
            "compliance_status": vendor.compliance_status
        },
        "kpis": {
            "delivery_performance": {
                "on_time_rate": round(on_time_deliveries/len(delivered_pos)*100, 1) if delivered_pos else 0,
                "total_orders": len(pos),
                "delivered": len(delivered_pos)
            },
            "payment_adherence": {
                "on_time_rate": round(on_time_payments/total_invoices*100, 1) if total_invoices else 0,
                "total_invoices": total_invoices
            },
            "quality_score": round(random.uniform(80, 98), 1),  # Mock data
            "responsiveness_score": round(random.uniform(75, 95), 1)  # Mock data
        },
        "spend_history": {
            "total_spend": sum(i.total_amount for i in invoices),
            "transaction_count": total_invoices,
            "average_transaction": round(sum(i.total_amount for i in invoices)/total_invoices, 2) if total_invoices else 0
        }
    }

@router.get("/contracts/compliance")
def get_contract_compliance(db: Session = Depends(get_db)):
    """Analyze contract compliance and leakage"""
    contracts = db.query(Contract).all()
    invoices = db.query(Invoice).all()

    # Mock compliance analysis
    compliant_spend = sum(i.total_amount for i in invoices) * 0.85
    non_compliant_spend = sum(i.total_amount for i in invoices) * 0.15

    compliance_issues = [
        {
            "type": "Price Variance",
            "count": 23,
            "value": 450000,
            "description": "Invoice price differs from contract rate"
        },
        {
            "type": "Off-Contract Purchase",
            "count": 15,
            "value": 890000,
            "description": "Purchase without valid contract"
        },
        {
            "type": "Exceeded Contract Cap",
            "count": 8,
            "value": 320000,
            "description": "Spend exceeds contract maximum"
        }
    ]

    return {
        "summary": {
            "total_contracts": len(contracts),
            "active_contracts": len([c for c in contracts if c.status == "Active"]),
            "compliant_spend": compliant_spend,
            "non_compliant_spend": non_compliant_spend,
            "compliance_rate": round(compliant_spend/(compliant_spend+non_compliant_spend)*100, 1)
        },
        "compliance_issues": compliance_issues,
        "contracts_expiring_soon": [
            {
                "contract_id": c.contract_id,
                "vendor_name": db.query(Vendor).filter(Vendor.id == c.vendor_id).first().vendor_name if c.vendor_id else "Unknown",
                "end_date": c.end_date.isoformat() if c.end_date else None,
                "contract_value": c.contract_value
            }
            for c in contracts
            if c.end_date and c.end_date <= datetime.now() + timedelta(days=90)
        ][:10]
    }

@router.get("/forecast/demand")
def get_demand_forecast(db: Session = Depends(get_db)):
    """Get AI-powered demand forecasting"""
    records = db.query(SpendRecord).all()

    # Group by month
    monthly_data = {}
    for record in records:
        if record.spend_date:
            month_key = record.spend_date.strftime("%Y-%m")
            if month_key not in monthly_data:
                monthly_data[month_key] = 0
            monthly_data[month_key] += record.amount

    # Generate forecast (simple moving average + growth)
    historical = sorted(monthly_data.items())
    avg_growth = 0.05  # 5% monthly growth assumption

    forecast = []
    if historical:
        last_value = historical[-1][1]
        last_date = datetime.strptime(historical[-1][0], "%Y-%m")

        for i in range(1, 7):
            forecast_date = last_date + timedelta(days=30*i)
            forecast_value = last_value * (1 + avg_growth * i)
            forecast.append({
                "month": forecast_date.strftime("%Y-%m"),
                "forecasted_amount": round(forecast_value, 2),
                "confidence_interval": {
                    "lower": round(forecast_value * 0.9, 2),
                    "upper": round(forecast_value * 1.1, 2)
                }
            })

    # Category-wise forecast
    category_forecast = {}
    for cat in CATEGORIES.keys():
        cat_records = [r for r in records if r.category == cat]
        cat_total = sum(r.amount for r in cat_records)
        category_forecast[cat] = {
            "current_spend": cat_total,
            "forecasted_spend": round(cat_total * 1.08, 2),  # 8% growth
            "growth_rate": "8%"
        }

    return {
        "historical": [{"month": k, "amount": v} for k, v in historical[-12:]],
        "forecast": forecast,
        "category_forecast": category_forecast,
        "model_accuracy": 0.87,  # Mock accuracy score
        "last_updated": datetime.now().isoformat()
    }

@router.get("/decision-support/supplier-recommendation")
def get_supplier_recommendations(
    category: str,
    budget: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """Get AI-powered supplier recommendations for a category"""
    vendors = db.query(Vendor).filter(Vendor.is_active == True).all()

    recommendations = []
    for vendor in vendors:
        categories = json.loads(vendor.categories) if vendor.categories else []

        # Calculate recommendation score
        category_match = 1.0 if category in categories else 0.5
        performance_factor = vendor.performance_score / 100
        risk_factor = (100 - vendor.risk_score) / 100

        recommendation_score = (category_match * 0.3 + performance_factor * 0.4 + risk_factor * 0.3) * 100

        recommendations.append({
            "vendor_id": vendor.id,
            "vendor_name": vendor.vendor_name,
            "vendor_code": vendor.vendor_code,
            "recommendation_score": round(recommendation_score, 1),
            "performance_score": vendor.performance_score,
            "risk_score": vendor.risk_score,
            "category_expertise": category in categories,
            "justification": []
        })

        # Add justifications
        if vendor.performance_score > 80:
            recommendations[-1]["justification"].append("Strong performance history")
        if vendor.risk_score < 40:
            recommendations[-1]["justification"].append("Low risk profile")
        if category in categories:
            recommendations[-1]["justification"].append(f"Expertise in {category}")

    recommendations = sorted(recommendations, key=lambda x: x["recommendation_score"], reverse=True)[:5]

    return {
        "category": category,
        "budget": budget,
        "recommendations": recommendations,
        "analysis_timestamp": datetime.now().isoformat()
    }

@router.get("/decision-support/negotiation")
def get_negotiation_support(
    category: str,
    vendor_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get AI-powered negotiation support and pricing insights"""
    # Get historical pricing data
    records = db.query(SpendRecord).filter(SpendRecord.category == category).all()

    if not records:
        return {"error": "No historical data for this category"}

    amounts = [r.amount for r in records]
    avg_price = sum(amounts) / len(amounts)
    min_price = min(amounts)
    max_price = max(amounts)

    # Calculate should-cost model (simplified)
    should_cost_components = {
        "base_cost": round(avg_price * 0.6, 2),
        "labor": round(avg_price * 0.2, 2),
        "overhead": round(avg_price * 0.1, 2),
        "margin": round(avg_price * 0.1, 2)
    }

    return {
        "category": category,
        "pricing_insights": {
            "average_historical_price": round(avg_price, 2),
            "min_price": round(min_price, 2),
            "max_price": round(max_price, 2),
            "target_price": round(avg_price * 0.95, 2),
            "walk_away_price": round(avg_price * 1.1, 2)
        },
        "should_cost_model": {
            "total": round(avg_price, 2),
            "components": should_cost_components
        },
        "recommended_payment_terms": "Net 45",
        "negotiation_levers": [
            "Volume commitment for better pricing",
            "Early payment discount (2% Net 10)",
            "Multi-year contract for rate lock",
            "Bundling with related categories"
        ],
        "market_trends": {
            "price_trend": "stable",
            "supply_availability": "adequate",
            "recommendation": "Favorable conditions for negotiation"
        }
    }
