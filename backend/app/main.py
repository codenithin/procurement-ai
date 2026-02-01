"""
Flipkart Procurement AI Platform
Main FastAPI Application
"""
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.models.database import init_db, get_db, Base, engine
from app.routers import lifecycle, agent, analytics, leakage
from app.data.mock_data_generator import seed_database

# Create FastAPI app
app = FastAPI(
    title="Flipkart Procurement AI Platform",
    description="""
    AI-Powered Procurement Solution with 4 Key Use Cases:

    1. **End-to-End Procurement Lifecycle Tracking** - Unified visibility across SAP Ariba, Simplicontract, Oracle Fusion, and Oracle EBS
    2. **AI Agent for Procurement Automation** - Conversational AI for transactional and tactical procurement
    3. **Procurement Insights & Decision Support** - Spend analytics, risk management, and predictive intelligence
    4. **Post-Payment Audit & Leakage Detection** - Automated identification of financial leakages
    """,
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(lifecycle.router)
app.include_router(agent.router)
app.include_router(analytics.router)
app.include_router(leakage.router)

@app.on_event("startup")
def startup_event():
    """Initialize database and seed with mock data on startup"""
    init_db()

@app.get("/")
def root():
    """API root endpoint"""
    return {
        "name": "Flipkart Procurement AI Platform",
        "version": "1.0.0",
        "status": "running",
        "use_cases": [
            {
                "id": 1,
                "name": "End-to-End Procurement Lifecycle Tracking",
                "endpoint": "/api/lifecycle"
            },
            {
                "id": 2,
                "name": "AI Agent for Procurement Automation",
                "endpoint": "/api/agent"
            },
            {
                "id": 3,
                "name": "Procurement Insights & Decision Support",
                "endpoint": "/api/analytics"
            },
            {
                "id": 4,
                "name": "Post-Payment Audit & Leakage Detection",
                "endpoint": "/api/leakage"
            }
        ]
    }

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": "2024-01-01T00:00:00Z"}

@app.post("/api/seed-database")
def seed_db(db: Session = Depends(get_db)):
    """Seed database with mock data"""
    try:
        result = seed_database(db)
        return {"status": "success", "data_created": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    """Get overall platform statistics"""
    from app.models.database import (
        Vendor, SourcingRequest, Contract, PurchaseOrder,
        Invoice, ProcurementTransaction, SpendRecord, LeakageCase
    )

    stats = {
        "vendors": db.query(Vendor).count(),
        "sourcing_requests": db.query(SourcingRequest).count(),
        "contracts": db.query(Contract).count(),
        "purchase_orders": db.query(PurchaseOrder).count(),
        "invoices": db.query(Invoice).count(),
        "transactions_tracked": db.query(ProcurementTransaction).count(),
        "spend_records": db.query(SpendRecord).count(),
        "leakage_cases": db.query(LeakageCase).count()
    }

    # Calculate totals
    total_spend = db.query(SpendRecord).with_entities(
        SpendRecord.amount
    ).all()
    stats["total_spend"] = sum(s[0] for s in total_spend) if total_spend else 0

    leakage_total = db.query(LeakageCase).with_entities(
        LeakageCase.leakage_amount
    ).all()
    stats["total_leakage_identified"] = sum(l[0] for l in leakage_total) if leakage_total else 0

    return stats

# System integration endpoints (mock)
@app.get("/api/integrations")
def get_integrations():
    """Get status of system integrations"""
    return {
        "integrations": [
            {
                "system": "SAP Ariba",
                "type": "Sourcing & Intake",
                "status": "Connected",
                "last_sync": "2024-01-15T10:30:00Z",
                "data_points": ["Sourcing events", "Bids", "Awards"]
            },
            {
                "system": "Simplicontract",
                "type": "Contract Management",
                "status": "Connected",
                "last_sync": "2024-01-15T10:25:00Z",
                "data_points": ["Contracts", "Rate cards", "Obligations"]
            },
            {
                "system": "Vendor Portal",
                "type": "Vendor Onboarding",
                "status": "Connected",
                "last_sync": "2024-01-15T10:20:00Z",
                "data_points": ["Vendor master", "Compliance docs"]
            },
            {
                "system": "Oracle Fusion",
                "type": "Procure-to-Pay",
                "status": "Connected",
                "last_sync": "2024-01-15T10:15:00Z",
                "data_points": ["PRs", "POs", "Receipts"]
            },
            {
                "system": "Oracle EBS",
                "type": "Invoicing & Payment",
                "status": "Connected",
                "last_sync": "2024-01-15T10:10:00Z",
                "data_points": ["Invoices", "Payments", "Transactions"]
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
