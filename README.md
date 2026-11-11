# gcr-api-v2

A July 20, 2026 copy of the [`gcr-api-clean`](https://github.com/CultureReset/gcr-api-clean) Express API, made as the starting point for a structured-data rebuild of the Gulf Coast Radar backend.

It trails the live backend and is not deployed for production. The live API is `gcr-api-clean`.

## How it works

The same design as `gcr-api-clean`: one Express app (`server.js`) on Vercel, Supabase as the database, routes for the directory, the business owner's dashboard, booking and admin, plus `extractors/` for parsing booking confirmation emails. Root scripts (`check-*.js`, `import-*.js`, `find-missing-*.js`, `fix-*.js`) inspect and repair venue data. `TOURIST_TABLES.sql` and `TOURIST_SCHEMA_EXTENSIONS.sql` add the visitor-side tables.

## Branches

- `security/no-committed-keys`: moves keys out of the code into environment variables.
- `draft/security-ical-privacy-20261106`: keeps calendar (iCal) data private.

## Run it

```bash
cp .env.example .env    # Supabase and service keys
npm install
npm run dev
```
