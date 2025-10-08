#!/bin/bash

set -e

echo "🚀 Setting up the project..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend/rest-api
npm install
cd ../..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Build docker images
echo "🐳 Building Docker images..."
docker-compose build

echo "✅ Setup complete!"
echo ""
echo "To start the application, run:"
echo "  docker-compose up"
echo ""
echo "Services will be available at:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:3001"
echo "  - Kafka UI: http://localhost:8080"
echo "  - PostgreSQL: localhost:5432"
echo "  - Kafka: localhost:9092"
