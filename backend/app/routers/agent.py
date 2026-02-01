"""
Use Case 2: AI Agent for Procurement Automation API
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
import json
import uuid

from app.models.database import (
    get_db, AgentConversation, ConversationMessage, Vendor,
    SourcingRequest, SupplierBid, Contract
)

router = APIRouter(prefix="/api/agent", tags=["AI Procurement Agent"])

# Pydantic models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str
    user_id: Optional[str] = "default_user"

class ChatResponse(BaseModel):
    session_id: str
    response: str
    requirements_complete: bool
    suggested_vendors: Optional[List[dict]] = None
    rfq_ready: bool
    next_prompt: Optional[str] = None

class RFQGenerateRequest(BaseModel):
    session_id: str
    vendor_ids: List[int]

class BidSubmission(BaseModel):
    rfq_id: str
    vendor_id: int
    bid_amount: float
    delivery_days: int
    technical_notes: str

class NegotiationRequest(BaseModel):
    bid_id: str
    counter_offer: float
    message: str

# Category-specific question flows
CATEGORY_QUESTIONS = {
    "laptops": [
        {"field": "screen_size", "question": "What screen size do you prefer? (e.g., 13-inch, 14-inch, 15-inch)"},
        {"field": "processor", "question": "What processor do you need? (e.g., i5, i7, i9, M1, M2)"},
        {"field": "ram", "question": "How much RAM? (e.g., 8GB, 16GB, 32GB)"},
        {"field": "storage", "question": "Storage preference? (e.g., 256GB SSD, 512GB SSD, 1TB SSD)"},
        {"field": "brand", "question": "Any brand preference, or should I find the best value across all brands?"},
        {"field": "quantity", "question": "How many units do you need?"},
        {"field": "deadline", "question": "When do you need them delivered by?"},
        {"field": "budget", "question": "What's your budget per unit or total budget?"}
    ],
    "office_supplies": [
        {"field": "items", "question": "What office supplies do you need? (e.g., notebooks, pens, staplers)"},
        {"field": "quantity", "question": "How many employees are you provisioning for?"},
        {"field": "quality", "question": "Any specific quality requirements? (Standard/Premium)"},
        {"field": "deadline", "question": "When do you need them delivered?"},
        {"field": "budget", "question": "What's your budget for this procurement?"}
    ],
    "software": [
        {"field": "software_type", "question": "What type of software do you need? (Productivity, Security, Development, etc.)"},
        {"field": "licenses", "question": "How many licenses do you need?"},
        {"field": "duration", "question": "License duration? (Monthly, Annual, Perpetual)"},
        {"field": "deployment", "question": "Deployment type? (Cloud, On-premise, Hybrid)"},
        {"field": "budget", "question": "What's your budget?"}
    ],
    "services": [
        {"field": "service_type", "question": "What type of service do you need?"},
        {"field": "scope", "question": "Can you describe the scope of work?"},
        {"field": "duration", "question": "Expected duration of the engagement?"},
        {"field": "location", "question": "Where will the services be delivered?"},
        {"field": "budget", "question": "What's your budget for this service?"}
    ]
}

def detect_category(message: str) -> str:
    """Detect procurement category from user message"""
    message_lower = message.lower()

    if any(word in message_lower for word in ["laptop", "computer", "desktop", "monitor"]):
        return "laptops"
    elif any(word in message_lower for word in ["office", "supplies", "stationery", "notebook", "pen"]):
        return "office_supplies"
    elif any(word in message_lower for word in ["software", "saas", "license", "subscription"]):
        return "software"
    elif any(word in message_lower for word in ["service", "consulting", "support", "maintenance"]):
        return "services"
    else:
        return "general"

def extract_info_from_message(message: str, field: str) -> Optional[str]:
    """Extract relevant information from user message"""
    # Simple extraction logic - in production, this would use NLP/LLM
    return message.strip() if message else None

def get_suggested_vendors(db: Session, category: str, requirements: dict) -> List[dict]:
    """Get vendor suggestions based on category and requirements"""
    vendors = db.query(Vendor).filter(
        Vendor.is_active == True
    ).order_by(Vendor.performance_score.desc()).limit(5).all()

    suggestions = []
    for vendor in vendors:
        categories = json.loads(vendor.categories) if vendor.categories else []
        relevance_score = 0.7 + (vendor.performance_score / 100 * 0.3)

        suggestions.append({
            "vendor_id": vendor.id,
            "vendor_code": vendor.vendor_code,
            "vendor_name": vendor.vendor_name,
            "performance_score": vendor.performance_score,
            "risk_score": vendor.risk_score,
            "categories": categories,
            "relevance_score": round(relevance_score, 2),
            "recommendation": "Highly Recommended" if vendor.performance_score > 80 else "Recommended"
        })

    return sorted(suggestions, key=lambda x: x["relevance_score"], reverse=True)

@router.post("/chat", response_model=ChatResponse)
def chat_with_agent(request: ChatRequest, db: Session = Depends(get_db)):
    """Main chat endpoint for AI agent interaction"""

    # Get or create conversation
    if request.session_id:
        conversation = db.query(AgentConversation).filter(
            AgentConversation.session_id == request.session_id
        ).first()
    else:
        conversation = None

    if not conversation:
        session_id = str(uuid.uuid4())
        category = detect_category(request.message)

        conversation = AgentConversation(
            session_id=session_id,
            user_id=request.user_id,
            spend_category="transactional" if category in ["office_supplies"] else "tactical",
            status="gathering_requirements",
            requirements_gathered=json.dumps({"category": category, "fields": {}})
        )
        db.add(conversation)
        db.commit()
    else:
        session_id = conversation.session_id

    # Save user message
    user_msg = ConversationMessage(
        conversation_id=conversation.id,
        role="user",
        content=request.message
    )
    db.add(user_msg)

    # Parse current requirements
    requirements = json.loads(conversation.requirements_gathered or '{"category": "general", "fields": {}}')
    category = requirements.get("category", "general")
    fields = requirements.get("fields", {})

    # Process message and generate response
    questions = CATEGORY_QUESTIONS.get(category, CATEGORY_QUESTIONS["services"])
    answered_fields = list(fields.keys())

    # Find next unanswered question
    next_question = None
    for q in questions:
        if q["field"] not in answered_fields:
            # Store the answer from current message
            if len(answered_fields) > 0 or category != "general":
                prev_field = questions[len(answered_fields) - 1]["field"] if answered_fields else None
                if prev_field:
                    fields[prev_field] = request.message

            next_question = q
            break

    # If this is first message after category detection, don't store yet
    if not answered_fields and category != "general":
        # First question
        response = f"I can help you with that {category.replace('_', ' ')} procurement. {questions[0]['question']}"
        requirements_complete = False
        suggested_vendors = None
        rfq_ready = False
    elif next_question:
        # Store current answer and ask next question
        current_field_idx = len(answered_fields)
        if current_field_idx > 0:
            prev_field = questions[current_field_idx - 1]["field"]
            fields[prev_field] = request.message

        response = f"Got it. {next_question['question']}"
        requirements_complete = False
        suggested_vendors = None
        rfq_ready = False
    else:
        # All questions answered - store last answer
        if questions:
            last_field = questions[-1]["field"]
            fields[last_field] = request.message

        # Generate summary and vendor suggestions
        requirements_complete = True
        suggested_vendors = get_suggested_vendors(db, category, fields)

        summary_parts = [f"{k.replace('_', ' ').title()}: {v}" for k, v in fields.items()]
        summary = "\n".join(summary_parts)

        vendor_names = [v["vendor_name"] for v in suggested_vendors[:3]]

        response = f"""Perfect! Let me summarize your requirements:

{summary}

Based on your requirements, I've identified these recommended vendors:
1. {vendor_names[0]} (Performance Score: {suggested_vendors[0]['performance_score']})
2. {vendor_names[1]} (Performance Score: {suggested_vendors[1]['performance_score']})
3. {vendor_names[2]} (Performance Score: {suggested_vendors[2]['performance_score']})

Would you like me to generate an RFQ and send it to these vendors?"""

        rfq_ready = True
        conversation.suggested_vendors = json.dumps([v["vendor_id"] for v in suggested_vendors[:3]])
        conversation.status = "vendors_suggested"

    # Update requirements
    requirements["fields"] = fields
    conversation.requirements_gathered = json.dumps(requirements)

    # Save assistant response
    assistant_msg = ConversationMessage(
        conversation_id=conversation.id,
        role="assistant",
        content=response
    )
    db.add(assistant_msg)
    db.commit()

    return ChatResponse(
        session_id=session_id,
        response=response,
        requirements_complete=requirements_complete,
        suggested_vendors=suggested_vendors,
        rfq_ready=rfq_ready,
        next_prompt=next_question["question"] if next_question else None
    )

@router.get("/conversations/{session_id}")
def get_conversation(session_id: str, db: Session = Depends(get_db)):
    """Get full conversation history"""
    conversation = db.query(AgentConversation).filter(
        AgentConversation.session_id == session_id
    ).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = db.query(ConversationMessage).filter(
        ConversationMessage.conversation_id == conversation.id
    ).order_by(ConversationMessage.timestamp).all()

    return {
        "session_id": conversation.session_id,
        "status": conversation.status,
        "spend_category": conversation.spend_category,
        "requirements": json.loads(conversation.requirements_gathered) if conversation.requirements_gathered else {},
        "suggested_vendors": json.loads(conversation.suggested_vendors) if conversation.suggested_vendors else [],
        "rfq_generated": conversation.rfq_generated,
        "rfq_id": conversation.rfq_id,
        "messages": [
            {
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat()
            }
            for msg in messages
        ]
    }

@router.post("/rfq/generate")
def generate_rfq(request: RFQGenerateRequest, db: Session = Depends(get_db)):
    """Generate RFQ based on gathered requirements"""
    conversation = db.query(AgentConversation).filter(
        AgentConversation.session_id == request.session_id
    ).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    requirements = json.loads(conversation.requirements_gathered) if conversation.requirements_gathered else {}
    category = requirements.get("category", "general")
    fields = requirements.get("fields", {})

    # Generate RFQ document
    rfq_id = f"RFQ{datetime.now().year}{str(uuid.uuid4())[:8].upper()}"

    rfq_document = {
        "rfq_id": rfq_id,
        "title": f"Request for Quotation - {category.replace('_', ' ').title()}",
        "created_date": datetime.now().isoformat(),
        "deadline": fields.get("deadline", "2 weeks from issue date"),
        "requirements": fields,
        "evaluation_criteria": [
            {"criterion": "Price", "weight": 40},
            {"criterion": "Technical Compliance", "weight": 30},
            {"criterion": "Delivery Timeline", "weight": 20},
            {"criterion": "Vendor Performance History", "weight": 10}
        ],
        "vendors_invited": request.vendor_ids,
        "terms_and_conditions": [
            "All prices should be inclusive of applicable taxes",
            "Delivery should be at our specified location",
            "Payment terms: Net 30 from invoice date",
            "Warranty/Support terms must be clearly stated"
        ]
    }

    # Update conversation
    conversation.rfq_generated = True
    conversation.rfq_id = rfq_id
    conversation.status = "rfq_sent"
    db.commit()

    # Get vendor details
    vendors = db.query(Vendor).filter(Vendor.id.in_(request.vendor_ids)).all()
    vendor_details = [
        {
            "vendor_id": v.id,
            "vendor_name": v.vendor_name,
            "contact_email": v.contact_email,
            "status": "RFQ Sent"
        }
        for v in vendors
    ]

    return {
        "rfq": rfq_document,
        "vendors": vendor_details,
        "message": f"RFQ {rfq_id} has been generated and sent to {len(vendor_details)} vendors."
    }

@router.get("/rfq/{rfq_id}/bids")
def get_rfq_bids(rfq_id: str, db: Session = Depends(get_db)):
    """Get all bids for an RFQ (mock data for demo)"""
    # In production, this would query actual bid submissions
    mock_bids = [
        {
            "bid_id": f"BID-{rfq_id}-001",
            "vendor_id": 1,
            "vendor_name": "TechSupply Solutions Pvt Ltd",
            "bid_amount": 2350000,
            "delivery_days": 10,
            "technical_score": 92,
            "is_compliant": True,
            "submitted_at": datetime.now().isoformat()
        },
        {
            "bid_id": f"BID-{rfq_id}-002",
            "vendor_id": 2,
            "vendor_name": "InnovateTech Systems",
            "bid_amount": 2480000,
            "delivery_days": 7,
            "technical_score": 88,
            "is_compliant": True,
            "submitted_at": datetime.now().isoformat()
        },
        {
            "bid_id": f"BID-{rfq_id}-003",
            "vendor_id": 3,
            "vendor_name": "SecureIT Solutions",
            "bid_amount": 2290000,
            "delivery_days": 14,
            "technical_score": 85,
            "is_compliant": True,
            "submitted_at": datetime.now().isoformat()
        }
    ]

    # Bid analysis
    analysis = {
        "lowest_bid": min(mock_bids, key=lambda x: x["bid_amount"]),
        "highest_technical_score": max(mock_bids, key=lambda x: x["technical_score"]),
        "fastest_delivery": min(mock_bids, key=lambda x: x["delivery_days"]),
        "recommendation": {
            "vendor_name": "SecureIT Solutions",
            "reason": "Lowest price while meeting all technical requirements",
            "potential_savings": 190000
        }
    }

    return {
        "rfq_id": rfq_id,
        "bids": mock_bids,
        "analysis": analysis,
        "status": "Bids Received"
    }

@router.post("/negotiate")
def negotiate_with_vendor(request: NegotiationRequest, db: Session = Depends(get_db)):
    """Initiate automated negotiation with vendor"""
    # Mock negotiation response
    negotiation_response = {
        "bid_id": request.bid_id,
        "original_amount": 2350000,
        "counter_offer": request.counter_offer,
        "vendor_response": {
            "accepted": request.counter_offer >= 2250000,
            "counter_counter_offer": 2280000 if request.counter_offer < 2250000 else None,
            "message": "We can accept your offer" if request.counter_offer >= 2250000
                       else f"We can offer INR 2,280,000 as our best price"
        },
        "negotiation_round": 1,
        "status": "Accepted" if request.counter_offer >= 2250000 else "Counter Offered"
    }

    return negotiation_response

@router.post("/award")
def award_contract(rfq_id: str, vendor_id: int, db: Session = Depends(get_db)):
    """Award contract to selected vendor"""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()

    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    award_details = {
        "rfq_id": rfq_id,
        "awarded_to": {
            "vendor_id": vendor.id,
            "vendor_name": vendor.vendor_name,
            "vendor_code": vendor.vendor_code
        },
        "award_date": datetime.now().isoformat(),
        "next_steps": [
            "Contract generation initiated",
            "PO creation pending",
            "Vendor notification sent"
        ],
        "status": "Awarded"
    }

    return award_details

@router.get("/status-updates/{session_id}")
def get_status_updates(session_id: str, db: Session = Depends(get_db)):
    """Get procurement status updates for stakeholder communication"""
    conversation = db.query(AgentConversation).filter(
        AgentConversation.session_id == session_id
    ).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Session not found")

    # Mock status timeline
    statuses = [
        {"status": "Requirement Confirmed", "date": datetime.now().isoformat(), "completed": True},
        {"status": "RFQ Sent to Suppliers", "date": datetime.now().isoformat(), "completed": conversation.rfq_generated},
        {"status": "Bids Received", "date": None, "completed": False},
        {"status": "Award Decision Made", "date": None, "completed": False},
        {"status": "PO Number Generated", "date": None, "completed": False}
    ]

    return {
        "session_id": session_id,
        "rfq_id": conversation.rfq_id,
        "current_status": conversation.status,
        "timeline": statuses
    }
