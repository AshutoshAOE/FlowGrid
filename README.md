Overview

FlowGrid is a workflow-oriented logistics orchestration platform built to manage:

Inventory operations
Shipment lifecycle workflows
Warehouse allocation
Driver dispatch coordination
Route intelligence
AI-powered operational insights

Unlike traditional CRUD-based logistics dashboards, FlowGrid is designed as an operational orchestration system where inventory, routing, optimization, dispatch, and workflow state are coordinated through transactional business logic and finite state machine workflows.

Core Features
Workflow-Driven Shipment Lifecycle
Finite State Machine (FSM) shipment workflows
Controlled operational state transitions
Transaction-safe workflow orchestration
Workflow validation engine
Intelligent Optimization Engine
Weighted operational scoring
Distance-aware warehouse allocation
ETA-aware optimization
Driver proximity scoring
Inventory-aware fulfillment logic
Explainable optimization metadata
Inventory Operational Engine
Reservation-based inventory coordination
Inventory availability calculation
Allocation snapshot persistence
Inventory pressure awareness
Transaction-safe reservation handling
Driver Dispatch System
Driver FSM lifecycle management
Driver assignment orchestration
Vehicle capacity validation
Dispatch coordination workflows
Driver release/reassignment support
Route Intelligence Layer

Powered by OpenRouteService

Features:

Route calculation
ETA estimation
Warehouse proximity intelligence
Driver proximity intelligence
Route geometry support
Spatial logistics awareness
AI Operational Intelligence

Powered by Google AI Studio and Gemini API

Features:

Operational summaries
Optimization explanations
Dispatch intelligence
Inventory insights
Workflow explanations
Explainable logistics intelligence
Tech Stack
Frontend
React
TypeScript
Tailwind CSS
Vite
Zustand
Axios
Leaflet
Backend
Node.js
Express
TypeScript
MongoDB
Mongoose
JWT Authentication
Zod Validation
bcrypt
System Architecture

FlowGrid follows a modular monolith architecture with isolated operational modules.

modules/
  auth/
  inventory/
  shipment/
  optimization/
  dispatch/
  routing/
  ai/

Each module contains:

controllers
services
models
routes
validators
types
utilities
Key Architectural Concepts
Finite State Machine (FSM)

Shipment lifecycle is controlled using a finite state machine to prevent invalid operational transitions.

Example:

created
→ optimized
→ driver_assigned
→ in_transit
→ delivered
Weighted Operational Scoring

Warehouse selection uses weighted operational scoring based on:

Distance
Inventory availability
Driver proximity
ETA
Transactional Orchestration

Critical operations use MongoDB transactions to preserve operational consistency.

Examples:

inventory reservation
optimization
dispatch assignment
workflow transitions
Provider Abstraction

Routing and AI systems are abstracted using provider architecture.

This allows future replacement of:

OpenRouteService
Gemini API

without rewriting core business systems.

Algorithms & Concepts Used
Finite State Machine (FSM)
Weighted Operational Scoring
Inventory Reservation Algorithms
Transactional Orchestration
Route Proximity Optimization
RBAC Authorization
Multi-Tenant Isolation
Explainable AI Integration
Routing Architecture

Routing infrastructure is isolated from business orchestration.

routing/
  providers/
    IRoutingProvider.ts
    ors.provider.ts
  services/
    routing.service.ts

Features:

route calculation
ETA estimation
nearest warehouse lookup
nearest driver lookup
AI Architecture

AI remains advisory, not authoritative.

AI can:

explain
summarize
recommend
detect operational insights

AI cannot:

mutate inventory
bypass workflows
override operational rules
Security Features
JWT Authentication
Role-Based Access Control (RBAC)
Multi-Tenant Company Isolation
Protected API Routes
Backend-Controlled Workflow Validation
Secure Password Hashing
Installation
Clone Repository
git clone https://github.com/AshutoshAOE/FlowGrid.git
Install Frontend
cd client
npm install
Install Backend
cd server
npm install
Environment Variables

Create .env inside /server

NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/flowgrid
JWT_SECRET=your_secret_key
ORS_API_KEY=your_ors_key
GEMINI_API_KEY=your_gemini_key
Run Frontend
cd client
npm run dev
Run Backend
cd server
npm run dev
Future Scope
Real-time tracking
Traffic-aware optimization
Advanced fleet routing
Multi-provider AI support
Predictive operational analytics
Vehicle Routing Problem (VRP) optimization
Real-time operational events
Advanced dispatch balancing
Project Philosophy

FlowGrid is not a traditional CRUD logistics dashboard.

It is a workflow-oriented logistics orchestration platform focused on:

operational integrity
explainable optimization
spatial logistics intelligence
transactional consistency
scalable modular architecture
