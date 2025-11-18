# 🌐 Exchange Rates API (Node.js/Express/PostgreSQL)

This project is a RESTful backend API for serving currency exchange rate data. It provides endpoints for both public users and admin users to view, add, update, or delete currency rates. The API uses PostgreSQL as its database and follows a structured MVC-like pattern for maintainability and scalability.

---

## 🛠️ Tech Stack

* **Runtime**: Node.js
* **Framework**: Express
* **Database**: PostgreSQL
* **Database Client**: `pg`
* **Security & Middleware**: CORS, centralized error handling, request logging

---

## 📂 Project Structure

```text
backend/
│
├─ src/
│  ├─ config/
│  │  └─ database.js       # PostgreSQL connection
│  │
│  ├─ controllers/
│  │  ├─ userController.js
│  │  └─ adminController.js
│  │
│  ├─ services/
│  │  ├─ userService.js
│  │  └─ adminService.js
│  │
│  ├─ routes/
│  │  ├─ userRoutes.js
│  │  └─ adminRoutes.js
│  │
│  ├─ middleware/
│  │  ├─ errorHandler.js   # centralized error handling
│  │  └─ ...               # other middleware
│  │
│  ├─ app.js               # Express app configuration
│  └─ server.js            # entry point, server start
│
├─ tests/                  # Jest/Supertest API tests
├─ package.json
└─ .env
```

---

## 💻 Local Development

### Prerequisites

* Node.js >= 18
* PostgreSQL running locally or via Docker with database schema and seed data loaded

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the backend root with the following variables:

| Variable          | Description              | Default                                        |
| ----------------- | ------------------------ | ---------------------------------------------- |
| `PORT`            | API server port          | 5000                                           |
| `DB_HOST`         | PostgreSQL host          | postgres                                       |
| `DB_PORT`         | PostgreSQL port          | 5432                                           |
| `DB_NAME`         | Database name            | exchange_rates_db                              |
| `DB_USER`         | Database username        | postgres                                       |
| `DB_PASSWORD`     | Database password        | postgres_password                              |
| `ALLOWED_ORIGINS` | Frontend URL(s) for CORS | [http://localhost:3000](http://localhost:3000) |

### Run Server

```bash
# Start backend server
node src/server.js

# OR development mode with nodemon
npm run dev
```

Server health check:

```
GET http://localhost:5000/health
```

Response:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-19T10:00:00.000Z"
}
```

---

## 🔗 API Endpoints

### Public Endpoints (User)

| Method | Endpoint                          | Description                          | Query Parameters                       |
| ------ | --------------------------------- | ------------------------------------ | -------------------------------------- |
| GET    | `/api/user/currencies`            | Get all currencies with latest rates | `limit`, `offset`                      |
| GET    | `/api/user/currencies/historical` | Get historical rates by date         | `date` (YYYY-MM-DD), `limit`, `offset` |

### Admin Endpoints

| Method | Endpoint                    | Description                 | Body / Params          |
| ------ | --------------------------- | --------------------------- | ---------------------- |
| GET    | `/api/admin/currencies`     | List all currencies (admin) | -                      |
| POST   | `/api/admin/currencies`     | Add a new currency          | `{ code, name, rate }` |
| PUT    | `/api/admin/currencies/:id` | Update a currency           | `{ code, name, rate }` |
| DELETE | `/api/admin/currencies/:id` | Delete a currency           | `id` in URL            |

**Validation and Errors**

* Currency code must be exactly 3 letters.
* Rate must be a positive number.
* Cannot delete base currency `USD`.
* Responses include JSON error objects with appropriate HTTP status codes (400, 403, 404, 500).

---

## 🧪 Testing

Tests are implemented using **Jest** and **Supertest**:

```bash
# Run all tests
npm test
```

*Test Coverage Includes:*

* `/health` endpoint
* All user and admin routes
* Validation errors
* Database failures
* Unknown route handling

---

## ⚙️ Middleware

* **CORS** – only allows origins specified in `ALLOWED_ORIGINS`
* **Request Logging** – logs HTTP method, path, and timestamp
* **Error Handler** – centralized JSON error responses for all errors

---

## ✅ Features

* Separation of concerns: controllers, services, middleware
* Full CRUD support for admin currency management
* Historical rate retrieval
* Pagination for large datasets
* Health check endpoint
* Centralized error handling and logging
* Easily extensible for authentication and authorization
