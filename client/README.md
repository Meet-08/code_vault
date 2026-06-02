# Code Vault Client 💻

The **Code Vault Client** is a cutting-edge web interface built on the **TanStack Start** meta-framework (powered by React 19 and Vite 8). It delivers a highly responsive, type-safe, and visually stunning experience for managing code snippets, collections, and workspace analytics.

---

## 🎨 Design System & Aesthetics

Code Vault uses a premium, dark-mode design system with a tailored color palette:
- **Primary Accent**: `#2b87f5` (Vibrant developer blue)
- **Background Base**: `#0a0b0d` (Deep charcoal obsidian)
- **Card Surfaces**: `#111318` (Sleek slate panels)
- **Typography**: "Geist" (Clean sans-serif for reading UI text) and "JetBrains Mono" (Optimized for maximum code readability)
- **Interactions**: Subtle glassmorphism, responsive hover states, smooth CSS animations (`authPageEnter` transitions, glow-shadow active borders), and toast notifications.

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: [React 19](https://react.dev/) & [TanStack Start](https://tanstack.com/start)
- **Bundler & Build Tool**: [Vite 8](https://vite.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router) (file-based, static/dynamic parameter checking, search params validation)
- **Data Fetching**: [TanStack React Query](https://tanstack.com/query) (server-state management, cached resources, automated revalidations)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (modern CSS-first theme configuration & directives)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation schemas
- **Code Highlighting**: [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- **Linter & Formatter**: [Biome](https://biomejs.dev/) (blazing fast replacement for ESLint & Prettier)
- **Testing**: [Vitest](https://vitest.dev/) (unit and integration testing tool)

---

## 📂 File-Based Route Tree

Routes are automatically mapped dynamically from files inside `src/routes/`:

```
src/routes/
├── __root.tsx                 # Root layout shell (injects HTML headers, canonical tags, scripts, and CSS)
├── index.tsx                  # Public landing page (Hero, features summary, workflow, Call to Actions)
├── _auth/                     # Layout partition for unauthenticated screens
│   ├── route.tsx              # Authenticated block (redirects signed-in users to /dashboard)
│   ├── login.tsx              # Login page (credentials form)
│   ├── register.tsx           # Signup page (name, email, password validation)
│   ├── forgot-password.tsx    # Password reset link dispatcher
│   └── reset-password.tsx     # Code-based password reset completion screen
└── _app/                      # Layout partition for authenticated application modules
    ├── route.tsx              # Authorization filter (redirects unauthenticated users to /login)
    ├── dashboard.tsx          # Analytics dashboard (shows stats & snippet totals)
    ├── collections/
    │   ├── index.tsx          # Collections list (grid of directories)
    │   └── $id.tsx            # Collection details (displays snippets within chosen collection)
    ├── snippets/
    │   ├── index.tsx          # Snippets workspace (filters, searches, sorting & pagination grid)
    │   ├── new.tsx            # Code snippet creator editor
    │   ├── $id.tsx            # Code snippet detail viewer
    │   └── $id.edit.tsx       # Snippet editor screen
    └── admin/
        ├── route.tsx          # Administrative gatekeeper (verifies user holds ROLE_ADMIN role)
        ├── dashboard.tsx      # Admin metrics summary (system totals, registrations timeline)
        └── users.tsx          # User management table (role operations, searching, user deletion)
```

---

## 🔌 API Client & Axios Interceptor Architecture

API communication is configured inside [axios.ts](file:///e:/Works/temp/code_vault/client/src/api/axios.ts) to handle stateless JWT authorization seamlessly.

### Request Interceptor
Inserts the in-memory Access Token into the outgoing request's headers:
```typescript
config.headers.Authorization = `Bearer ${token}`;
```

### Response Interceptor (Token Refresh Queue)
Upon receiving a `401 Unauthorized` status (meaning the Access Token has expired):
1. The client intercepts the error.
2. If another refresh request is already in progress, it queues the subsequent requests in a promise queue.
3. The client sends a `POST` request to `/auth/refresh`.
4. If successful, the new Access Token is stored in memory, and the queued requests are retried.
5. If the refresh fail/expires, it triggers a custom `auth:expired` event, clears local state, and forces redirection to the login page.

---

## ⚙️ Development Scripts

Ensure backend services are running before executing these scripts.

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **Start Dev Server** | `npm run dev` | Runs the Vite dev server at `http://localhost:3000` |
| **Build Bundle** | `npm run build` | Compiles production assets and generates a Nitro server package |
| **Preview Build** | `npm run preview` | Runs the compiled production build locally |
| **Run Tests** | `npm run test` | Executes unit tests with Vitest |
| **Format Code** | `npm run format` | Runs Biome code formatter |
| **Lint Check** | `npm run lint` | Runs Biome code linter |
| **Linter & Formatter**| `npm run check` | Validates both styling guidelines and compiler errors |

---

## 🧪 Testing

This project uses [Vitest](https://vitest.dev/) to execute frontend tests. 

```bash
# Run tests
npm run test
```

Tests can be written alongside features using standard `.test.ts` or `.spec.tsx` syntax.

---

## 🚀 Build and Deploy (Nitro)

This project uses **Nitro** as its deployment server adapter, generating a self-contained Node.js server.

1. Generate the production build:
   ```bash
   npm run build
   ```
2. Start the built server:
   ```bash
   node dist/server/index.mjs
   ```

To deploy, bundle the `dist/` directory and configure your hosting server to run the entry file.
For different server presets (Vercel, AWS Lambda, Cloudflare Pages, etc.), refer to the [Nitro Deploy Documentation](https://v3.nitro.build/deploy).
