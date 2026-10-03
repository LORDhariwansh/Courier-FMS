# Courier FMS

React + TypeScript + Vite frontend foundation for the existing Outward Courier and Inward Courier Tracking workflows.

## Current state

- Supabase Auth client, session restoration, sign-in, and password reset wiring are ready for project credentials.
- The setup screen documents the two source workflows without displaying workbook rows as production records.
- Database-driven record views, permissions, and forms are intentionally gated until the actual Supabase schema, RLS policies, and generated types are available. No schema or business rules are fabricated here.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in the Supabase project URL and public publishable key. Never put a service-role key in this frontend.
3. Obtain the database type map from the existing project, for example with `supabase gen types typescript --project-id <project-id> --schema public > src/types/database.ts`.
4. Provide the existing schema details for tables, foreign keys, enum types, RLS policies, workflow configuration, and Storage buckets. The app must map its services to those actual names before it can load or mutate FMS data.
5. Run `npm run dev`.

The local `.env` file is ignored by Git. Supabase Auth wiring is present, but there is no Supabase CLI project configuration, generated schema types, or SQL schema export yet. Workbook-derived field/stage references are not a replacement for the live database schema.
