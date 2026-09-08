# Prompt Log

This document records representative prompts and outcomes from the AI-assisted development process. Responses are summarised where appropriate.

## 1. Understanding the Domain

**Prompt:**  
"can you explain to me what a trade blotter is"

**Outcome:**  
Used the explanation to establish the domain model and understand the purpose of the blotter.

---

## 2. Understanding the Actors

**Prompt:**  
"can you explain the actors here"  
"explain the difference between trader and broker"

**Outcome:**  
Used the distinction to avoid conflating the trader represented by a trade with other participants in the trading workflow.

---

## 3. Architecture

**Prompt:**  
"Generate a practical architecture for a React TypeScript frontend and TypeScript backend with a database and real-time trade updates."

**Outcome:**  
Used a simple React + Express + PostgreSQL + Prisma + WebSocket architecture. More complex distributed infrastructure was intentionally avoided.

---

## 4. Database Design

**Prompt:**  
"Design the database schema for the trade blotter including trades, users and audit logs."

**Outcome:**  
Created User, Trade, and AuditLog models. Audit logs reference both the affected trade and the user performing the action. `Trade.trader` remained a string rather than a User foreign key.

---

## 5. Real-Time Updates

**Prompt:**  
"can you make me a WebSocket service for the live updates?"

**Outcome:**  
Implemented a WebSocket server attached to the backend HTTP server. Trade mutations broadcast `TRADE_CREATED`, `TRADE_UPDATED`, and `TRADE_CANCELLED` events. Native WebSockets were selected instead of Socket.IO.

---

## 6. Seed Data

**Prompt:**  
"Seed around 100 trades with randomized data and make the seeder idempotent."

**Outcome:**  
Created randomized sample trades and two application users, Sav and Guest. The seed process was adjusted so repeated execution does not unnecessarily duplicate data.

---

## 7. Trade API

**Prompt:**  
"Implement create, amend and cancel trade endpoints with validation and audit logging."

**Outcome:**  
Implemented controller/service separation, validation, create/amend/cancel operations, and audit records. Cancelled trades cannot be amended or cancelled again.

---

## 8. Frontend User Context

**Prompt:**  
"Add the current user to create/amend/cancel requests."

**Outcome:**  
Added a current-user selector to the UI and included the selected user ID in mutation requests so audit records identify the acting user.

---

## 9. Duplicate WebSocket Update

**Prompt:**  
"The table duplicates trades when I create one, but the duplicate disappears after refresh."

**Outcome:**  
Identified that the same trade was being added once from the HTTP response and once from the WebSocket event. Added an ID check before inserting a trade into frontend state.

---

## 10. API Testing

**Prompt:**  
"what tests should I write for this trade API"

**Outcome:**  
Added tests covering successful creation, amendment and cancellation, invalid requests, cancelled-trade restrictions, repeated cancellation, and invalid trade IDs.

---

## 11. Test Database Isolation

**Prompt:**  
"why are my tests writing to the main database, can't we create a separate one?"

**Outcome:**  
Introduced a dedicated `tradeblotter_test` database and explicitly configured the test command to use it.

---

## 12. AI Usage Documentation

**Prompt:**  
"can you make me this report based on our whole conversation here"

**Outcome:**  
Produced this AI Usage Report and Prompt Log based on the development process.

---