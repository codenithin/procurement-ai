#!/bin/bash

echo "======================================"
echo "Flipkart Procurement AI Platform"
echo "======================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed."
    exit 1
fi

# Backend setup
echo ""
echo "Setting up Backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt -q

# Initialize database and seed data
echo "Initializing database with mock data..."
cd app
python3 -c "
from models.database import init_db, SessionLocal
from data.mock_data_generator import seed_database

init_db()
db = SessionLocal()
try:
    result = seed_database(db)
    print(f'Database seeded: {result}')
except Exception as e:
    print(f'Database already seeded or error: {e}')
finally:
    db.close()
"
cd ..

# Start backend server
echo "Starting Backend server on http://localhost:8000..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ..

# Frontend setup
echo ""
echo "Setting up Frontend..."
cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install --silent

# Start frontend server
echo "Starting Frontend server on http://localhost:3000..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "======================================"
echo "Servers started successfully!"
echo "======================================"
echo ""
echo "Backend API:  http://localhost:8000"
echo "API Docs:     http://localhost:8000/docs"
echo "Frontend:     http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
