# E-Bookstore Platform — AI Specialist Capstone Project

A full-stack eCommerce platform for browsing, selecting, and purchasing books, built using:
- **Backend:** Spring Boot 3 (Java 17) + PostgreSQL + JWT Auth
- **Frontend:** React 18 + React Router v6
- **AI-Assisted Development:** IBM BOB (Agentic IDE)

---

## Project Structure

```
capstone/
├── openapi.yaml               # OpenAPI 3.0 specification
├── backend/                   # Spring Boot application
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/ebookstore/
│           │   ├── EbookstoreApplication.java
│           │   ├── entity/          # JPA entities
│           │   ├── dto/             # Request/Response DTOs
│           │   ├── repository/      # Spring Data repos
│           │   ├── service/         # Business logic
│           │   ├── controller/      # REST controllers
│           │   ├── security/        # JWT + Spring Security
│           │   └── exception/       # Global error handler
│           └── resources/
│               ├── application.properties
│               └── schema.sql       # DB schema + seed data
└── frontend/                  # React application
    ├── package.json
    └── src/
        ├── api/               # Axios API layer
        ├── context/           # Auth + Cart context
        ├── components/        # Navbar, Footer, ProductCard
        └── pages/             # All page components
```

---

## Data Entities

| Entity       | Description                                      |
|-------------|--------------------------------------------------|
| `User`       | Customers with gift points & roles               |
| `Category`   | Book genres (Fiction, Sci-Tech, Business, etc.)  |
| `Brand`      | Publishers (Penguin, HarperCollins, O'Reilly…)  |
| `Product`    | Books with price, stock, delivery estimate       |
| `Cart`       | Per-user cart with cart items                    |
| `CartItem`   | Individual cart item (product + quantity)        |
| `Address`    | Saved delivery addresses per user                |
| `Order`      | Placed orders with status & cancel support       |
| `OrderItem`  | Line items within an order                       |
| `Payment`    | Payment record (credit/debit/net banking/points) |

---

## Customer Journeys (from Wireframe)

1. **Login / Register** — JWT-secured user authentication
2. **Browse Catalogue** — Filter by category, publisher, search
3. **Product Detail** — View book info, delivery date, related books
4. **Shopping Cart** — Add/remove items, view recommendations
5. **Checkout** — Select delivery address, redeem gift points
6. **Payment** — Credit card / Debit card / Net Banking / Gift Points
7. **Confirmation** — Order confirmation with order details
8. **Order History** — Browse past orders with "Buy Again" feature
9. **Cancel Order** — Cancel within 48 hours

---

## Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 14+ (Community Edition)
- Node.js 18+

### Step 1 — PostgreSQL Setup

```bash
# Install PostgreSQL from https://www.postgresql.org/download/
# Then run the schema file:
psql -U postgres -f backend/src/main/resources/schema.sql
```

### Step 2 — Backend Configuration

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ebookstore
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

### Step 3 — Run Backend

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
# API available at http://localhost:8080/api
```

### Step 4 — Run Frontend

```bash
cd frontend
npm install
npm start
# UI available at http://localhost:3000
```

---

## API Endpoints Summary

| Method | Endpoint                        | Description                    |
|--------|--------------------------------|--------------------------------|
| POST   | /api/auth/register              | Register new user              |
| POST   | /api/auth/login                 | Login (returns JWT)            |
| GET    | /api/categories                 | List all categories            |
| GET    | /api/brands                     | List all publishers            |
| GET    | /api/products                   | List/search products (paged)   |
| GET    | /api/products/{id}              | Get product details            |
| GET    | /api/products/{id}/related      | Get related products           |
| GET    | /api/cart/{userId}              | Get user cart                  |
| POST   | /api/cart/{userId}/items        | Add item to cart               |
| PUT    | /api/cart/{userId}/items/{id}   | Update cart item quantity      |
| DELETE | /api/cart/{userId}/items/{id}   | Remove cart item               |
| GET    | /api/users/{userId}/addresses   | List user addresses            |
| POST   | /api/users/{userId}/addresses   | Add delivery address           |
| POST   | /api/orders                     | Place an order                 |
| GET    | /api/orders/user/{userId}       | Get order history              |
| PUT    | /api/orders/{id}/cancel         | Cancel order (within 48hrs)    |
| POST   | /api/payments                   | Process payment                |
| GET    | /api/recommendations/{userId}   | Get personalised recommendations|

---

## Git Workflow

```bash
git init
git checkout -b feature/api-implementation
git add .
git commit -m "Implement Spring Boot API and React frontend for E-Bookstore"
git push origin feature/api-implementation
# Create Pull Request on GitHub
```

---

## Technology Stack

| Layer      | Technology                     |
|-----------|-------------------------------|
| Backend    | Spring Boot 3.2, Java 17      |
| Database   | PostgreSQL 14+                |
| Security   | Spring Security + JWT (jjwt)  |
| Frontend   | React 18, React Router v6     |
| HTTP Client| Axios                         |
| Build      | Maven (backend), npm (frontend)|
| IDE        | IBM BOB (Agentic AI IDE)      |

---

*Built as part of the AI Specialist — Cloud FullStack Capstone Project using IBM BOB Agentic IDE.*
