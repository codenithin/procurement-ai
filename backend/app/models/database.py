from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import enum

SQLALCHEMY_DATABASE_URL = "sqlite:///./procurement.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ProcessStage(enum.Enum):
    REQUEST_INTAKE = "request_intake"
    SOURCING = "sourcing"
    CONTRACTING = "contracting"
    VENDOR_ONBOARDING = "vendor_onboarding"
    PR_PO_CREATION = "pr_po_creation"
    INVOICING = "invoicing"
    PAYMENT = "payment"

class SpendCategory(enum.Enum):
    TRANSACTIONAL = "transactional"
    TACTICAL = "tactical"
    STRATEGIC = "strategic"

class RiskLevel(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class CaseStatus(enum.Enum):
    NEW = "new"
    UNDER_INVESTIGATION = "under_investigation"
    RECOVERY_INITIATED = "recovery_initiated"
    VENDOR_CREDITED = "vendor_credited"
    CLOSED = "closed"

# SAP Ariba - Sourcing System
class SourcingRequest(Base):
    __tablename__ = "sourcing_requests"

    id = Column(Integer, primary_key=True, index=True)
    ariba_id = Column(String(50), unique=True, index=True)
    requirement_description = Column(Text)
    project_description = Column(Text)
    category = Column(String(100))
    subcategory = Column(String(100))
    business_unit = Column(String(100))
    requestor_name = Column(String(100))
    requestor_email = Column(String(100))
    estimated_value = Column(Float)
    currency = Column(String(10), default="INR")
    request_submitted_date = Column(DateTime)
    request_approved_date = Column(DateTime)
    sourcing_event_start = Column(DateTime)
    award_decision_date = Column(DateTime)
    awarded_vendor_id = Column(Integer, ForeignKey("vendors.id"))
    status = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    vendor = relationship("Vendor", back_populates="sourcing_requests")
    supplier_bids = relationship("SupplierBid", back_populates="sourcing_request")
    contracts = relationship("Contract", back_populates="sourcing_request")

class SupplierBid(Base):
    __tablename__ = "supplier_bids"

    id = Column(Integer, primary_key=True, index=True)
    bid_id = Column(String(50), unique=True, index=True)
    sourcing_request_id = Column(Integer, ForeignKey("sourcing_requests.id"))
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    bid_amount = Column(Float)
    technical_score = Column(Float)
    delivery_timeline_days = Column(Integer)
    bid_submitted_date = Column(DateTime)
    is_compliant = Column(Boolean, default=True)
    notes = Column(Text)

    sourcing_request = relationship("SourcingRequest", back_populates="supplier_bids")
    vendor = relationship("Vendor", back_populates="bids")

# Vendor Portal
class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    vendor_code = Column(String(50), unique=True, index=True)
    vendor_name = Column(String(200))
    legal_entity = Column(String(200))
    contact_person = Column(String(100))
    contact_email = Column(String(100))
    contact_phone = Column(String(20))
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    bank_account_number = Column(String(50))
    bank_name = Column(String(100))
    gstin = Column(String(20))
    pan = Column(String(20))
    onboarding_initiated_date = Column(DateTime)
    vendor_activated_date = Column(DateTime)
    compliance_status = Column(String(50))
    risk_score = Column(Float, default=50.0)
    performance_score = Column(Float, default=50.0)
    categories = Column(Text)  # JSON list of categories
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    sourcing_requests = relationship("SourcingRequest", back_populates="vendor")
    bids = relationship("SupplierBid", back_populates="vendor")
    contracts = relationship("Contract", back_populates="vendor")
    purchase_orders = relationship("PurchaseOrder", back_populates="vendor")
    invoices = relationship("Invoice", back_populates="vendor")

# Simplicontract - Contract Management
class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(String(50), unique=True, index=True)
    sourcing_request_id = Column(Integer, ForeignKey("sourcing_requests.id"))
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    contract_purpose = Column(Text)
    contract_type = Column(String(50))  # MSA, SOW, etc.
    contract_value = Column(Float)
    currency = Column(String(10), default="INR")
    payment_terms = Column(String(50))  # Net 30, Net 60, etc.
    contract_drafted_date = Column(DateTime)
    contract_executed_date = Column(DateTime)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    renewal_date = Column(DateTime)
    auto_renewal = Column(Boolean, default=False)
    key_obligations = Column(Text)
    rate_card = Column(Text)  # JSON rate card
    status = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    sourcing_request = relationship("SourcingRequest", back_populates="contracts")
    vendor = relationship("Vendor", back_populates="contracts")
    purchase_orders = relationship("PurchaseOrder", back_populates="contract")

# Oracle Fusion - Procure-to-Pay
class PurchaseRequisition(Base):
    __tablename__ = "purchase_requisitions"

    id = Column(Integer, primary_key=True, index=True)
    pr_number = Column(String(50), unique=True, index=True)
    description = Column(Text)
    requestor_name = Column(String(100))
    business_unit = Column(String(100))
    cost_center = Column(String(50))
    total_amount = Column(Float)
    currency = Column(String(10), default="INR")
    pr_created_date = Column(DateTime)
    pr_approved_date = Column(DateTime)
    status = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    purchase_orders = relationship("PurchaseOrder", back_populates="purchase_requisition")

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    po_number = Column(String(50), unique=True, index=True)
    pr_id = Column(Integer, ForeignKey("purchase_requisitions.id"))
    contract_id = Column(Integer, ForeignKey("contracts.id"))
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    description = Column(Text)
    category = Column(String(100))
    total_amount = Column(Float)
    currency = Column(String(10), default="INR")
    po_created_date = Column(DateTime)
    po_sent_to_vendor_date = Column(DateTime)
    expected_delivery_date = Column(DateTime)
    actual_delivery_date = Column(DateTime)
    status = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    purchase_requisition = relationship("PurchaseRequisition", back_populates="purchase_orders")
    contract = relationship("Contract", back_populates="purchase_orders")
    vendor = relationship("Vendor", back_populates="purchase_orders")
    line_items = relationship("POLineItem", back_populates="purchase_order")
    invoices = relationship("Invoice", back_populates="purchase_order")

class POLineItem(Base):
    __tablename__ = "po_line_items"

    id = Column(Integer, primary_key=True, index=True)
    po_id = Column(Integer, ForeignKey("purchase_orders.id"))
    line_number = Column(Integer)
    item_description = Column(Text)
    quantity = Column(Float)
    unit_price = Column(Float)
    total_price = Column(Float)
    uom = Column(String(20))  # Unit of Measure

    purchase_order = relationship("PurchaseOrder", back_populates="line_items")

# Oracle EBS - Invoicing & Payment
class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True, index=True)
    po_id = Column(Integer, ForeignKey("purchase_orders.id"))
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    invoice_amount = Column(Float)
    tax_amount = Column(Float)
    total_amount = Column(Float)
    currency = Column(String(10), default="INR")
    invoice_date = Column(DateTime)
    invoice_received_date = Column(DateTime)
    due_date = Column(DateTime)
    payment_date = Column(DateTime)
    payment_status = Column(String(50))
    payment_method = Column(String(50))
    transaction_id = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

    purchase_order = relationship("PurchaseOrder", back_populates="invoices")
    vendor = relationship("Vendor", back_populates="invoices")
    line_items = relationship("InvoiceLineItem", back_populates="invoice")
    leakage_cases = relationship("LeakageCase", back_populates="invoice")

class InvoiceLineItem(Base):
    __tablename__ = "invoice_line_items"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    line_number = Column(Integer)
    description = Column(Text)
    quantity = Column(Float)
    unit_price = Column(Float)
    total_price = Column(Float)

    invoice = relationship("Invoice", back_populates="line_items")

# Procurement Lifecycle Transaction - Unified View
class ProcurementTransaction(Base):
    __tablename__ = "procurement_transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String(50), unique=True, index=True)
    sourcing_request_id = Column(Integer, ForeignKey("sourcing_requests.id"))
    contract_id = Column(Integer, ForeignKey("contracts.id"))
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    pr_id = Column(Integer, ForeignKey("purchase_requisitions.id"))
    po_id = Column(Integer, ForeignKey("purchase_orders.id"))
    invoice_id = Column(Integer, ForeignKey("invoices.id"))

    current_stage = Column(String(50))
    total_cycle_time_days = Column(Integer)
    has_bottleneck = Column(Boolean, default=False)
    bottleneck_stage = Column(String(50))
    has_control_gap = Column(Boolean, default=False)
    control_gap_description = Column(Text)
    compliance_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# AI Agent Conversations
class AgentConversation(Base):
    __tablename__ = "agent_conversations"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), index=True)
    user_id = Column(String(100))
    spend_category = Column(String(50))
    status = Column(String(50))
    requirements_gathered = Column(Text)  # JSON
    suggested_vendors = Column(Text)  # JSON
    rfq_generated = Column(Boolean, default=False)
    rfq_id = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    messages = relationship("ConversationMessage", back_populates="conversation")

class ConversationMessage(Base):
    __tablename__ = "conversation_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("agent_conversations.id"))
    role = Column(String(20))  # user, assistant
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("AgentConversation", back_populates="messages")

# Spend Analytics
class SpendRecord(Base):
    __tablename__ = "spend_records"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    category = Column(String(100))
    subcategory = Column(String(100))
    business_unit = Column(String(100))
    cost_center = Column(String(50))
    amount = Column(Float)
    currency = Column(String(10), default="INR")
    spend_date = Column(DateTime)
    fiscal_year = Column(String(10))
    fiscal_quarter = Column(String(10))
    ai_categorized = Column(Boolean, default=False)
    confidence_score = Column(Float)
    is_maverick_spend = Column(Boolean, default=False)
    is_tail_spend = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Leakage Detection
class LeakageCase(Base):
    __tablename__ = "leakage_cases"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String(50), unique=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    leakage_type = Column(String(100))
    description = Column(Text)
    expected_amount = Column(Float)
    actual_amount = Column(Float)
    leakage_amount = Column(Float)
    currency = Column(String(10), default="INR")
    severity = Column(String(20))
    status = Column(String(50))
    assigned_to = Column(String(100))
    validated_by = Column(String(100))
    validation_date = Column(DateTime)
    recovery_initiated_date = Column(DateTime)
    recovery_completed_date = Column(DateTime)
    recovered_amount = Column(Float)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    invoice = relationship("Invoice", back_populates="leakage_cases")

# KPI Metrics
class KPIMetric(Base):
    __tablename__ = "kpi_metrics"

    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String(100))
    metric_value = Column(Float)
    metric_unit = Column(String(50))
    dimension = Column(String(100))  # category, vendor, business_unit
    dimension_value = Column(String(100))
    period = Column(String(20))  # daily, weekly, monthly
    period_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
