#!/bin/bash

set -e

echo "======================================"
echo "Setting up Coding Task Environment"
echo "======================================"
echo ""

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running. Please start Docker and try again."
  exit 1
fi

echo "✓ Docker is running"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend/rest-api
npm install
echo "✓ Backend dependencies installed"
cd ../..
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
echo "✓ Frontend dependencies installed"
cd ..
echo ""

# Install root npm dependencies (if package.json exists)
if [ -f package.json ]; then
  echo "📦 Installing root npm dependencies..."
  npm install
  echo "✓ Root dependencies installed"
  echo ""
fi

# Create .env file if it doesn't exist
if [ -f .env.example ] && [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cp .env.example .env
  echo "✓ .env file created"
else
  echo "✓ .env file already exists or not needed"
fi
echo ""

# Start docker compose
echo "🐳 Starting Docker services..."
docker compose up -d
echo "✓ Docker services started"
echo ""

# Wait for Postgres to be ready
echo "⏳ Waiting for Postgres to be ready..."
until docker exec postgres_db pg_isready -U postgres > /dev/null 2>&1; do
  echo "   Postgres is unavailable - sleeping"
  sleep 2
done
echo "✓ Postgres is ready"
echo ""

# Wait for Kafka to be ready
echo "⏳ Waiting for Kafka to be ready..."
sleep 10
echo "✓ Kafka is ready"
echo ""

# Run migrations
echo "🔄 Running database migrations..."
npm run db:migrate
echo "✓ Migrations completed"
echo ""

echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Test Kafka consumer: npm run backend:old"
echo "2. Start working on tasks (see TASK_1.md, TASK_2.md, TASK_3.md)"
echo "3. View Kafka UI: http://localhost:8080"
