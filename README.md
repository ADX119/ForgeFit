# ForgeFit

ForgeFit is an installable fitness, nutrition, grocery, and equipment PWA. It combines a guided exercise catalog, a weekly workout planner, goal-based macro estimates, recipes filtered by diet preference (vegan, vegetarian, eggetarian, non-vegetarian), a consolidated grocery list, and clearly disclosed mock shopping flows.

## Stack

- Next.js 16.2.11, React 19, TypeScript, Tailwind CSS 4
- Turborepo with pnpm workspaces
- Supabase Auth, PostgreSQL, Row Level Security, migrations, and pgTAP
- Vitest, Testing Library, and Playwright

## Repository

```text
apps/web              Next.js App Router PWA
packages/domain       Validation, nutrition, grocery, and commerce rules
packages/ui           Shared accessible UI primitives
packages/supabase     Database-facing types and client utilities
packages/config       Shared TypeScript configuration
supabase/migrations   Schema, triggers, RPC, and RLS policies
supabase/seed.sql     21 exercises, 12 recipes, and 8 equipment products
supabase/tests        pgTAP database tests
```

## Prerequisites

- Node.js 22 or newer
- pnpm 10.15.1 (`corepack enable` is recommended)
- A Supabase project
- Optional: Docker Desktop and the Supabase CLI for a fully local database

This repository never needs a Supabase service-role key in the web application.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

   If pnpm is not installed globally:

   ```bash
   npx --yes pnpm@10.15.1 install
   ```

2. Copy the environment template:

   ```bash
   cp .env.example apps/web/.env.local
   ```

   On PowerShell:

   ```powershell
   Copy-Item .env.example apps/web/.env.local
   ```

3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL`. Use the publishable/anon client key—not the service-role key.

4. Apply the database schema and seed.

   Local Supabase:

   ```bash
   supabase start
   supabase db reset
   ```

   Managed development project:

   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push --include-seed
   ```

   Keep email confirmation disabled for a local demo or configure the project’s confirmation template to redirect to `/auth/confirm`. Enable confirmation for a deployed environment.

5. Optional commerce integration

   No API keys are required. Grocery, equipment, and dish offers open free provider search links.

   ```bash
   GROCERY_API_KEY=your-grocery-api-key
   FOOD_DELIVERY_API_KEY=your-food-delivery-api-key
   EQUIPMENT_API_KEY=your-equipment-api-key
   ```

6. Start the application:

   ```bash
   pnpm dev
   ```

   Open <http://localhost:3000>. Registration creates a profile and one default workout plan. Finish onboarding before entering authenticated routes.

## Commands

```bash
pnpm dev            # run the Next.js development server
pnpm build          # production build through Turborepo
pnpm lint           # ESLint, zero warnings allowed
pnpm typecheck      # strict TypeScript check
pnpm test           # domain and component tests
pnpm format:check   # verify Prettier formatting
pnpm test:e2e       # Playwright phone, tablet, and desktop projects
supabase test db    # pgTAP schema and seed assertions; local Supabase required
```

Authenticated Playwright coverage expects a completed test account:

```bash
FORGEFIT_E2E_EMAIL=test@example.com FORGEFIT_E2E_PASSWORD='your-password' pnpm test:e2e
```

## Security and data model

- Supabase SSR uses PKCE and cookie-backed sessions. `proxy.ts` refreshes expired sessions.
- Every exposed table has RLS enabled. Catalog rows are readable by authenticated users; profile, workout, grocery, completion, and demo-order rows are restricted to `auth.uid()`.
- The browser only receives the publishable key. User identity is revalidated in every Server Action.
- Grocery insertion is an authenticated PostgreSQL RPC using an atomic `ON CONFLICT` quantity increment.
- Commerce offers are regenerated and checked server-side before a demo order is saved, preventing client-side price tampering.
- The service worker caches only icons and the offline page. It never caches authenticated HTML or Supabase data.

## Nutrition formula

ForgeFit uses Mifflin–St Jeor BMR, standard activity multipliers, and goal adjustments of +300 kcal for muscle gain, -400 for fat loss, 0 for maintenance, and -200 for recomposition. Targets never fall below estimated BMR. Protein varies by goal, fat is 0.8 g/kg, and carbohydrates receive remaining calories.

These values are educational estimates, not medical advice. The MVP is limited to adults aged 18 or older.

## Demo commerce

Ingredient, dish, and equipment offers are deterministic simulations. Every surface displays a Demo badge and no-charge language. Placing an offer writes a `DEMO_PLACED` record so the flow can be verified from Profile, but no payment data, retailer redirect, or third-party commerce call exists.

Future real integrations should replace the `ShoppingProvider` or `FoodDeliveryProvider` implementations without changing UI/domain contracts.

## Running on the Supabase free plan

ForgeFit is designed to run on free tiers until it has a few hundred regular users. The free plan has four catches, handled as follows.

**Project pausing.** Free projects with too little database activity for 7 days are paused (a warning email arrives first). Restore it from the Supabase dashboard; it takes a few minutes and keeps all data. For day-to-day development, prefer a local database (`supabase start`, which needs Docker Desktop) so the cloud project is only used by the deployed app.

**Database size.** Above 500 MB the database becomes read-only and workouts can't be saved. The weekly backup workflow also reports the size and fails, which triggers a GitHub email, once it passes 350 MB. That is the signal to move to Supabase Pro.

**Email.** Supabase's built-in email only delivers to members of the project's team, at 2 messages an hour, so real users never receive confirmation or password-reset emails. ForgeFit sends through [Resend](https://resend.com) instead (free plan: 3,000 emails a month, 100 a day). Resend requires a domain you own.

1. **Resend:** create an account, add your domain under Domains, and add the DNS records it shows at your domain registrar. Wait until the domain shows as verified. Then create an API key with "Sending access".
2. **Supabase → Authentication → Emails → SMTP Settings:** enable custom SMTP and enter:

   | Field        | Value                    |
   | ------------ | ------------------------ |
   | Sender email | `no-reply@<your-domain>` |
   | Sender name  | `ForgeFit`               |
   | Host         | `smtp.resend.com`        |
   | Port         | `465`                    |
   | Username     | `resend`                 |
   | Password     | your Resend API key      |

3. **Supabase → Authentication → Emails → Templates:** paste `supabase/templates/confirmation.html` into "Confirm signup" (subject: _Confirm your ForgeFit email_) and `supabase/templates/recovery.html` into "Reset password" (subject: _Reset your ForgeFit password_). Both link to `/auth/confirm`, which signs the person in from the link.
4. **Supabase → Authentication → URL Configuration:** set Site URL to the app's address (`http://localhost:3000` until it is deployed) and add `http://localhost:3000/**` plus the production URL with `/**` to Redirect URLs.
5. **Supabase → Authentication → Sign In / Providers → Email:** keep "Confirm email" on.

#### Testing email without a domain (Ethereal)

For development, point Supabase's SMTP at [Ethereal](https://ethereal.email), a free fake mail server. Nothing is delivered: every confirmation and reset email, for any address, lands in one web inbox. No domain or sign-up needed, so you can test sign-up and password reset as often as you like.

1. Create an inbox at [ethereal.email](https://ethereal.email) ("Create Ethereal Account") and keep the username and password.
2. Supabase → Authentication → Emails → SMTP Settings: sender email = the Ethereal username, sender name `ForgeFit`, host `smtp.ethereal.email`, port `587`, username and password from step 1.
3. Supabase → Authentication → Rate Limits: raise "emails sent per hour" (for example to 100) so repeated tests aren't blocked.
4. Do steps 3–5 of the Resend setup above (templates, URL configuration, "Confirm email" on).
5. Test: sign up in the app with any new address on the `ethereal.email` domain (`lifter1@ethereal.email`, `lifter2@ethereal.email`, …). Open [ethereal.email/messages](https://ethereal.email/messages) (log in with the Ethereal credentials) and click the link in the email.

Supabase allows one sign-up or reset email per address per 60 seconds, so use a fresh address each time. Ethereal keeps messages for about 15 days. Switch the SMTP settings to Resend before real people use the app.

### Database backups

The free plan has no automatic backups. `.github/workflows/database-backup.yml` runs every Monday at 02:00 IST (and on demand from the Actions tab). It dumps roles, schema and data, encrypts them, and keeps each backup as a workflow artifact for 30 days.

Add two repository secrets under Settings → Secrets and variables → Actions:

- `SUPABASE_DB_URL`: the **Session pooler** connection string from Supabase → Connect. The direct `db.<ref>.supabase.co` host is IPv6-only and GitHub runners can't reach it.
- `BACKUP_PASSPHRASE`: a long random passphrase. Keep a copy in your password manager; without it the backups can't be opened. Encryption matters because this repository is public, so its workflow artifacts can be downloaded by other GitHub users.

To restore, download the artifact, then:

```bash
gpg --decrypt forgefit-db.tar.gz.gpg | tar xz
psql "$TARGET_DB_URL" --single-transaction -f roles.sql -f schema.sql \
  -c "SET session_replication_role = replica" -f data.sql
```

## PWA and deployment

The production build provides a web manifest, maskable icons, install guidance, security headers, a minimal offline fallback, and responsive navigation at phone, tablet, and desktop widths. Serve the deployed application over HTTPS for installation. Configure the production URL in both `NEXT_PUBLIC_SITE_URL` and Supabase Auth redirect settings.

Native App Store and Play Store binaries are outside this MVP. A future Expo application can reuse `packages/domain`, `packages/ui` design tokens, and the Supabase contracts.
