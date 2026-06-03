# Deployment guide (GitHub → production)

This project is a **TanStack Start** app with **SSR** and **server functions**. It is built for **Cloudflare Workers** (see `wrangler.jsonc` and `@cloudflare/vite-plugin`). That is the smoothest hosting path.

**Netlify / Railway / Render** are possible only if you change the build target (Nitro adapter) away from Cloudflare. That is not configured in this repo and is not recommended unless you plan to maintain custom deploy config yourself.

---

## Recommended: Cloudflare Pages + GitHub

### 1. Supabase (database)

1. Create a project at [supabase.com](https://supabase.com) (or use your existing one: ref `dprsmspngxrssnmszsyn` in `supabase/config.toml`).
2. Apply migrations (SQL from `supabase/migrations/`) via **Supabase Dashboard → SQL** or CLI:
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   ```
3. In **Project Settings → API**, copy:
   - Project URL
   - `anon` / publishable key (browser)
   - `service_role` key (server only — never expose in client code)

### 2. Environment variables

Set these in **Cloudflare Dashboard → Workers & Pages → your project → Settings → Variables**.

| Variable | When needed | Purpose |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | **Build + runtime** | Public Supabase URL (embedded in client JS at build time) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | **Build + runtime** | Public anon/publishable key |
| `SUPABASE_URL` | Runtime | SSR / server functions |
| `SUPABASE_PUBLISHABLE_KEY` | Runtime | SSR auth middleware |
| `SUPABASE_SERVICE_ROLE_KEY` | Runtime | Admin image uploads (server functions only) |
| `ADMIN_PASSWORD` | Runtime | Must match admin login password for image override APIs |

`VITE_*` variables must exist during **`npm run build`** on Cloudflare, not only at runtime.

Optional alias: `VITE_SUPABASE_ANON_KEY` instead of `VITE_SUPABASE_PUBLISHABLE_KEY`.

Do **not** commit `.env` to GitHub (it is in `.gitignore`).

### 3. Connect GitHub to Cloudflare

1. Push this repo to GitHub.
2. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the repository.
4. Build settings:
   - **Framework preset:** None (or detect if offered)
   - **Build command:** `npm ci && npm run build`
   - **Deploy command:** `npx wrangler deploy` (if the UI asks for a single command, use `npm ci && npm run build && npx wrangler deploy`)
   - **Node version:** 20 or 22
5. Add all environment variables from the table above (including `VITE_*` for production).
6. Deploy.

### 4. Custom domain

Cloudflare Pages → **Custom domains** → add your domain and follow DNS steps.

### 5. Post-deploy checks

- [ ] Home page loads (`/`)
- [ ] Contact form submits (`/`, contact section)
- [ ] Booking flow submits (availability section)
- [ ] `/admin` loads; data loads after login
- [ ] Admin image edit works (requires `ADMIN_PASSWORD` + `SUPABASE_SERVICE_ROLE_KEY`)

---

## Local production preview

```bash
cp .env.example .env
# Fill in .env, then:
npm run build
npm run preview
```

---

## GitHub Actions (optional)

If you prefer CI deploy instead of Cloudflare’s built-in Git integration, add secrets:

- `CLOUDFLARE_API_TOKEN` (Workers edit permission)
- `CLOUDFLARE_ACCOUNT_ID`

Then use a workflow that runs `npm ci`, `npm run build`, and `npx wrangler deploy` with the same env vars configured in the Cloudflare project.

---

## Why not Netlify / Railway out of the box?

| Platform | Fit |
|----------|-----|
| **Cloudflare Pages / Workers** | Native — SSR + Workers runtime match this repo |
| **Netlify** | Static + Functions; this app expects Workers, not Netlify Functions |
| **Railway / Render** | Node containers; you would need a Node Nitro preset and different server entry |
| **Vercel** | Similar — requires adapter change |

Moving hosts means changing `@lovable.dev/vite-tanstack-config` / Nitro preset and testing SSR + server functions again.

---

## Security reminders

- Never put `SUPABASE_SERVICE_ROLE_KEY` in `VITE_*` variables.
- Rotate keys if they were ever committed.
- Set a strong `ADMIN_PASSWORD` in production (server checks this for image overrides).
- Review Supabase **RLS policies** in `supabase/migrations/` before going live.
