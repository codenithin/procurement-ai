# Flipkart Procurement AI Platform

An AI-powered solution for end-to-end procurement lifecycle management, implementing all 4 use cases from the requirements document.

## Use Cases Implemented

### Use Case 1: End-to-End Procurement Lifecycle Tracking
- Unified visibility across SAP Ariba, Simplicontract, Vendor Portal, Oracle Fusion, and Oracle EBS
- Process mining and timeline visualization
- Bottleneck analysis and control gap detection
- KPI dashboards for cycle time, compliance, and efficiency

### Use Case 2: AI Agent for Procurement Automation
- Conversational AI chatbot for requirement gathering
- Automated vendor identification and RFQ generation
- Rule-based negotiation support
- Automated bid analysis and awarding logic

### Use Case 3: AI-Powered Procurement Insights & Decision Support
- Automated spend categorization with ML confidence scores
- Anomaly detection and maverick spend identification
- Supplier risk scoring and performance analytics
- Demand forecasting and negotiation support
- Tail spend optimization recommendations

### Use Case 4: Post-Payment Audit & Leakage Detection
- Comprehensive validation rules engine
- Leakage case management workbench
- Invoice vs PO vs Contract reconciliation
- Recovery tracking and analytics

## Architecture

```
procurement-ai/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── main.py         # Main application entry
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routers/        # API endpoints
│   │   │   ├── lifecycle.py    # Use Case 1 APIs
│   │   │   ├── agent.py        # Use Case 2 APIs
│   │   │   ├── analytics.py    # Use Case 3 APIs
│   │   │   └── leakage.py      # Use Case 4 APIs
│   │   └── data/           # Mock data generator
│   └── requirements.txt
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── App.tsx        # Main dashboard with all use cases
│   │   └── index.css      # Tailwind CSS styles
│   └── package.json
└── start.sh               # Startup script
```

## System Integrations (Simulated)

| System | Purpose | Data Points |
|--------|---------|-------------|
| SAP Ariba | Sourcing & Intake | Requirements, RFQs, Bids, Awards |
| Simplicontract | Contract Management | Contracts, Rate Cards, T&Cs |
| Vendor Portal | Vendor Onboarding | Vendor Master, Compliance |
| Oracle Fusion | Procure-to-Pay | PRs, POs, Receipts |
| Oracle EBS | Invoicing & Payment | Invoices, Payments |

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm

### Installation

1. **Start the Platform:**
   ```bash
   cd procurement-ai
   chmod +x start.sh
   ./start.sh
   ```

2. **Or start manually:**

   **Backend:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Seed Database with Mock Data:**
   ```bash
   curl -X POST http://localhost:8000/api/seed-database
   ```

## API Endpoints

### Use Case 1: Lifecycle Tracking
- `GET /api/lifecycle/transactions` - Get all procurement transactions
- `GET /api/lifecycle/transactions/{id}/timeline` - Get transaction timeline
- `GET /api/lifecycle/process-flow` - Get process mining data
- `GET /api/lifecycle/bottlenecks` - Analyze bottlenecks
- `GET /api/lifecycle/kpis` - Get procurement KPIs

### Use Case 2: AI Agent
- `POST /api/agent/chat` - Chat with procurement agent
- `GET /api/agent/conversations/{session_id}` - Get conversation history
- `POST /api/agent/rfq/generate` - Generate RFQ
- `GET /api/agent/rfq/{rfq_id}/bids` - Get bids for RFQ
- `POST /api/agent/negotiate` - Negotiate with vendor

### Use Case 3: Analytics
- `GET /api/analytics/spend/overview` - Spend analytics overview
- `GET /api/analytics/spend/anomalies` - Detect spending anomalies
- `GET /api/analytics/suppliers/risk` - Supplier risk analysis
- `GET /api/analytics/forecast/demand` - Demand forecasting
- `GET /api/analytics/decision-support/supplier-recommendation` - Get vendor recommendations

### Use Case 4: Leakage Detection
- `GET /api/leakage/dashboard` - Leakage overview dashboard
- `GET /api/leakage/cases` - Get all leakage cases
- `GET /api/leakage/cases/{case_id}` - Get case details
- `PUT /api/leakage/cases/{case_id}` - Update case
- `POST /api/leakage/cases/{case_id}/validate` - Validate leakage
- `POST /api/leakage/cases/{case_id}/initiate-recovery` - Start recovery

## Access Points

- **Frontend Dashboard:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Alternative API Docs:** http://localhost:8000/redoc

## Mock Data

The system includes comprehensive mock data:
- 30 vendors across multiple categories
- 100 sourcing requests with bids
- 85 contracts with rate cards
- 150 purchase orders with line items
- 120 invoices with payment data
- 50 unified procurement transactions
- 18 leakage cases for audit
- 12 months of spend records
- KPI metrics and analytics

## Key Features

### Intelligent Data Mapping
- Fuzzy matching for vendor names
- NLP-based requirement to contract matching
- Cross-system transaction linking without common keys

### Process Mining
- Automatic process flow discovery
- Variant analysis for process deviations
- Cycle time analytics by stage

### AI-Powered Insights
- Automated spend categorization with confidence scores
- Maverick spend detection
- Supplier risk scoring (1-100)
- Price prediction and should-cost modeling

### Leakage Detection Rules
- Rate card adherence verification
- Duplicate invoice detection
- Quantity and price mismatch identification
- Contract compliance validation

## Technologies Used

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- SQLite Database
- Pydantic for validation
- Faker for mock data

### Frontend
- React 18 with TypeScript
- Tailwind CSS
- Recharts for visualizations
- Lucide React icons
- Vite build tool
