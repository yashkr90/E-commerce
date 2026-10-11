# Project Documentation Context (Non-Obvious Only)

- `frontend/src/api/index.js` is a single file (not a folder) exporting named API objects (`authAPI`, `cartAPI`, etc.) — all HTTP goes through one axios instance with a JWT interceptor.
- There is no `RecommendationService` class; recommendations are served by `ProductService.getRecommendations()` via `RecommendationController`.
- `schema.sql` exists but is intentionally NOT auto-executed by Spring Boot (non-embedded DB). It also contains `\c` psql meta-commands that break JDBC execution — it is only for manual seeding via psql.
- `Order.status` is set to `CONFIRMED` by `placeOrder` (not `PENDING`); the `PENDING` enum value is unused in practice.
- The frontend entry point is `frontend/index.html` + `frontend/src/main.jsx` (Vite), NOT `public/index.html` + `src/index.js` (the old CRA files are deleted).
- `UserDto` is the only DTO used as a response type; all other endpoints return JPA entities directly.
