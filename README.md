# Coding Interview - Full Stack Event Processing System

Welcome! This is a hands-on coding challenge with 3 tasks that cover backend, API, and frontend development.

## Overview

You'll be working with:
- **Kafka** - Message broker for event streaming
- **Postgres** - Database for storing events
- **Node.js Consumer** - Processes events from Kafka
- **NestJS REST API** - Exposes events via HTTP endpoints
- **Next.js Frontend** - Displays and filters events

## Tasks

1. **[TASK_1.md](./TASK_1.md)** - Extend Kafka consumer and database schema
2. **[TASK_2.md](./TASK_2.md)** - Implement event filtering API endpoint
3. **[TASK_3.md](./TASK_3.md)** - Fix frontend event filtering

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

Test the Kafka consumer:

```bash
npm run backend:old
```

You should see events being produced and consumed every 10 seconds. Press `Ctrl+C` to stop when you've verified it works.

### 3. Start working on the tasks

Complete the tasks in order:
1. **[TASK_1.md](./TASK_1.md)** - Backend (Kafka consumer + database)
2. **[TASK_2.md](./TASK_2.md)** - API (NestJS REST endpoint)
3. **[TASK_3.md](./TASK_3.md)** - Frontend (Next.js filtering)

## Project Structure

```
├── backend/
│   ├── consumer/           # Kafka consumer (Task 1)
│   ├── models/             # Database models (Task 1)
│   ├── producer/           # Event producers (for testing)
│   └── rest-api/           # NestJS REST API (Task 2)
├── frontend/               # Next.js frontend (Task 3)
├── database/
│   ├── migrations/         # Database migrations (Task 1)
│   └── config.js           # Database configuration
├── bash/
│   └── setup.sh            # Infrastructure setup script
├── docker-compose.yml      # Docker services definition
├── TASK_1.md               # Backend task
├── TASK_2.md               # API task
└── TASK_3.md               # Frontend task
```

## Useful Commands

### Task 1 (Backend/Kafka)
- `npm run backend:old` - Start producer & consumer (original events)
- `npm run backend:new` - Start producer & consumer (new events)
- `npm run db:migrate` - Run database migrations
- `npm run db:migration:create -- migration-name` - Create new migration

### Task 2 (API)
- `npm run db:seed` - Seed database with test events
- `npm run test:task2` - Test your API implementation
- `npm run dev:backend` - Start REST API in dev mode

### Task 3 (Frontend)
- `npm run dev:frontend` - Start frontend in dev mode
- `npm run dev` - Start both API and frontend

### Infrastructure
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