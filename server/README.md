# Code Vault Server

The server is a Spring Boot 4.0.6 API running on Java 25. It owns authentication, users, snippets, collections, tags, dashboards, caching, rate limiting, mail workflows, and database migrations.

## Module Layout

```text
server/src/main/java/com/meet/server/
├── ServerApplication.java
├── common/
│   ├── api/          Response wrappers and pagination
│   ├── audit/        JPA auditing base entities
│   ├── config/       Shared application configuration
│   ├── exception/    Global exception handling
│   ├── mail/         SMTP email helpers and templates
│   ├── ratelimit/    Redis-backed Bucket4j request throttling
│   ├── redis/        Redis and cache configuration
│   ├── security/     JWT, password hashing, filters, and user context
│   └── util/         Cookie and security helpers
└── features/
    ├── admin/
    ├── auth/
    ├── dashboard/
    ├── snippet/
    └── user/
```

## Authentication

The API uses stateless JWT authentication.

- Access tokens are returned to the client and sent on API calls as `Authorization: Bearer <token>`.
- Refresh tokens are stored as hashed records server-side and issued to the browser as an `HttpOnly` cookie.
- `/api/admin/**` requires `ROLE_ADMIN`.
- Application routes outside the public auth flow require authentication.

Security configuration lives under `server/src/main/java/com/meet/server/common/security`.

## Rate Limiting and Caching

Bucket4j uses Redis for distributed request limits:

- Authenticated users: 200 requests per minute.
- Anonymous users: 30 requests per minute.

Spring Cache also uses Redis for read-heavy dashboard and snippet summary data. Cache entries are evicted by mutation paths that update snippets, favorites, collections, or admin-facing totals.

## Database

Flyway migrations are in `server/src/main/resources/db/migration`.

Current schema coverage includes:

- users, roles, and refresh tokens
- snippets and collections
- tags and snippet/tag joins
- snippet descriptions
- PostgreSQL full-text search vector and GIN index
- collection descriptions and creator references

## Environment Variables

Create `server/.env` for local Compose or backend runs:

```properties
DATABASE_URL=jdbc:postgresql://localhost:5432/code-vault
DATABASE_USERNAME=meet
DATABASE_PASSWORD=1234

JWT_SECRET=replace_with_a_base64_encoded_secret

SPRING_DATA_REDIS_HOST=localhost
SPRING_DATA_REDIS_PORT=6379

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@example.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=your_email@example.com

APP_FRONTEND_URL=http://localhost:3000
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost
```

Keep production values out of git. Use environment variables, Kubernetes secrets, or a secret manager.

## Running Locally

Start PostgreSQL and Redis:

```bash
docker compose -f compose.yaml up -d
```

Run the API:

```bash
./gradlew bootRun
```

On Windows:

```powershell
.\gradlew.bat bootRun
```

The API listens on `http://localhost:8080`.

## Useful Commands

```bash
./gradlew test
./gradlew build
```

OpenAPI documentation is available after startup:

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## API Areas

| Area | Base path | Notes |
| --- | --- | --- |
| Authentication | `/api/auth` | Register, login, refresh, logout, password recovery |
| Users | `/api/users` | Active user, profile deletion, role updates |
| Dashboard | `/api/dashboard` | User statistics and summaries |
| Snippets | `/api/snippets` | Search, create, read, update, delete, favorite |
| Collections | `/api/collections` | Collection CRUD and snippet membership |
| Tags | `/api/tags` | User tag lookup |
| Admin | `/api/admin` | Admin dashboard and user management |

