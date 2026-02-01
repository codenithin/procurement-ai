import random
import json
from datetime import datetime, timedelta
from faker import Faker
from sqlalchemy.orm import Session
from app.models.database import (
    Vendor, SourcingRequest, SupplierBid, Contract, PurchaseRequisition,
    PurchaseOrder, POLineItem, Invoice, InvoiceLineItem, ProcurementTransaction,
    SpendRecord, LeakageCase, KPIMetric, AgentConversation, ConversationMessage
)

fake = Faker('en_IN')

# Category definitions from the document
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

BUSINESS_UNITS = ["E-commerce", "Logistics", "Corporate", "Technology", "Marketing", "Finance", "HR"]
COST_CENTERS = ["CC001", "CC002", "CC003", "CC004", "CC005", "CC006", "CC007", "CC008"]
PAYMENT_TERMS = ["Net 30", "Net 45", "Net 60", "Net 90"]

VENDOR_NAMES = [
    "TechSupply Solutions Pvt Ltd", "Global Logistics India", "SmartPack Industries",
    "CloudFirst Technologies", "PeopleFirst HR Solutions", "Legal Eagles Associates",
    "MarketBoost Digital", "FacilityPro Services", "SecureIT Solutions",
    "GreenTransport Co", "PackagePerfect Ltd", "DataDriven Consulting",
    "TalentBridge India", "EventMasters Pvt Ltd", "CleanSpace Facilities",
    "CyberShield Security", "SwiftDelivery Services", "ProPack Solutions",
    "InnovateTech Systems", "BusinessGrowth Advisors", "TransportEase India",
    "MediaMax Solutions", "HRConnect Services", "AuditPro Associates",
    "SupplyChain Masters", "DigitalEdge Marketing", "FacilityFirst Services",
    "TechTalent Solutions", "LogiPrime India", "CreativeMinds Agency"
]

def generate_vendors(db: Session, count: int = 30):
    vendors = []
    for i, name in enumerate(VENDOR_NAMES[:count]):
        category_list = random.sample(list(CATEGORIES.keys()), random.randint(1, 3))
        vendor = Vendor(
            vendor_code=f"VND{str(i+1).zfill(5)}",
            vendor_name=name,
            legal_entity=name,
            contact_person=fake.name(),
            contact_email=fake.company_email(),
            contact_phone=fake.phone_number(),
            address=fake.address(),
            city=fake.city(),
            state=random.choice(["Karnataka", "Maharashtra", "Tamil Nadu", "Delhi", "Telangana"]),
            country="India",
            bank_account_number=fake.bban(),
            bank_name=random.choice(["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Mahindra"]),
            gstin=f"{random.randint(10, 36)}{fake.bothify('?????####?')}",
            pan=fake.bothify('?????####?').upper(),
            onboarding_initiated_date=fake.date_time_between(start_date='-2y', end_date='-1y'),
            vendor_activated_date=fake.date_time_between(start_date='-1y', end_date='-6m'),
            compliance_status=random.choice(["Compliant", "Compliant", "Compliant", "Under Review"]),
            risk_score=round(random.uniform(20, 85), 2),
            performance_score=round(random.uniform(50, 95), 2),
            categories=json.dumps(category_list),
            is_active=True
        )
        db.add(vendor)
        vendors.append(vendor)
    db.commit()
    return vendors

def generate_sourcing_requests(db: Session, vendors: list, count: int = 100):
    requests = []
    for i in range(count):
        category = random.choice(list(CATEGORIES.keys()))
        subcategory = random.choice(CATEGORIES[category])
        vendor = random.choice(vendors)

        submitted = fake.date_time_between(start_date='-18m', end_date='-3m')
        approved = submitted + timedelta(days=random.randint(1, 5))
        sourcing_start = approved + timedelta(days=random.randint(1, 3))
        award_date = sourcing_start + timedelta(days=random.randint(7, 30))

        request = SourcingRequest(
            ariba_id=f"ARB{datetime.now().year}{str(i+1).zfill(6)}",
            requirement_description=f"Procurement of {subcategory} - {fake.catch_phrase()}",
            project_description=fake.paragraph(nb_sentences=3),
            category=category,
            subcategory=subcategory,
            business_unit=random.choice(BUSINESS_UNITS),
            requestor_name=fake.name(),
            requestor_email=fake.company_email(),
            estimated_value=round(random.uniform(50000, 5000000), 2),
            currency="INR",
            request_submitted_date=submitted,
            request_approved_date=approved,
            sourcing_event_start=sourcing_start,
            award_decision_date=award_date,
            awarded_vendor_id=vendor.id,
            status=random.choice(["Completed", "Completed", "Completed", "In Progress"])
        )
        db.add(request)
        requests.append(request)
    db.commit()
    return requests

def generate_supplier_bids(db: Session, requests: list, vendors: list):
    bids = []
    for req in requests:
        num_bids = random.randint(2, 5)
        bidding_vendors = random.sample(vendors, num_bids)

        for j, vendor in enumerate(bidding_vendors):
            bid = SupplierBid(
                bid_id=f"BID{req.ariba_id[3:]}-{j+1}",
                sourcing_request_id=req.id,
                vendor_id=vendor.id,
                bid_amount=round(req.estimated_value * random.uniform(0.85, 1.15), 2),
                technical_score=round(random.uniform(60, 100), 2),
                delivery_timeline_days=random.randint(7, 60),
                bid_submitted_date=req.sourcing_event_start + timedelta(days=random.randint(3, 14)),
                is_compliant=random.choice([True, True, True, False]),
                notes=fake.sentence()
            )
            db.add(bid)
            bids.append(bid)
    db.commit()
    return bids

def generate_contracts(db: Session, requests: list, vendors: list):
    contracts = []
    for req in requests:
        if req.status == "Completed":
            contract_drafted = req.award_decision_date + timedelta(days=random.randint(1, 5))
            contract_executed = contract_drafted + timedelta(days=random.randint(3, 15))

            # Generate rate card
            rate_card = {
                "items": [
                    {"description": f"Service Type {i+1}", "unit": random.choice(["per hour", "per unit", "per month"]),
                     "rate": round(random.uniform(500, 50000), 2)}
                    for i in range(random.randint(3, 8))
                ]
            }

            contract = Contract(
                contract_id=f"CNT{datetime.now().year}{str(len(contracts)+1).zfill(6)}",
                sourcing_request_id=req.id,
                vendor_id=req.awarded_vendor_id,
                contract_purpose=req.requirement_description,
                contract_type=random.choice(["MSA", "SOW", "Service Agreement"]),
                contract_value=round(req.estimated_value * random.uniform(0.9, 1.1), 2),
                currency="INR",
                payment_terms=random.choice(PAYMENT_TERMS),
                contract_drafted_date=contract_drafted,
                contract_executed_date=contract_executed,
                start_date=contract_executed,
                end_date=contract_executed + timedelta(days=random.choice([365, 730, 1095])),
                renewal_date=contract_executed + timedelta(days=random.choice([335, 700, 1065])),
                auto_renewal=random.choice([True, False]),
                key_obligations=json.dumps([fake.sentence() for _ in range(3)]),
                rate_card=json.dumps(rate_card),
                status="Active"
            )
            db.add(contract)
            contracts.append(contract)
    db.commit()
    return contracts

def generate_purchase_requisitions(db: Session, count: int = 150):
    prs = []
    for i in range(count):
        created = fake.date_time_between(start_date='-12m', end_date='-1m')
        approved = created + timedelta(days=random.randint(1, 3))

        pr = PurchaseRequisition(
            pr_number=f"PR{datetime.now().year}{str(i+1).zfill(6)}",
            description=f"Requisition for {random.choice(list(CATEGORIES.keys()))} - {fake.catch_phrase()}",
            requestor_name=fake.name(),
            business_unit=random.choice(BUSINESS_UNITS),
            cost_center=random.choice(COST_CENTERS),
            total_amount=round(random.uniform(10000, 1000000), 2),
            currency="INR",
            pr_created_date=created,
            pr_approved_date=approved,
            status="Approved"
        )
        db.add(pr)
        prs.append(pr)
    db.commit()
    return prs

def generate_purchase_orders(db: Session, prs: list, contracts: list, vendors: list):
    pos = []
    for i, pr in enumerate(prs):
        contract = random.choice(contracts) if contracts and random.random() > 0.2 else None
        vendor = vendors[i % len(vendors)] if not contract else None

        created = pr.pr_approved_date + timedelta(days=random.randint(1, 3))
        sent = created + timedelta(days=random.randint(0, 2))
        expected_delivery = sent + timedelta(days=random.randint(7, 45))
        actual_delivery = expected_delivery + timedelta(days=random.randint(-5, 10))

        po = PurchaseOrder(
            po_number=f"PO{datetime.now().year}{str(i+1).zfill(6)}",
            pr_id=pr.id,
            contract_id=contract.id if contract else None,
            vendor_id=contract.vendor_id if contract else vendor.id,
            description=pr.description,
            category=random.choice(list(CATEGORIES.keys())),
            total_amount=pr.total_amount,
            currency="INR",
            po_created_date=created,
            po_sent_to_vendor_date=sent,
            expected_delivery_date=expected_delivery,
            actual_delivery_date=actual_delivery,
            status=random.choice(["Delivered", "Delivered", "Delivered", "In Transit", "Pending"])
        )
        db.add(po)
        pos.append(po)
    db.commit()

    # Generate line items
    for po in pos:
        num_items = random.randint(1, 5)
        for j in range(num_items):
            qty = random.randint(1, 100)
            unit_price = round(po.total_amount / num_items / qty, 2)
            item = POLineItem(
                po_id=po.id,
                line_number=j + 1,
                item_description=fake.catch_phrase(),
                quantity=qty,
                unit_price=unit_price,
                total_price=round(qty * unit_price, 2),
                uom=random.choice(["EA", "KG", "LTR", "HR", "MTH"])
            )
            db.add(item)
    db.commit()
    return pos

def generate_invoices(db: Session, pos: list, vendors: list):
    invoices = []
    for i, po in enumerate(pos):
        if po.status == "Delivered":
            received = po.actual_delivery_date + timedelta(days=random.randint(1, 5))
            due_date = received + timedelta(days=30)
            payment_date = due_date + timedelta(days=random.randint(-10, 15))

            # Sometimes create invoice amount discrepancy (for leakage detection)
            amount_variance = 1.0
            if random.random() < 0.15:  # 15% chance of discrepancy
                amount_variance = random.uniform(1.02, 1.10)

            invoice_amount = round(po.total_amount * amount_variance, 2)
            tax = round(invoice_amount * 0.18, 2)

            invoice = Invoice(
                invoice_number=f"INV{datetime.now().year}{str(i+1).zfill(6)}",
                po_id=po.id,
                vendor_id=po.vendor_id,
                invoice_amount=invoice_amount,
                tax_amount=tax,
                total_amount=round(invoice_amount + tax, 2),
                currency="INR",
                invoice_date=received - timedelta(days=2),
                invoice_received_date=received,
                due_date=due_date,
                payment_date=payment_date,
                payment_status="Paid" if payment_date <= datetime.now() else "Pending",
                payment_method=random.choice(["NEFT", "RTGS", "IMPS"]),
                transaction_id=fake.uuid4()[:12].upper()
            )
            db.add(invoice)
            invoices.append(invoice)
    db.commit()

    # Generate invoice line items
    for inv in invoices:
        po = db.query(PurchaseOrder).filter(PurchaseOrder.id == inv.po_id).first()
        po_items = db.query(POLineItem).filter(POLineItem.po_id == po.id).all()

        for j, po_item in enumerate(po_items):
            inv_item = InvoiceLineItem(
                invoice_id=inv.id,
                line_number=j + 1,
                description=po_item.item_description,
                quantity=po_item.quantity,
                unit_price=po_item.unit_price * (inv.invoice_amount / po.total_amount),
                total_price=round(po_item.total_price * (inv.invoice_amount / po.total_amount), 2)
            )
            db.add(inv_item)
    db.commit()
    return invoices

def generate_procurement_transactions(db: Session, requests: list, contracts: list, pos: list, invoices: list):
    transactions = []

    for i, inv in enumerate(invoices[:50]):  # Create 50 unified transactions
        po = db.query(PurchaseOrder).filter(PurchaseOrder.id == inv.po_id).first()
        contract = db.query(Contract).filter(Contract.id == po.contract_id).first() if po.contract_id else None
        sourcing_req = db.query(SourcingRequest).filter(SourcingRequest.id == contract.sourcing_request_id).first() if contract else None

        # Calculate cycle time
        if sourcing_req and inv.payment_date:
            cycle_time = (inv.payment_date - sourcing_req.request_submitted_date).days
        else:
            cycle_time = random.randint(30, 120)

        # Determine bottlenecks
        has_bottleneck = random.random() < 0.25
        bottleneck_stages = ["sourcing", "contracting", "pr_po_creation", "invoicing"]

        # Determine control gaps
        has_gap = random.random() < 0.15
        gap_descriptions = [
            "Missing approval in procurement chain",
            "Contract terms not validated before PO",
            "Invoice processed without goods receipt",
            "Unauthorized price change detected"
        ]

        txn = ProcurementTransaction(
            transaction_id=f"TXN{datetime.now().year}{str(i+1).zfill(6)}",
            sourcing_request_id=sourcing_req.id if sourcing_req else None,
            contract_id=contract.id if contract else None,
            vendor_id=po.vendor_id,
            pr_id=po.pr_id,
            po_id=po.id,
            invoice_id=inv.id,
            current_stage="payment" if inv.payment_status == "Paid" else "invoicing",
            total_cycle_time_days=cycle_time,
            has_bottleneck=has_bottleneck,
            bottleneck_stage=random.choice(bottleneck_stages) if has_bottleneck else None,
            has_control_gap=has_gap,
            control_gap_description=random.choice(gap_descriptions) if has_gap else None,
            compliance_score=round(random.uniform(70, 100), 2)
        )
        db.add(txn)
        transactions.append(txn)
    db.commit()
    return transactions

def generate_spend_records(db: Session, invoices: list, vendors: list):
    records = []
    for inv in invoices:
        category = random.choice(list(CATEGORIES.keys()))
        subcategory = random.choice(CATEGORIES[category])

        record = SpendRecord(
            invoice_id=inv.id,
            vendor_id=inv.vendor_id,
            category=category,
            subcategory=subcategory,
            business_unit=random.choice(BUSINESS_UNITS),
            cost_center=random.choice(COST_CENTERS),
            amount=inv.total_amount,
            currency="INR",
            spend_date=inv.payment_date or inv.invoice_date,
            fiscal_year=f"FY{(inv.invoice_date.year % 100)}-{(inv.invoice_date.year % 100) + 1}",
            fiscal_quarter=f"Q{((inv.invoice_date.month - 1) // 3) + 1}",
            ai_categorized=True,
            confidence_score=round(random.uniform(0.75, 0.99), 2),
            is_maverick_spend=random.random() < 0.1,
            is_tail_spend=inv.total_amount < 50000
        )
        db.add(record)
        records.append(record)
    db.commit()
    return records

def generate_leakage_cases(db: Session, invoices: list):
    cases = []
    leakage_types = [
        ("Rate Card Violation", "Invoiced rate exceeds contracted rate"),
        ("Duplicate Invoice", "Same invoice submitted multiple times"),
        ("Quantity Mismatch", "Invoiced quantity differs from PO quantity"),
        ("Tax Calculation Error", "Incorrect tax rate applied"),
        ("Pricing Discrepancy", "Unit price differs from contract"),
        ("Scope Creep", "Services invoiced not in original scope")
    ]

    # Select ~15% of invoices for leakage cases
    leakage_invoices = random.sample(invoices, int(len(invoices) * 0.15))

    for i, inv in enumerate(leakage_invoices):
        leakage_type, desc_template = random.choice(leakage_types)
        leakage_pct = random.uniform(0.02, 0.15)
        expected = inv.invoice_amount / (1 + leakage_pct)
        leakage_amt = inv.invoice_amount - expected

        case = LeakageCase(
            case_id=f"LKG{datetime.now().year}{str(i+1).zfill(6)}",
            invoice_id=inv.id,
            leakage_type=leakage_type,
            description=f"{desc_template}. Expected: INR {expected:,.2f}, Actual: INR {inv.invoice_amount:,.2f}",
            expected_amount=round(expected, 2),
            actual_amount=inv.invoice_amount,
            leakage_amount=round(leakage_amt, 2),
            currency="INR",
            severity=random.choice(["Low", "Medium", "High"]),
            status=random.choice(["New", "Under Investigation", "Recovery Initiated", "Closed"]),
            assigned_to=fake.name() if random.random() > 0.3 else None,
            recovered_amount=round(leakage_amt * random.uniform(0, 1), 2) if random.random() > 0.5 else 0
        )
        db.add(case)
        cases.append(case)
    db.commit()
    return cases

def generate_kpi_metrics(db: Session):
    metrics = []
    metric_definitions = [
        ("End-to-End Cycle Time", "days", 30, 90),
        ("Stage-Level Cycle Time", "days", 5, 20),
        ("First-Pass Yield", "percentage", 70, 95),
        ("On-Time Payment", "percentage", 75, 98),
        ("Compliance Deviation Rate", "percentage", 2, 15),
        ("Supplier Risk Score", "score", 20, 80),
        ("Spend Under Management", "percentage", 60, 95),
        ("Contract Compliance", "percentage", 80, 99),
        ("Savings Achieved", "INR", 100000, 5000000)
    ]

    for month_offset in range(12):
        period_date = datetime.now() - timedelta(days=30 * month_offset)

        for metric_name, unit, min_val, max_val in metric_definitions:
            for bu in BUSINESS_UNITS[:4]:
                metric = KPIMetric(
                    metric_name=metric_name,
                    metric_value=round(random.uniform(min_val, max_val), 2),
                    metric_unit=unit,
                    dimension="business_unit",
                    dimension_value=bu,
                    period="monthly",
                    period_date=period_date
                )
                db.add(metric)
                metrics.append(metric)
    db.commit()
    return metrics

def generate_agent_conversations(db: Session):
    conversations = []

    sample_conversations = [
        {
            "category": "transactional",
            "requirements": {"item": "Office Supplies", "quantity": 100, "budget": 50000},
            "messages": [
                ("user", "I need to order some office supplies"),
                ("assistant", "I can help with that. What type of office supplies do you need?"),
                ("user", "Notebooks, pens, and staplers for the new batch of employees"),
                ("assistant", "Got it. How many employees are we provisioning for?"),
                ("user", "About 100 new joiners"),
                ("assistant", "Understood. What's your budget for this procurement?"),
                ("user", "Around 50,000 INR"),
                ("assistant", "Perfect. Let me summarize: You need office supplies (notebooks, pens, staplers) for 100 employees with a budget of INR 50,000. I've identified 3 preferred vendors who can fulfill this. Shall I generate an RFQ?")
            ]
        },
        {
            "category": "tactical",
            "requirements": {"item": "Laptops", "specs": "14-inch, i7, 16GB RAM", "quantity": 25, "budget": 2500000},
            "messages": [
                ("user", "Need laptops for the new tech team"),
                ("assistant", "I can help with that. To get the right laptops, could you tell me the desired screen size?"),
                ("user", "14-inch"),
                ("assistant", "Got it. What about the processor (e.g., i5, i7) and RAM (e.g., 16GB, 32GB)?"),
                ("user", "i7 with 16GB RAM"),
                ("assistant", "What is the primary brand you prefer, or should I look for the best value across all brands?"),
                ("user", "Any brand is fine, go with best value"),
                ("assistant", "Understood. Finally, what is the required quantity and the delivery deadline?"),
                ("user", "25 laptops, need them by end of month"),
                ("assistant", "Perfect. So you need 25 units of 14-inch laptops with i7 processor and 16GB RAM, delivered by month end. Based on historical data, I recommend TechSupply Solutions and InnovateTech Systems. Shall I proceed with the RFQ?")
            ]
        }
    ]

    for conv_data in sample_conversations:
        conv = AgentConversation(
            session_id=fake.uuid4(),
            user_id=fake.email(),
            spend_category=conv_data["category"],
            status="completed",
            requirements_gathered=json.dumps(conv_data["requirements"]),
            suggested_vendors=json.dumps(["VND00001", "VND00002", "VND00003"]),
            rfq_generated=True,
            rfq_id=f"RFQ{datetime.now().year}{str(len(conversations)+1).zfill(4)}"
        )
        db.add(conv)
        db.flush()

        for role, content in conv_data["messages"]:
            msg = ConversationMessage(
                conversation_id=conv.id,
                role=role,
                content=content
            )
            db.add(msg)

        conversations.append(conv)
    db.commit()
    return conversations

def seed_database(db: Session):
    """Main function to seed all mock data"""
    print("Seeding vendors...")
    vendors = generate_vendors(db, 30)

    print("Seeding sourcing requests...")
    requests = generate_sourcing_requests(db, vendors, 100)

    print("Seeding supplier bids...")
    bids = generate_supplier_bids(db, requests, vendors)

    print("Seeding contracts...")
    contracts = generate_contracts(db, requests, vendors)

    print("Seeding purchase requisitions...")
    prs = generate_purchase_requisitions(db, 150)

    print("Seeding purchase orders...")
    pos = generate_purchase_orders(db, prs, contracts, vendors)

    print("Seeding invoices...")
    invoices = generate_invoices(db, pos, vendors)

    print("Seeding procurement transactions...")
    transactions = generate_procurement_transactions(db, requests, contracts, pos, invoices)

    print("Seeding spend records...")
    spend_records = generate_spend_records(db, invoices, vendors)

    print("Seeding leakage cases...")
    leakage_cases = generate_leakage_cases(db, invoices)

    print("Seeding KPI metrics...")
    kpi_metrics = generate_kpi_metrics(db)

    print("Seeding agent conversations...")
    conversations = generate_agent_conversations(db)

    print("Database seeding complete!")
    return {
        "vendors": len(vendors),
        "sourcing_requests": len(requests),
        "bids": len(bids),
        "contracts": len(contracts),
        "purchase_requisitions": len(prs),
        "purchase_orders": len(pos),
        "invoices": len(invoices),
        "transactions": len(transactions),
        "spend_records": len(spend_records),
        "leakage_cases": len(leakage_cases),
        "kpi_metrics": len(kpi_metrics),
        "conversations": len(conversations)
    }
