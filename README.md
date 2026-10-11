# SKILLFORGE, Phase 1

Learn. Build. Create. Grow.

Phase 1 covers: registration, login, password reset, account status, the manual ₦500 OPay
payment flow with owner review, the owner payment dashboard, and the database foundation
(roles, RLS, private receipt storage, and tables for later phases).

Not in Phase 1 (by design): the entrance examination, JAMB practice, Gemini question generation,
CBT, AI classroom, live coaching, groups, rewards, and gift links. Those come in later phases.

## 1. Project layout

```
skillforge/
├── supabase/migrations/
│   ├── 0001_phase1_accounts_and_payments.sql   profiles, roles, payments, receipts
│   └── 0002_foundation_tables.sql              subjects, questions, exams, rewards, groups, coaching
├── src/
│   ├── App.tsx, main.tsx, index.css
│   ├── components/   Layout, ProtectedRoute, Field, StatusBadge
│   ├── context/      AuthContext (session and profile)
│   ├── config/       site.ts (OPay details, fee, departments)
│   ├── lib/          supabase client, account status helpers, types
│   └── pages/        Home, Register, Login, ForgotPassword, ResetPassword, Payment,
│                     Entrance, Dashboard, Suspended, NotFound
│       └── owner/    OwnerPayments (approve and reject payments)
├── .env.example
├── vercel.json        single-page app routing for Vercel
└── package.json
```

## 2. Run it locally

You need Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local      # then edit .env.local (see step 3)
npm run dev                     # opens http://localhost:5173
```

On Android with TrebEdit, copy `.env.example` to a file named `.env.local`. Keep only the
two `VITE_` values in it.

## 3. Configure Supabase

1. Create a project at supabase.com. Choose a strong database password and save it.
2. Open **Project Settings → API**. Copy the **Project URL** and the **anon public** key into
   `.env.local` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   Never copy the **service_role** key into this project.
3. Open **SQL Editor**, paste the contents of `0001_phase1_accounts_and_payments.sql`, and run it.
   Then paste `0002_foundation_tables.sql` and run it. Run them in this order, once each.
4. Open **Authentication → Providers → Email**. Keep Email enabled.
   - For a quick local test, turn off "Confirm email". Users are logged in straight after
     registering.
   - For production, leave "Confirm email" on. The app then tells students to confirm first.
5. Open **Authentication → URL Configuration**:
   - Site URL: `http://localhost:5173` while testing, then your live domain (for example
     `https://skillforge.yourdomain.com`).
   - Redirect URLs: add `http://localhost:5173/reset-password` and your live domain's
     `/reset-password` address. Password reset will not work without these.
6. Open **Storage** and confirm the private bucket `payment-receipts` exists. The migration
   creates it. It must show as **not public**.

## 4. Create the owner account

1. Start the site and register with your owner email (`ogunlowosodiq19@gmail.com`).
2. In the Supabase **SQL Editor**, run:

```sql
update public.profiles set role = 'owner'
where email = 'ogunlowosodiq19@gmail.com';
```

3. Log out and log in again. An **Owner** link appears in the header.

The owner role can only be set from the SQL Editor. There is no public admin sign-up.
Students cannot change their own role, account status, username, department or email.
The database blocks those changes even if someone calls the API directly.

## 5. Test everything (Phase 1 checklist)

Use a second browser or a private window for each student account.

**Registration**
- [ ] Empty fields show errors. A 2-letter name is rejected. A username with spaces is rejected.
- [ ] A username already in use shows "That username is taken" before you submit.
- [ ] Registering a second account with the same username is blocked.
- [ ] Choosing a department works with a tap on mobile.
- [ ] After registration, the student lands on the payment page.

**Payment (student)**
- [ ] The page shows OPay, 8114095631, Ogunlowo Sodiq and ₦500. The Copy button works.
- [ ] Submitting without a reference shows an error. A reference under 6 characters is rejected.
- [ ] A future date is rejected.
- [ ] A file over 5 MB, or a `.exe`, is rejected.
- [ ] A valid submission (with or without a receipt) shows **Payment under review**.
- [ ] Refreshing the page keeps the student on the under-review message.
- [ ] Typing `/dashboard` in the address bar sends the student back to the payment page.
- [ ] Trying to submit a second payment is refused (the form is no longer shown).

**Owner review**
- [ ] The owner sees the **Owner** link. A student does not.
- [ ] A student opening `/owner/payments` is sent to `/dashboard`, then back to `/payment`.
- [ ] Receipts open from **View receipt**. Receipt links expire after 5 minutes.
- [ ] Rejecting with a reason under 5 characters is refused.
- [ ] Rejecting with a valid reason returns the student to the payment page, and the reason
      appears there.
- [ ] The student can submit again with a corrected reference.
- [ ] Approving moves the student to **Payment approved**, and they see the entrance placeholder
      page, not the dashboard.

**Security checks**
- [ ] In the browser console, run a direct update such as
      `supabase.from('profiles').update({ account_status: 'active' })`. It must fail.
- [ ] Run `supabase.from('payment_submissions').update({ status: 'approved' })`. It must fail.
- [ ] Run `supabase.from('payment_submissions').select('*')` as a student. Only that
      student's own rows come back.
- [ ] Open a receipt path belonging to another student. It must fail.

**Password reset**
- [ ] The reset email arrives. The link opens the new-password form.
- [ ] After saving the new password, the student can log in with it.

## 6. Deploy to Vercel (GitHub)

1. Create a GitHub repository. Upload the project files. Do not upload `.env.local`, which
   `.gitignore` already excludes.
2. In Vercel, click **Add New → Project** and import the repository.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Under **Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   with the same values as your local `.env.local`.
5. Deploy. Copy the live address and add it to Supabase's Site URL and Redirect URLs (step 3.5).

## 7. Connect your QServers domain

1. In Vercel, open the project's **Settings → Domains** and add your domain (for example
   `skillforge.yourdomain.com` or `yourdomain.com`).
2. Vercel shows the DNS records to add. In your QServers DNS settings, add exactly those records
   (usually an `A` record or a `CNAME`).
3. Wait for Vercel to show the domain as verified. This can take a few minutes to a few hours.
4. Update Supabase's Site URL and Redirect URLs to the new domain.

Buying a domain from QServers does not provide hosting or a database. Hosting comes from
Vercel and the database from Supabase.

## 8. Notes for later phases

- Gemini calls run inside Supabase Edge Functions. The Gemini key is set with
  `supabase secrets set`, never in the frontend or the repository.
- Students cannot read the `question_bank` table, because it holds correct answers. Student-facing
  questions will come through functions that hide answers until a submission is marked.
- `set_account_status` exists now. The owner UI that uses it, and the rule that `active` only
  follows a passed entrance examination, come in Phase 2.
