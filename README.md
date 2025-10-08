# Coding Interview - Event Processing System

Welcome! This is a hands-on coding challenge that simulates a real-world scenario: extending an event-driven system to handle new data fields.

## Overview

You'll be working with:
- **Kafka** - Message broker for event streaming
- **Postgres** - Database for storing events
- **Node.js** - Consumer application that processes events

The system is already set up and working. Your task is to extend it to handle new fields in the existing event schema.

## Prerequisites

- Docker & Docker Compose
- Node.js (v16 or higher)
- npm

## Getting Started

### 1. Run the setup script

This will start all infrastructure (Kafka, Postgres, etc.) and run database migrations:

```bash
./bash/setup.sh
```

You should see:
```
✅ Setup Complete!
```

### 2. Verify everything works

Test the current system:

```bash
npm run backend:old
```

You should see events being produced and consumed every 10 seconds. Press `Ctrl+C` to stop when you've verified it works.

### 3. Read the task

Open [BACKEND_TASK.md](./BACKEND_TASK.md) for the full challenge description.

## Project Structure

```
├── backend/
│   ├── consumer/           # Kafka consumer (processes events)
│   ├── models/             # Database models
│   └── producer/           # Event producers (for testing)
├── database/
│   ├── migrations/         # Database migrations
│   └── config.js           # Database configuration
├── bash/
│   └── setup.sh            # Infrastructure setup script
├── docker-compose.yml      # Docker services definition
└── BACKEND_TASK.md         # Your coding challenge
```

## Useful Commands

- `npm run backend:old` - Start producer & consumer (original events)
- `npm run backend:new` - Start producer & consumer (new events)
- `npm run db:migrate` - Run database migrations
- `npm run db:migration:create -- migration-name` - Create new migration
- `docker compose down` - Stop all services
- `docker compose down -v` - Stop services and remove volumes

## Troubleshooting

**Containers won't start?**
```bash
docker compose down -v
./bash/setup.sh
```

**Migration errors?**
```bash
docker compose down -v
rm -rf postgres-data
./bash/setup.sh
```

**Need to reset everything?**
```bash
docker compose down -v && rm -rf postgres-data node_modules
npm install
./bash/setup.sh
```

## Questions?

If you encounter any issues with the setup, please reach out to your interviewer.

Good luck! 🚀