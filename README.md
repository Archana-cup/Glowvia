# Glowvia

Glowvia is a responsive React, TypeScript, and Vite beauty store demo. It includes a product catalogue, search and filters, product pages, cart, wishlist, account screens, admin screens, and Supabase setup files.

## Run it locally

In PowerShell, open this folder and run:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite. `npm.cmd` avoids PowerShell's default script policy blocking `npm.ps1`.

## Development mode

Without Supabase credentials, Glowvia uses sample products and browser storage. Use the **Demo Customer** or **Demo Admin** buttons on the login page to explore the UI. These are mock identities for local demonstration only; they are not real accounts and do not provide secure authorization. Development registration is temporary and passwords are never stored in browser storage. Do not use development mode for real customer data or sales.

Cart and sample order data are local demo data. Checkout is disabled when Supabase is configured because trusted server-side order creation, price calculation, and stock reservation are not implemented yet. Development payment choices never mark an order as paid.

## Connect Supabase

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the project URL and publishable/anon key.
4. Run `supabase/migrations/20261025_init_glowvia.sql` in the Supabase SQL editor.
5. Add an administrator role only through a trusted server-side process. Never grant it from signup metadata.

The browser must only receive the publishable/anon key. Never put a service-role key in a `VITE_` variable. Supabase authentication and product reads are wired, but order creation and full admin data writes still need trusted backend integration before live use.

## Checks

```powershell
npm.cmd run build
npm.cmd run lint
```

The current lint command reports warnings, and Vite may report a large JavaScript bundle. Those are reported in the implementation handoff; the production build should still complete.
