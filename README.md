# Occupancy Dashboard

## Pitch

A live view of how full each coworking location is right now — desks and offices
occupied vs available, by location and by space type. An empty desk earns
nothing, so location and operations managers need to see at a glance where they
have capacity to sell and where they're already full, instead of pulling a
report after the fact.

## Architecture, in under 2 minutes

Two physically separate pieces:

- **`/src`** is the client. It's a static Vite + React build with no server of
  its own — it only ever calls `/api/occupancy` and renders whatever comes
  back.
- **`/api`** is the server. `api/occupancy.js` is a Vercel serverless
  function; `api/_mockData.js` generates data shaped like a real Salesforce
  query result. Nothing in `/api` ever ships to the browser.

**Why `/api` is server-side, not just a client-side data module:**
- It's the only place allowed to know the data source and read
  `SALESFORCE_INSTANCE_URL` — that env var has no `VITE_` prefix, so Vite
  never inlines it into the client bundle. Keeping it server-only means the
  org URL (and later, real credentials) never reach the browser.
- It's one place to swap mock data for a real Salesforce query later —
  `_mockData.js` and a real SOQL call return the same shape, so `/src` never
  needs to change.
- Filtering (`?location=`, `?type=`) runs there too, next to the data, instead
  of shipping the full dataset to the browser and filtering client-side.

**What the env var protects:** today it's just an instance URL, echoed into
`meta.source` to prove the wiring works. The same server-only pattern is what
would keep a real consumer key and JWT-signing certificate off the client once
this connects to an actual org.

**GitHub → Vercel:** push to `main` → Vercel detects Vite, runs `vite build`
for `/src`, and separately bundles each file in `/api` as its own serverless
function → both are live behind one URL. `vercel.json` rewrites non-API routes
to `index.html` so deep links into the single-page app still resolve.

## Local dev

```bash
npm install
npm run dev      # Vite dev server for /src, http://localhost:5173
vercel dev        # runs /api as real serverless functions, http://localhost:3000
```

`npm run dev` only serves the client — it has no backend of its own, which is
why `vite.config.js` proxies `/api` requests to `http://localhost:3000`, the
port `vercel dev` listens on. Run both together for a fully working local
setup.

Required env var (copy `.env.example` to `.env` and fill in a value — `vercel
dev` reads it from there):

```
SALESFORCE_INSTANCE_URL=https://your-instance.my.salesforce.com
```

## If I were connecting this to a real Salesforce org

**Data:** replace `_mockData.js` with real SOQL — via `jsforce` or the REST
Query API — against `Location__c`, `Space__c`, and their related `Contract`s.
Occupancy is *derived*, not stored: a space is occupied when an active
Contract (`Status = 'Activated'`, current date within `Start_Date`/`End_Date`)
covers it. I wouldn't trust a static `Status__c` field on its own — either
compute status from the Contract at query time, or keep `Status__c` in sync
via a Flow/trigger and treat the live Contract as the source of truth for
reconciliation.

**Auth:** authenticate server-side with the OAuth 2.0 JWT Bearer Flow —
server-to-server, no user login, no refresh token to manage. Sign a JWT with a
private key, exchange it for an access token, cache the token until it
expires. The consumer key and the certificate/private key would live as
Vercel env vars (server-only, same pattern as `SALESFORCE_INSTANCE_URL`
today), never in the repo.

**Challenges I'd expect:**
- **API limits.** Use aggregate SOQL (`COUNT()`, `GROUP BY`) to get
  summary/byLocation/byType directly from the org instead of pulling every
  `Space__c` row just to count them client-side.
- **Token expiry.** Access tokens from the JWT flow expire; re-exchange when a
  call fails with an auth error rather than assuming a long-lived token.
- **Pagination.** A large org's `Space__c` table won't fit in one query
  response — handle `nextRecordsUrl` for the detail-table query.
- **Field-level security / record access.** The integration user needs read
  access to `Location__c`, `Space__c`, `Contract`, and `Account`, and FLS on
  every field this dashboard reads — a field invisible to that user silently
  comes back null instead of erroring, which is easy to misdiagnose.
