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

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cp .env.example .env
  echo "✓ .env file created"
else
  echo "✓ .env file already exists"
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
echo "1. Start the consumer: npm run consumer"
echo "2. Open Kafka UI: http://localhost:8080"
echo "3. Create topic 'product-events' and send messages"
echo ""
echo "To stop services: docker compose down"
echo ""
