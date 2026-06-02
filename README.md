# Code Vault 🔐

Code Vault is a professional, modern, secure, and performant web application designed for developers to store, organize, search, and manage reusable code snippets. Built with a robust **Spring Boot (Java 25)** backend and a cutting-edge **TanStack Start (React 19 & Vite 8)** frontend, it represents an enterprise-grade solution for keeping track of developer knowledge.

---

## 🏗️ System Architecture

Code Vault utilizes a modern, decoupled architecture separating the rich, client-side application from the stateless API services.

```mermaid
graph TD
    Client[React Frontend / TanStack Start] <-->|HTTP / REST API| Server[Spring Boot Backend]
    Server <-->|JPA / Flyway| DB[(PostgreSQL Database)]
    Server <-->|Lettuce Client| Redis[(Redis - Cache & Rate Limiting)]
    Server -->|SMTP / SMTP TLS| SMTP[Mail Server]
```

- **Frontend**: A server-run TanStack Start application providing fast initial loads, SEO optimization, and a client-side Single Page Application (SPA) experience with type-safe routing.
- **Backend**: A Spring Boot API featuring high-performance Java 25, stateless JWT auth, distributed rate-limiting, and PostgreSQL full-text search.
- **Cache & Storage**: Redis handles Bucket4j rate-limiting states and caching, while PostgreSQL stores users, roles, snippets, tags, and collections.
- **Mailer**: Spring Mail handles SMTP tasks for OTP verification and password reset flows.

---

## ⚡ Key Features

- **Snippet Library**: Store reusable code blocks with full syntactic context (title, description, programming language, custom tags).
- **Advanced Full-Text Search**: Powered by PostgreSQL GIN indexes, allowing users to search code, titles, and descriptions dynamically.
- **Collections & Organization**: Group related snippets into project-based or framework-based Collections (e.g., "React Hooks", "Docker configurations").
- **Language Analytics**: An interactive dashboard showing metrics on total snippets, favorite counts, collections, and a visual breakdown of your programming language mix.
- **Distributed Rate Limiting**: Bulletproof API protection using Redis-backed Bucket4j token bucket rate limiting (200 requests/min for authenticated users; 30 requests/min for anonymous users).
- **Robust Authentication**: Dual-token JWT system utilizing memory-stored Access Tokens and secure `HttpOnly` Refresh Token Cookies, complete with automated Axios refreshing queue.
- **Admin Dashboard**: Full administrative capability including system statistics (totals of users, snippets, tags, collections), paginated user list search, user account deletion, and role assignment.

---

## 🛠️ Technology Stack

| Component | Technology | Version / Details |
| :--- | :--- | :--- |
| **Backend Core** | Java | 25 |
| **Backend Framework** | Spring Boot | 4.0.6 |
| **Database** | PostgreSQL | Latest |
| **Cache & Limiter** | Redis (Lettuce) | Latest |
| **Database Migration** | Flyway | Integrates with Spring Data JPA |
| **Security** | Spring Security | JWT stateless & BCrypt hashing |
| **Rate Limiter** | Bucket4j | Redis-backed token bucket |
| **Frontend Framework** | React | 19.2.0 |
| **Meta-Framework** | TanStack Start | Latest (Vite 8 driven, Nitro server) |
| **Routing** | TanStack Router | File-based, type-safe routing |
| **State Management** | Zustand & React Query | Global UI state & server data fetching |
| **Code Formatting** | Biome | 2.4.5 (linter & formatter) |
| **Styling** | Tailwind CSS | v4.1.18 |

---

## 🚀 Quick Start & Development Setup

Follow these steps to spin up the entire local workspace.

### Prerequisites
- [Docker & Docker Compose](https://www.docker.com/)
- [Java Development Kit (JDK) 25](https://jdk.java.net/25/)
- [Node.js v20+](https://nodejs.org/)

### Step 1: Spin up Databases (Docker Compose)
From the root directory, start the PostgreSQL and Redis containers:
```bash
docker compose -f server/compose.yaml up -d
```
This starts:
- PostgreSQL on `localhost:5432` (database: `code-vault`, user: `meet`, password: `1234`)
- Redis on `localhost:6379`

### Step 2: Run the Backend Server
1. Navigate to the `server` directory.
2. Ensure you have the `.env` file configured.
3. Start the Spring Boot application:
   - On Windows: `.\gradlew.bat bootRun`
   - On macOS/Linux: `./gradlew bootRun`

The backend runs on `http://localhost:8080` (with API endpoints starting at `/api`).

### Step 3: Run the Frontend Client
1. Navigate to the `client` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

The client will start on `http://localhost:3000`.

---

## 📁 Repository Structure

```
code_vault/
├── client/                 # TanStack Start / React frontend
│   ├── src/                # Frontend source code
│   │   ├── api/            # Axios API config & interceptors
│   │   ├── components/     # Global & UI (shadcn) components
│   │   ├── features/       # Feature-sliced modules (auth, snippets, admin...)
│   │   ├── routes/         # File-based routes & layout wrappers
│   │   └── styles.css      # Core styles & Tailwind CSS imports
│   └── package.json        # Frontend dependencies & scripts
├── server/                 # Spring Boot / Gradle backend
│   ├── src/main/java/      # Java classes
│   │   ├── common/         # Security, rate-limiting, and utilities
│   │   └── features/       # Business modules (auth, snippets, users...)
│   ├── src/main/resources/ # Configurations, migrations, and mail templates
│   │   ├── db/migration/   # Flyway database schemas
│   │   └── application.yaml# Spring configuration property tree
│   └── build.gradle        # Backend Gradle build configuration
└── README.md               # You are here
```

---

## 🔐 Security & Operations

1. **Passwords**: Stored securely in PostgreSQL, hashed via `BCryptPasswordEncoder` with a strength factor of 12.
2. **Access Control**: Role-based access configuration (e.g., `ROLE_ADMIN` required for admin endpoints).
3. **Session Policy**: Fully stateless REST api. No session state is held on the server; authorization is evaluated from incoming JWT Bearer tokens.
4. **Token Expiry**:
   - Access Token: Shorter-lived JWT checked on every API call.
   - Refresh Token: Stored in an HttpOnly, Secure, and SameSite cookie, utilized to fetch a new Access Token upon expiration.
