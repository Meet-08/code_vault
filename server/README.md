# Code Vault Server ⚙️

The **Code Vault Server** is a robust, secure, and highly scalable REST API backend built on **Spring Boot 4.0.6** and **Java 25**. It provides dynamic snippet storage, full-text database querying, distributed rate limiting, and dual-token JWT authentication.

---

## 🏗️ Technical Architecture & Modules

The backend is structured into domain-specific features and shared infrastructure components under `com.meet.server`:

```
server/src/main/java/com/meet/server/
├── ServerApplication.java   # App bootstrap class
├── common/                  # Shared system components
│   ├── api/                 # Standardized REST responses (ApiResponse, PageResponse)
│   ├── audit/               # JPA auditing base entities (createdAt, updatedAt tracking)
│   ├── config/              # Async and application properties loaders
│   ├── exception/           # Centralized global exception handler
│   ├── mail/                # SMTP helper for dispatching HTML email templates
│   ├── ratelimit/           # Redis-backed distributed Bucket4j filters
│   ├── redis/               # Lettuce connection configurations
│   ├── security/            # JWT authentication, password hashing, and user context
│   └── util/                # HTTP Cookie manipulation and Security Context utilities
└── features/                # Business components
    ├── admin/               # Administrative stats and user role assignments
    ├── auth/                # Sign-in, registration, and password recovery controllers
    ├── dashboard/           # Main user workspace analytical aggregations
    ├── snippet/             # Snippet, Tag, and Collection persistence logic
    └── user/                # Profile management and user database utilities
```

---

## 🔒 Security & Authentication Architecture

Authentication is stateless and uses a secure dual-token JWT mechanism:
1. **Access Token**: A standard, short-lived JWT containing the username, roles, and signature. This is sent by the client inside the `Authorization: Bearer <JWT>` HTTP header.
2. **Refresh Token**: A long-lived, high-security token stored in the database as a hash and issued to the client as an `HttpOnly`, `Secure`, and `SameSite=Lax` cookie (`refresh_token`). It is used exclusively to request a new Access Token.

### Spring Security Filter Chain
Defined in [SecurityConfig.java](file:///e:/Works/temp/code_vault/server/src/main/java/com/meet/server/common/security/config/SecurityConfig.java):
- **Permit All**: Public access to login, registration, refresh, logout, password recovery endpoints, and `/swagger-ui/**` (OpenAPI).
- **Admin Only**: `/api/admin/**` endpoints require `ROLE_ADMIN` role.
- **Authenticated**: All other routes (snippets, collections, dashboard) require authorization.
- **Rate Limiting**: Applied right after the security check context is established.

---

## ⏱️ Distributed Rate Limiting

The application uses **Bucket4j** integrated with **Redis (Lettuce)** to throttle incoming requests and protect database resources:
- **Authenticated Users**: 200 tokens (requests) per 1-minute window, tracked by their username.
- **Anonymous Users**: 30 tokens (requests) per 1-minute window, tracked by their client IP address.

If the limit is exceeded, the server returns a `429 Too Many Requests` status code with the headers `X-Rate-Limit-Remaining: 0` and `X-Rate-Limit-Retry-After-Seconds: <seconds_to_wait>`.

---

## 📂 Database Schema (Flyway Migrations)

The database schema is structured into the following Flyway migrations:
- **`V1__initial_schema.sql`**: Creates `users` (with email indexing), `user_roles`, and `refresh_tokens` tables.
- **`V2__add_snippet_and_collection_schema.sql`**: Introduces `snippets` and `collections` tables, index mappings, and the join table `collection_snippets`.
- **`V3__add_tag_schema.sql`**: Introduces `tags` and the `tags_snippets` join table.
- **`V4__add_description_column_in_snippet.sql`**: Adds descriptions to code snippets.
- **`V5__add_full_text_search_to_snippet.sql`**: Creates `search_vector` TSVector column with GIN index on `snippets`. Triggers a PL/pgSQL function `snippets_search_vector_update()` before database insert/updates.
- **`V6__add_description_column_to_collections.sql`**: Adds description text column to Collections.
- **`V7__fix_collection_schema_to_add_user_ref.sql`**: Associates `collections` with their creator via `created_by_id` constraint.

---

## 📡 Core API Endpoints

### 🔑 Authentication (`/api/auth`)
| HTTP Method | Endpoint | Description | Public |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registers a user; sets refresh cookie and returns access token | Yes |
| `POST` | `/api/auth/login` | Authenticates credentials; sets refresh cookie and returns access token | Yes |
| `POST` | `/api/auth/refresh` | Consumes refresh cookie to return a new access token | Yes |
| `POST` | `/api/auth/logout` | Clears credentials; revokes refresh token in database | Yes |
| `POST` | `/api/auth/forgot-password`| Dispatches password recovery code to registered email address | Yes |
| `POST` | `/api/auth/reset-password` | Sets a new password using verified email token | Yes |

### 👤 Users (`/api/users`)
| HTTP Method | Endpoint | Description | Authorization |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/me` | Fetch active user credentials and role context | Authenticated |
| `DELETE`| `/api/users/{id}` | Delete user account profile (Admin or account owner) | Authenticated |
| `PUT` | `/api/users/{id}/roles` | Modify user roles (Add/Remove ADMIN role) | `ROLE_ADMIN` |

### 📊 Dashboard (`/api/dashboard`)
| HTTP Method | Endpoint | Description | Authorization |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Aggregated user stats (Totals, recent saves, language mix) | Authenticated |

### 📝 Snippets (`/api/snippets`)
| HTTP Method | Endpoint | Description | Authorization |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/snippets` | Search & list snippets (Supports paginated text filtering, favorites) | Authenticated |
| `POST` | `/api/snippets` | Create a new code snippet with languages and tags | Authenticated |
| `GET` | `/api/snippets/{id}` | Retrieve single snippet detail view | Authenticated |
| `PATCH` | `/api/snippets/{id}` | Edit title, language, code, description, and tags | Authenticated |
| `DELETE`| `/api/snippets/{id}` | Deletes snippet record | Authenticated |
| `PATCH` | `/api/snippets/{id}/favourite`| Toggle favorite status for snippet | Authenticated |

### 📂 Collections (`/api/collections`)
| HTTP Method | Endpoint | Description | Authorization |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/collections` | List all collections belonging to user | Authenticated |
| `POST` | `/api/collections` | Create a new collection block | Authenticated |
| `GET` | `/api/collections/{id}` | Retrieve collection name, description, and associated snippets | Authenticated |
| `POST` | `/api/collections/{id}/snippets` | Append selected snippet IDs to collection | Authenticated |
| `DELETE`| `/api/collections/{id}/snippets` | Remove selected snippet IDs from collection | Authenticated |

### 🏷️ Tags (`/api/tags`)
| HTTP Method | Endpoint | Description | Authorization |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tags` | Fetch all tags created by user | Authenticated |

### 🛡️ Administrative Control (`/api/admin`)
| HTTP Method | Endpoint | Description | Authorization |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard/stats` | System statistics (total users, snippets, registrations timeline)| `ROLE_ADMIN` |
| `GET` | `/api/admin/users` | Search & query list of all users on platform | `ROLE_ADMIN` |

---

## ⚙️ Development Environment Variables

The server uses the following environment variables (defined in `server/.env` for local runs):

```properties
# Database Connectivity
DATABASE_URL=jdbc:postgresql://localhost:5432/code-vault
DATABASE_USERNAME=meet
DATABASE_PASSWORD=1234

# Security Configuration
JWT_SECRET=your_32_byte_secret_key_base_64_encoded_here

# Redis
SPRING_DATA_REDIS_HOST=localhost
SPRING_DATA_REDIS_PORT=6379

# SMTP configuration for notifications
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=your_email@gmail.com
```

---

## 🚀 Running the Server

### Build and Run with Gradle
```bash
# Windows
.\gradlew.bat bootRun

# Unix
./gradlew bootRun
```

### OpenAPI Documentation
Once the server starts, you can view the swagger UI and experiment with endpoints in your browser:
- Swagger Docs: `http://localhost:8080/swagger-ui/index.html`
- API JSON schema: `http://localhost:8080/v3/api-docs`
