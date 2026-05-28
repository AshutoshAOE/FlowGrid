# FlowGrid Implementation Context

This document explains the foundational architecture decisions for the FlowGrid logistics operations platform. It is intended to help future AI agents or developers understand the project structure and technical strategy without needing to re-analyze the entire codebase.

## 1. What Was Implemented (Shipment Optimization & Allocation Engine)

FlowGrid has evolved from isolated operational states into a coordinated logistics orchestration engine. The `optimization` module now bridges the Shipment FSM and Inventory Engine atomically.

## 2. Optimization Orchestration Architecture
We created `optimization.service.ts` to act as the central brain. It sits between domains, ensuring shipments and inventory do not form circular dependencies.

## 3. Greedy Allocation Strategy
The engine employs a **Highest Availability** greedy strategy (`optimization.strategy.ts`):
- It fetches all inventory records for a requested product.
- It dynamically computes `Available = Quantity - ReservedQuantity`.
- It sorts warehouses by highest availability.
- It consumes inventory from warehouses sequentially until the total shipment item requirement is met.
- If the requirement cannot be met across the network, the engine aborts and gracefully returns an array indicating failure.

## 4. Multi-Document Atomic Workflow (Mongoose Transactions)
The orchestration is strictly atomic. Inside `runShipmentOptimization`:
1. `session.startTransaction()` is invoked.
2. The shipment is locked and verified to be in the `CREATED` state.
3. The allocation strategy computes the fulfillment plan.
4. The orchestrator iterates over the plan and explicitly calls `inventoryService.reserveInventory(..., session)` for every required line item.
5. If *any* inventory reservation fails (e.g., someone else sniped the stock mid-transaction), the entire transaction aborts natively via MongoDB, rolling back any partial locks.
6. If successful, the `allocationSnapshots` are written permanently to the shipment document.
7. The FSM is progressed via `shipmentService.optimizeShipment(..., session)`.
8. `session.commitTransaction()` executes, locking in all cross-collection changes instantaneously.

## 5. Allocation Persistence
We explicitly decided **not** to recalculate routes/allocations dynamically after optimization. Once `runShipmentOptimization` succeeds, the exact `warehouseId` and `quantity` pairings are frozen into the shipment's `allocationSnapshots` array. This creates a permanent operational audit trail.

## 6. Frontend Orchestration Visibility
The `Shipments.tsx` UI was updated with an "Allocations" column. It decodes the permanent snapshots and displays precisely how many units of a product are being fulfilled by which specific warehouse ID, replacing the need for messy auxiliary database joins on the frontend.

## 7. Recommended Next Phase
**Phase: Route Intelligence & Driver Dispatching**

## 8. Runtime Stabilization & Tooling Decisions

### Backend Tooling & TypeScript Fixes
During development, several strict TypeScript issues and configuration mismatches occurred.
- **TS5011 RootDir Error:** Explicitly defined `"rootDir": "./src"` and `"outDir": "./dist"` in `tsconfig.json`.
- **Module Resolution:** Changed `module` from `nodenext` to `commonjs` and turned off `verbatimModuleSyntax` and `strict`. This prevents experimental ES module conflicts and strict-mode false positives (`TS2532`, `TS2345`) while keeping the system stable for rapid prototyping.
- **Error Consolidation:** All disparate custom AppErrors (`NotFoundError`, `ValidationError`, etc.) were refactored and consolidated cleanly into `AppError.ts`. 

### Frontend Tooling & Tailwind Stabilization
A PostCSS/Vite compilation failure was resolved by standardizing on a stable CSS setup:
- **Tailwind Version Reversion:** The project was downgraded from the unstable Tailwind v4 architecture to `tailwindcss@^3.4.1`.
- **PostCSS Alignment:** Using native `postcss` and `autoprefixer` plugins inside `postcss.config.js`.
- **CSS Import Safety:** Restored standard `@tailwind base;` directives inside `index.css` to prevent `[plugin:vite:css]` compilation errors.

## 9. Driver Dispatch Engine Architecture

### 9.1 Dispatch Orchestration (`src/modules/dispatch`)
A new orchestration layer (`dispatch.service.ts`) was created to govern driver allocation. Instead of allowing the frontend or standard shipment controllers to dictate assignments directly, all operational logistics execution now flows through this engine. It ensures the backend acts as the sole source of truth.

### 9.2 Driver Resource Modeling Decisions
Drivers transitioned from static lists to active operational resources. We centralized `DRIVER_STATUSES` (AVAILABLE, ASSIGNED, IN_TRANSIT, OFFLINE) and enforced them strictly across MongoDB indexes to optimize `getAvailableDrivers` queries.

### 9.3 Capacity Validation Strategy
Before a driver is assigned, the dispatch engine evaluates their total capacity against the shipment load. The load is calculated by summing `quantity * (product.weight || 1)` for each item in the shipment snapshot. If the load exceeds the driver's `vehicleCapacity`, the dispatch transaction explicitly aborts with a Conflict Error.

### 9.4 Workflow Coordination & State Synchronization
The dispatch engine acts as a bridge between the driver state machine and the shipment FSM. 
When a shipment transitions from `OPTIMIZED` to `DRIVER_ASSIGNED`:
1. The shipment FSM advances.
2. The driver status updates to `ASSIGNED`.
This logic propagates safely to `IN_TRANSIT` (both entities transition) and `DELIVERED` (shipment finishes, driver is released back to `AVAILABLE`).

### 9.5 Transaction Safety Decisions
All dispatch orchestrations use `runWithTransaction(session)`. Partial dispatch states are prevented natively. If the FSM rejects a transition or if capacity validation fails, no dangling states occur.

### 9.6 Frontend Dispatch UI Architecture
The raw prompts for assigning drivers were replaced with a state-aware "Assign Available Driver" modal in `Shipments.tsx`. It actively queries `GET /drivers/available` to only show viable resources, preventing the user from attempting impossible assignments. Status badges reflect current operational availability.

### 9.7 Current Limitations & Future Direction
- **Dispatch Events:** Currently handled synchronously. In the future, emit asynchronous lightweight events (e.g., `DriverAssigned`, `ShipmentDispatched`) for push notifications or analytics.
- **Route Intelligence:** The assignment operates on capacity, but not geofencing or shortest-distance heuristics yet. This architecture prepares the groundwork for injecting route intelligence checks during validation.
- **Real-Time Tracking:** We have placeholders for `currentCoordinates` in the driver schema, ready for WebSocket location integrations.

## 10. Route Intelligence Layer Architecture

### 10.1 Provider Abstraction Strategy
Routing has been introduced as infrastructure rather than business logic. A generic `IRoutingProvider` interface was established to decouple the FlowGrid business logic from any specific mapping vendor. The first concrete implementation is `ORSProvider` (OpenRouteService). This ensures that migrating to Google Maps, HERE, or Mapbox in the future will not require rewriting any orchestration or dispatch logic; only a new provider class is needed.

### 10.2 Service Capabilities (`routing.service.ts`)
The routing service currently acts as the central spatial orchestration point, providing:
- **`calculateRoute`**: Returns accurate distance, ETA (duration), and encoded polyline geometries.
- **`findNearestWarehouse`**: Uses the ORS Matrix API to rank an array of warehouses against a destination to find the lowest drive-time.
- **`findNearestDriver`**: Uses the ORS Matrix API to rank active drivers against a shipment origin.

*Note on Integration: These matrix lookup methods are exposed but not yet tightly integrated into the greedy inventory allocation or FSM orchestration. This lays the groundwork for the next phase.*

### 10.3 Frontend Spatial Visualization
The frontend integration relies on `react-leaflet` to avoid Mapbox licensing issues or API key leaks. 
- **Polyline Decoding**: A custom, lightweight polyline decoder was written inside `RouteMap.tsx` to translate ORS encoded geometries into standard Leaflet coordinate arrays.
- **Operational UX**: The route preview map is injected directly into the Dispatch/Assign Driver modal in `Shipments.tsx`. It provides real-time distance and ETA metrics to the dispatcher before assignment.

### 10.4 Future Routing Considerations
- **Caching**: ETA and route geometries should be cached (e.g., using Redis) for common warehouse-to-destination pairs to prevent API rate-limiting.
- **Live Tracking**: Driver models contain a `currentCoordinates` object. Combining this with WebSocket infrastructure could allow live map rendering, though this remains out of scope for the current snapshot architecture.

## 11. Operational Control Center Architecture

### 11.1 Frontend Transformation Strategy
The frontend has evolved from standard CRUD views into an **Operational Control Center**, prioritizing data density, state awareness, and execution monitoring over consumer-facing aesthetics. 
- **Design Language**: Strict adherence to a clean, spatial grid layout utilizing a constrained operational color palette (greens/blues for stability, yellow/red for warnings/actionability).
- **Reusable Component System**: Key visual identifiers are standardized. The `StatusBadge` centralizes the color/text mapping for Shipments, Drivers, and Inventory. The `WorkflowPipeline` visualizes the FSM progression seamlessly across tables and modals.

### 11.2 Dashboard Orchestration (Backend Aggregation)
To power the Dashboard without forcing the client to pull all entities and compute locally (which breaks at scale), a dedicated `/api/v1/dashboard/metrics` endpoint was created via the `dashboard.service.ts`.
- **Shipment Distribution**: Aggregates MongoDB pipeline stages to return exact counts for each FSM state.
- **Inventory Pressure**: Computes the ratio of `reservedQuantity` vs `quantity` across all warehouses instantly via `$sum` aggregations.
- **Fleet Utilization**: Computes active vs inactive driver statuses.
This ensures the frontend remains a thin, highly performant presentation layer while the backend acts as the single source of truth for complex metrics.

### 11.3 Domain UI Enhancements
- **Shipments**: Now displays a full pipeline stepper (`WorkflowPipeline`) directly in the table, bridging the gap between list-view and detail-view.
- **Inventory**: Features an "Operational Pressure" progress bar, instantly highlighting SKUs that are near capacity limits.
- **Drivers**: Integrated with the standardized `StatusBadge` system for unified visual hierarchy.

### 11.4 Future AI Integration Compatibility
The clean separation of aggregation endpoints (Dashboard module) from mutation endpoints (Shipment/Inventory modules) paves the way for the future AI insight layer. An LLM agent could ingest the exact `/dashboard/metrics` payload to generate natural language operational briefings without requiring direct database access.

### Remaining Runtime Limitations
- **Strict Typing:** Strict typing is currently disabled in the backend. If enterprise-level type safety is mandated later, all Express controller `Request` generic mappings and database nullable assertions will need to be strictly audited.

---

## 12. AI Operational Intelligence Layer Architecture

### 12.1 Explainability & Advisory Principle
The core mandate of the AI module is to act strictly as an **advisory and explainability layer**. It is explicitly walled off from database mutation capabilities. AI cannot bypass the FSM, adjust inventory, or dispatch drivers. The backend operational orchestration engine remains the sole authority.

### 12.2 Provider Abstraction & Architecture (`modules/ai`)
The AI module was built around a rigid provider abstraction. 
- **`IAIProvider.ts`**: Defines a simple contract (`generateText`) that any future LLM vendor can implement.
- **`gemini.provider.ts`**: The current concrete implementation utilizing Google's `@google/generative-ai` SDK (`gemini-1.5-flash`).
- **`providers/index.ts`**: Acts as the factory/injector. Switching to OpenAI or a local Llama model in the future requires swapping exactly one line of code in this factory.

### 12.3 Prompt System & Context Strategy
To prevent uncontrolled DB exposure and context window bloat, the system relies on **Structured Context Builders**:
- **`operationalContext.builder.ts`**: Reuses the dense aggregation from `dashboard.service.ts` to build a clean JSON payload mapping out active shipments, fleet distribution, and inventory pressure.
- **No Raw Dumps**: AI prompts never receive unformatted Mongo documents. They receive pre-calculated operational metrics.
- **System Prompts (`system.prompts.ts`)**: The AI is instructed to return *only* raw JSON conforming to a strict `AIInsightResponse` interface (`title`, `description`, `severity`, `category`, `recommendedAction`).

### 12.4 Response Validation & Failure Handling
Because LLMs can hallucinate or output malformed JSON (due to markdown wrapping), a dedicated `responseValidator.ts` sanitizes every response. If the AI hallucinates bad JSON or the API times out, the validator catches the error and returns a safe fallback "System Warning" insight, ensuring the UI never crashes due to AI instability.

### 12.5 Frontend AI UX (Operational Aesthetics)
The UI intentionally avoids "chatbot" tropes. There are no conversational dialogs or generic chat bubbles.
- **Intelligence Dashboard**: A new `/intelligence` page renders `InsightCard`s color-coded by severity (Critical = Red pulse, Warning = Amber, Info = Blue).
- **Natural Language Query**: Provides a specific, focused `QueryBar` allowing users to ask questions like *"Why is inventory pressure high?"*. The backend wraps this query alongside the structured operational context, forcing the AI to answer *only* based on the current state.

### 12.6 Recommended Next Phase
**Phase: Deep Workflows & Predictive Explanations**
- Integrate `optimizationInsights.service.ts` to explain *why* the greedy allocator picked a specific warehouse over another.
- Integrate `workflowInsights.service.ts` to explain *why* an FSM transition failed for a user.
- Add WebSockets for real-time AI insight invalidation when operational states mutate.

---

## 13. Weighted Operational Scoring Architecture

### 13.1 Strategy Abstraction
The optimization engine transitioned from a naive inventory-first approach to a mature **Weighted Operational Scoring** model. The `optimization.service.ts` now acts as a pure orchestrator, delegating the allocation logic to isolated strategy functions (`modules/optimization/strategies`).
- **`inventoryFirst.strategy.ts`**: Preserved as a baseline legacy strategy.
- **`weightedOperational.strategy.ts`**: The new active intelligent strategy.

### 13.2 Deterministic Multi-Factor Scoring
The engine implements deterministic intelligence using four core operational factors:
1. **Distance (40%)**: Driven by the `routingProvider` calculating precise polyline distances from warehouse to destination.
2. **Inventory Availability (35%)**: Evaluates absolute available inventory stock (quantity minus reserved).
3. **Driver Proximity (15%)**: Evaluates the nearest available driver to the fulfilling warehouse.
4. **ETA (10%)**: The drive time duration from warehouse to destination.

### 13.3 Normalization System
Because these metrics exist in vastly different units (meters, seconds, inventory counts), the `scoreNormalizer.ts` introduces deterministic bounds mapping. Every factor is mapped to a `0.0` to `1.0` scale. Distance, Driver Proximity, and ETA use an inverse mapping (lower is better), whereas Inventory uses a standard mapping (higher is better).

### 13.4 Strategy Execution Pipeline
1. **Feasible Filtering**: Any warehouse lacking positive available inventory for the requested product, or lacking valid coordinates, is aggressively pruned before scoring begins.
2. **Context Gathering**: Queries routing matrices and available drivers.
3. **Normalization & Scoring**: Computes raw metrics, normalizes them, and runs them through `scoreCalculator.ts`.
4. **Allocation**: Sorts the warehouses descending by final score and iteratively allocates units until the shipment is fulfilled.

### 13.5 Persistence and Explainability Metadata
The FSM and Transaction Orchestration (`runShipmentOptimization`) remain wholly intact and unmodified. The major upgrade is in the output: the engine now bundles an `optimizationMetadata` object into each `AllocationResult`.
- Contains `strategy`, `finalScore`, and a `factors` dictionary of all raw and normalized metrics.
- This is persisted directly into the shipment document's `allocationSnapshots` array, preserving a permanent, immutable record of *why* the algorithm made a specific logistical decision.

### 13.6 Frontend Scoring Visualization
The UI (`Shipments.tsx`) was upgraded to present this metadata cleanly without relying on generic AI or black-box visuals. A new `ScoringBreakdown.tsx` modal was added, rendering the 0-100 score along with visual progress bars for each weighted factor, cementing the "Operational Control Center" paradigm.

### 13.7 Current Limitations & Future AI Compatibility
- **Large Routing Matrices**: Currently, the engine performs a complete combinatorial matrix check (`available drivers x feasible warehouses`). For enterprise scale (>1,000 active drivers), a geo-spatial indexing prune (like MongoDB `$near`) must occur *before* the matrix calculation.
- **Missing Coordinates**: Shipments or warehouses without valid GPS coordinates gracefully fail back to baseline (score 0 for distance/ETA) but allow fulfillment if inventory exists.
- **AI-Assisted Optimization Compatibility**: Because all metadata is permanently stored, the AI layer (Phase 12) can simply read the `allocationSnapshots.optimizationMetadata` field to generate natural language explanations for optimization outcomes.

### 13.8 Recommended Next Phase
**Phase: Deep Workflows & Predictive Explanations (AI Expansion)**
With deterministic metadata now persisted, the AI layer should be expanded to digest `optimizationMetadata` and FSM failures, surfacing contextual, plain-english insights for dispatchers.
