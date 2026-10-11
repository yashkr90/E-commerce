# Project Coding Rules (Non-Obvious Only)

- No `mvnw` wrapper exists — always run `mvn` directly from `backend/`.
- No tests exist yet; when creating them, create `backend/src/test/java/com/ebookstore/` and annotate with `@SpringBootTest` + `@AutoConfigureMockMvc`.
- All entity list fields initialized inline (e.g. `= new ArrayList<>()`) require `@Builder.Default` or the builder silently sets them `null`.
- New `@OneToMany` / back-reference fields on entities MUST get `@JsonIgnore` — missing it causes infinite recursion in Jackson serialization.
- Never add custom exception classes — `GlobalExceptionHandler` only handles `RuntimeException` (→ HTTP 400) and `MethodArgumentNotValidException`.
- `PaymentService.processPayment` has no real payment gateway; it always sets `PaymentStatus.SUCCESS`. Do not add conditional failure logic without also updating the frontend payment flow.
- Gift points are calculated entirely in `OrderService.placeOrder` (deduct before total, earn on final total). Do NOT move this logic to `PaymentService`.
- `CartContext.updateItem` in the frontend sends `productId: itemId` (intentional quirk matching current backend `CartItemRequest` shape for updates). Do not "fix" this without coordinating both sides.
- Frontend has no ESLint, Prettier, or test runner — do not add config files for them unless asked.
- `src/api/index.js` is the only place for HTTP calls; do not use `fetch` directly in components.
