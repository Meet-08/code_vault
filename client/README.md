# Code Vault Client

The client is a TanStack Start application built with React 19, Vite 8, TanStack Router, React Query, Tailwind CSS 4, and Biome. It provides the web UI for authentication, dashboards, snippets, collections, and admin workflows.

## Key Directories

```text
client/
├── src/
│   ├── api/          Axios client and auth refresh handling
│   ├── components/   Shared UI components
│   ├── features/     Feature modules for auth, snippets, collections, admin
│   ├── routes/       File-based TanStack Router routes
│   └── styles.css    Tailwind and global styles
├── Dockerfile
├── package.json
└── README.md
```

## Routing

Routes are generated from `src/routes/`.

```text
src/routes/
├── __root.tsx
├── index.tsx
├── _auth/
│   ├── route.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── forgot-password.tsx
│   └── reset-password.tsx
└── _app/
    ├── route.tsx
    ├── dashboard.tsx
    ├── collections/
    ├── snippets/
    └── admin/
```

The `_auth` layout handles public authentication pages. The `_app` layout protects authenticated application pages, and the admin route verifies administrative access.

## API Client

API calls are centralized in [src/api/axios.ts](src/api/axios.ts). The request interceptor attaches the in-memory access token. The response interceptor handles `401` responses by sending a refresh request, queueing concurrent requests while refresh is in progress, and replaying them once a new access token is issued.

For local Compose and Kubernetes deployments, the browser-facing API path is `/api`. The container also uses `INTERNAL_API_URL=http://backend:8080/api` for server-side calls inside the Docker network.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite dev server on `http://localhost:3000` |
| `npm run build` | Build the production TanStack Start/Nitro app |
| `npm run preview` | Preview the production build |
| `npm run test` | Run Vitest tests |
| `npm run format` | Run Biome formatter |
| `npm run lint` | Run Biome linter |
| `npm run check` | Run Biome checks |

## Local Development

Start the backend dependencies and API first, then run:

```bash
npm install
npm run dev
```

The app expects the backend API to be reachable through `/api` when proxied, or through the configured API base URL in the relevant environment.

## Production Build

```bash
npm run build
npm run preview
```

The Docker image is configured for deployment by the root Compose file and the Helm chart in [../git-ops/charts/frontend](../git-ops/charts/frontend).

