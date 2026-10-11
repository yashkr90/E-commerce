# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Commands
- Backend: run Maven from `backend/` (no pom at root, no `mvnw` wrapper — use `mvn`): `mvn spring-boot:run`, `mvn clean install`.
- Single test: `mvn test -Dtest=ClassName#methodName` (from `backend/`). No tests exist yet; `src/test/java` must be created under package `com.ebookstore`.
- Frontend: Vite, not CRA — `npm run dev` from `frontend/` (port 3000). No lint or test tooling is configured.
- DB: PostgreSQL in Docker container `ebookstore-postgres` (postgres/postgres, db `ebookstore`). On Windows PowerShell seed with `Get-Content backend/src/main/resources/schema.sql | docker exec -i ebookstore-postgres psql -U postgres -d ebookstore` (`<` redirection fails in PowerShell).
- `schema.sql` is NOT auto-run by Spring (non-embedded DB) and contains psql meta-commands (`\c`); tables are created by `ddl-auto=update`, seed data only via psql.

## Backend conventions (`com.ebookstore`)
- Controllers return JPA entities directly (only `User` goes through `UserDto`). Any new bidirectional/back-reference field MUST get `@JsonIgnore` or serialization recurses; `User.password` is `@JsonIgnore`.
- Entities use Lombok `@Data @Builder`; initialized fields need `@Builder.Default` or the builder sets them null.
- Errors: services throw plain `RuntimeException`; `GlobalExceptionHandler` maps ALL of them to HTTP 400 (including not-found). No custom exception classes.
- Request DTOs live in `dto/` (except `UserController.updateUser`, which takes a raw `Map`); injection is `@RequiredArgsConstructor` + `final` fields.
- Security (`SecurityConfig`): `/api/auth|categories|brands|products/**` are permitAll for every HTTP method (incl. product POST/PUT/DELETE); everything else needs `Authorization: Bearer <jwt>`. CORS allows only `http://localhost:3000`.
- `app.jwt.secret` is used as raw bytes for HS256 (`Keys.hmacShaKeyFor`): it must stay >= 32 characters, otherwise register/login throw `WeakKeyException` (the app still starts).
- `CartService.addItem` increments quantity if the product is already in the cart (does not replace); `updateItem` with quantity <= 0 removes the item.
- `OrderService.placeOrder` sets status to `CONFIRMED` immediately (not `PENDING`); `PaymentService.processPayment` always succeeds (no real gateway — sets `PaymentStatus.SUCCESS` unconditionally and generates a random `transactionId`).
- Gift points economy: 1 point = $0.01 discount; earn 1 point per $1 of final total (after discount). Points are deducted/credited inside `OrderService`, NOT `PaymentService`. `localStorage` `giftPoints` is stale after any order.
- `RecommendationController` has no dedicated service — it delegates directly to `ProductService.getRecommendations()`. There is no `RecommendationService`.
- `Order.user` is `@JsonIgnore` (lazy); `Order.address` is EAGER and serialized. `CartItem.cart` is `@JsonIgnore`; `CartItem.product` is EAGER.

## Frontend conventions (`frontend/src`)
- Components are `.jsx`; imports omit extensions. All HTTP calls go through `src/api/index.js` (relative base `/api`, relies on the Vite proxy in `vite.config.js`).
- Cart mutations go through `CartContext` so the navbar badge stays in sync.
- Auth user is cached in `localStorage` at login; `giftPoints` there is stale after orders.
- `CartProvider` must be nested inside `AuthProvider` in `App.jsx` — it reads `useAuth()` on mount to fetch the cart.
- `CartContext.updateItem` passes `productId: itemId` (reuses itemId as productId) — this is a quirk of the current implementation.
