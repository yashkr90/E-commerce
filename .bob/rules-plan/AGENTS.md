# Project Architecture Rules (Non-Obvious Only)

- Security is permissive for read AND write on products/categories/brands — there is no admin-only enforcement despite `User.Role.ADMIN` existing.
- Payment is fake/stub — `PaymentService` always succeeds. Any plan involving real payment processing requires replacing this service and updating the frontend `PaymentPage` flow.
- Gift points state is split: authoritative in PostgreSQL (`users.gift_points`), cached stale in `localStorage` after login. Plans that show live points must re-fetch from `/api/users/{id}` after orders.
- `CartService.getCartByUserId` auto-creates a cart if none exists — there is no separate cart-creation endpoint.
- `OrderService.cancelOrder` enforces a 48-hour window and blocks cancellation of `DELIVERED` orders; `CONFIRMED`/`SHIPPED` orders can be cancelled within that window.
- `RecommendationController` is a thin wrapper on `ProductService` with no dedicated recommendation logic — any ML/personalization feature must be added to `ProductService` or a new `RecommendationService`.
- Frontend provider nesting order in `App.jsx` is load-order-dependent: `CartProvider` reads `useAuth()` on mount, so it MUST be a child of `AuthProvider`.
- No monorepo tooling — `backend/` and `frontend/` are fully independent build roots with no shared scripts at the repo root.
