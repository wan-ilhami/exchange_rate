# 💰 Exchange Rate Application (Full-stack)

A full-stack web application designed to display the latest and historical exchange rates, built for the **U-Reg Coding Challenge**. The application provides a responsive frontend with a robust backend API and a PostgreSQL database for storing currency and rate data.

---

## 🏗️ Project Overview

This application consists of three main components:

1. **`backend/`** – Node.js + Express RESTful API
2. **`frontend/`** – Next.js application consuming the backend API
3. **`database/`** – PostgreSQL database container with currency and rate data

---

## ✨ Features

* Display **latest exchange rates** immediately on page load.
* Allow users to **select a historical date** to view past exchange rates.
* **Lazy-loading** support: load 12 currencies per scroll. *(Stretch Objective)*
* **Containerized** environment with **Docker Compose** for consistent setup. *(Stretch Objective)*
* Structured, maintainable code with **MVC-like pattern** for the backend.
* **Secured API endpoints** and proper **error handling**.

---

## 🚀 Getting Started

The recommended way to run this project is using **Docker Compose**, which sets up the frontend, backend, and database together.

### Prerequisites

* [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.

### Running the Application

1. **Clone the repository**:

   ```bash
   git clone https://github.com/wan-ilhami/exchange_rate.git
   cd exchange_rate
   ```

2. **Build and start the containers**:

   ```bash
   docker-compose up --build
   ```

   This command will:

   * Build `backend` and `frontend` Docker images.
   * Start the `postgres` database container and initialize the schema from `./database/schema.sql`.
   * Start the **backend API server** on port `5000`.
   * Start the **frontend Next.js server** on port `3000`.

3. **Open the application**:

   Navigate to:

   ```
   http://localhost:3000
   ```

   > Tip: It may take a few seconds for all services to become fully healthy.

---

## 📂 Project Structure

```
project-root/
│
├── backend/          # Node.js API
│   ├── controllers/  # Route handlers
│   ├── services/     # Business logic
│   ├── routes/       # API routes
│   ├── middleware/   # Error handling, authentication
│   └── config/       # Database & environment configs
│
├── frontend/         # Next.js application
│   ├── app/          # Route-based pages
│   ├── components/   # Reusable UI components
│   ├── services/     # API call logic
│   ├── lib/          # Utility functions & constants
│   └── ui/           # Tailwind + Radix UI components
│
├── database/         # PostgreSQL schema and seed scripts
│   └── schema.sql
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Environment Variables

### Backend

| Variable          | Description          | Default                                        |
| ----------------- | -------------------- | ---------------------------------------------- |
| `PORT`            | Backend server port  | 5000                                           |
| `DB_HOST`         | Database host        | postgres                                       |
| `DB_PORT`         | Database port        | 5432                                           |
| `DB_NAME`         | Database name        | exchange_rates_db                              |
| `DB_USER`         | Database user        | postgres                                       |
| `DB_PASSWORD`     | Database password    | postgres_password                              |
| `ALLOWED_ORIGINS` | CORS allowed origins | [http://localhost:3000](http://localhost:3000) |

### Frontend

| Variable              | Description              | Default                                        |
| --------------------- | ------------------------ | ---------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL for backend API | [http://localhost:5000](http://localhost:5000) |

---

## ✅ Notes

* **Lazy-loading** implementation limits results per page (default 12 currencies).
* **Error handling** and logging are applied across backend routes.
* Designed for **easy extension** to support features like admin management, authentication, or additional currencies.
