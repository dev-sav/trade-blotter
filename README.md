# Trade Blotter

A full-stack trade blotter application for viewing and managing trades with real-time updates across connected clients.

## Features

- View persisted trades in a sortable and filterable blotter
- Create new trades
- Amend active trades
- Cancel trades
- Prevent amendments to cancelled trades
- Prevent cancelling an already cancelled trade
- Real-time trade updates using WebSockets
- PostgreSQL persistence
- Automatic sample data seeding
- Request validation and error handling
- Backend API tests
- Frontend component tests
- Dockerized frontend, backend, and database
- Separate test database

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Vitest
- React Testing Library

### Backend

- Node.js
- TypeScript
- Express
- Prisma ORM
- WebSocket (`ws`)
- Vitest
- Supertest

### Database

- PostgreSQL 16

### Infrastructure

- Docker
- Docker Compose
- Nginx

---

## Getting Started

### Prerequisites

To run the complete application using Docker, you only need:

- Git
- Docker Desktop

You do not need to install Node.js or PostgreSQL locally.

### 1. Clone the repository

    git clone <repository-url>
    cd trade-blotter

### 2. Start the application

    docker compose up --build

Docker Compose starts:

- PostgreSQL
- Backend API
- React frontend

The database schema and sample data are initialized automatically.

### 3. Open the application

Once the containers are running, open:

http://localhost:5173

The backend API is available at:

http://localhost:3000

Health check:

http://localhost:3000/api/health

A successful health check returns:

    {
      "status": "ok"
    }

---

## Database Initialization

PostgreSQL is configured with two databases:

- `tradeblotter` - application database
- `tradeblotter_test` - test database

The `database/init.sql` script creates the test database during PostgreSQL's initial database setup.

Prisma manages the database schema using:

    backend/src/prisma/contract.prisma

When the backend container starts, it:

1. Updates the application database schema.
2. Updates the test database schema.
3. Seeds the application database if it is empty.
4. Starts the API.

The seed process creates 100 sample trades for the application database.

The test database is intentionally not seeded with sample data. Tests create the trades they need.

### Resetting the database

PostgreSQL initialization scripts only run when the PostgreSQL data volume is created for the first time.

To completely reset the local environment:

    docker compose down -v
    docker compose up --build

This removes the existing PostgreSQL volume and recreates both databases from scratch.

---

## Running Tests

The project uses a separate PostgreSQL database for backend tests so that tests do not modify application data.

### Backend tests

From the `backend` directory:

    npm install
    npm run test

If Postgres is reset, rebuild shema before running the test:

    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tradeblotter_test" npx prisma db update

The backend test configuration uses:

    backend/.env.test

which points to the `tradeblotter_test` database.

### Frontend tests

From the `frontend` directory:

    npm install
    npm run test

Frontend tests use Vitest, JSDOM, and React Testing Library.

---

## Backend Development

From the `backend` directory:

### Install dependencies

    npm install

### Run in development mode

    npm run dev

The backend starts using the TypeScript source directly and watches for changes.

### Build

    npm run build

### Start the compiled application

    npm start

### Seed the database

    npm run seed

The seed command only inserts sample trades when the database is empty.

---

## Frontend Development

From the `frontend` directory:

### Install dependencies

    npm install

### Run the development server

    npm run dev

### Build

    npm run build

### Preview the production build

    npm run preview

### Lint

    npm run lint

---

## API

### Get trades

    GET /api/trades

Returns all persisted trades.

### Create a trade

    POST /api/trades
    Content-Type: application/json

Example request:

    {
      "symbol": "AAPL",
      "quantity": 100,
      "price": 182.43,
      "side": "BUY",
      "trader": "Alice",
      "tradeTimestamp": "2026-09-07T08:30:00.000Z"
    }

### Amend a trade

    PATCH /api/trades/:id
    Content-Type: application/json

Example request:

    {
      "symbol": "AAPL",
      "quantity": 200,
      "price": 185.25,
      "side": "BUY",
      "trader": "Alice",
      "tradeTimestamp": "2026-09-07T08:30:00.000Z"
    }

Cancelled trades cannot be amended.

### Cancel a trade

    POST /api/trades/:id/cancel

Cancellation changes the trade status from `ACTIVE` to `CANCELLED`.

A cancelled trade cannot be cancelled again.

---

## Trade Model

| Field | Type | Description |
|---|---|---|
| `id` | integer | Unique trade identifier |
| `symbol` | string | Security symbol |
| `quantity` | integer | Trade quantity |
| `price` | number | Trade price |
| `side` | `BUY` / `SELL` | Trade direction |
| `trader` | string | Trader name |
| `tradeTimestamp` | timestamp | Time the trade occurred |
| `status` | `ACTIVE` / `CANCELLED` | Current trade status |
| `createdAt` | timestamp | Record creation time |
| `updatedAt` | timestamp | Last modification time |

---

## Real-Time Updates

The backend exposes a WebSocket endpoint at:

ws://localhost:3000/ws

Clients receive events when trades are created, amended, or cancelled.

Supported event types:

- `TRADE_CREATED`
- `TRADE_UPDATED`
- `TRADE_CANCELLED`

Example event:

    {
      "type": "TRADE_CREATED",
      "trade": {
        "id": 101,
        "symbol": "AAPL",
        "quantity": 100,
        "price": 182.43,
        "side": "BUY",
        "trader": "Alice",
        "status": "ACTIVE"
      }
    }

The frontend automatically reconnects if the WebSocket connection is lost.

This allows multiple connected clients to stay synchronized without requiring a manual refresh.

---

## Architecture

The application follows a simple layered architecture:

    React Frontend
          |
          | HTTP
          v
    Express API
          |
          v
    Controllers
          |
          v
    Services
          |
          v
    Prisma
          |
          v
    PostgreSQL

Real-time updates are handled separately:

    Trade mutation
          |
          v
    Database update
          |
          v
    WebSocket broadcast
          |
          +----------> Client A
          |
          +----------> Client B
          |
          +----------> Client C

The architecture intentionally remains simple because the expected dataset is relatively small and the exercise does not require distributed processing or multiple backend services.

---


## Design Decisions

### Client-side filtering and sorting

The initial dataset is small, so filtering and sorting are performed on the frontend after retrieving the trades.

This keeps the API straightforward while providing responsive table interactions.

For a significantly larger dataset, filtering, sorting, and pagination could be moved to the backend.

### WebSockets

Native WebSockets were used instead of introducing a larger real-time messaging framework.

The application only needs to broadcast trade mutations to connected clients, making a lightweight WebSocket implementation sufficient for the scope of the exercise.

### PostgreSQL

PostgreSQL provides persistent relational storage while remaining straightforward to run locally using Docker.

### Prisma

Prisma provides the database contract and type-safe database access without requiring handwritten SQL for the application's core persistence operations.

### Separate test database

Tests use `tradeblotter_test` rather than the application database to prevent tests from modifying development/sample data.

### Docker

Docker Compose provides a reproducible environment containing the frontend, backend, and database.

A fresh clone should be runnable without installing Node.js or PostgreSQL locally.

---

## Testing Real-Time Behavior

To verify real-time updates:

1. Start the application using Docker Compose.
2. Open the application in two browser windows.
3. Create a trade in one window.
4. Verify that the new trade appears in the other window without refreshing.
5. Amend the trade.
6. Verify that the updated trade is reflected in both windows.
7. Cancel the trade.
8. Verify that both windows show the cancelled status.

---