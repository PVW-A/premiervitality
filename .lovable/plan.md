

## Peptide Reminder & Auto-Reorder System

This feature adds SMS-based dosing reminders tied to each patient's active peptides, low-vial alerts 10 days before they run out, and a reply-based reorder flow ("Y" to reorder, "N" to skip).

---

### What It Does (User-Facing)

1. **Dosing Reminders** — Once a patient receives a peptide, they can configure reminders per peptide:
   - How many times per day (1x, 2x, 3x)
   - What time(s) to send each reminder
   - How long to run reminders (e.g., 30 days, 60 days, ongoing)
   - The reminder text includes the peptide name, dosage, and administration method

2. **Low Vial Alerts** — The system calculates days remaining from `quantity_remaining / usage_per_day`. When a peptide hits 10 days remaining, it sends:
   > "Premier Vitality: Your BPC-157 supply is running low (~10 days left). Reply Y to reorder or N to skip. Reply STOP to opt out."

3. **Reply-to-Reorder** — When a patient replies "Y", the system automatically creates a new `peptide_request` row for the same peptide, pre-approved, and sends back a payment link. Replying "N" dismisses the alert.

---

### Technical Plan

#### 1. New Database Table: `peptide_reminders`

| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid | |
| patient_peptide_id | uuid | FK to `patient_peptides` |
| peptide_name | text | Denormalized for SMS body |
| dosage | text | e.g. "250mcg" |
| times_per_day | integer | 1, 2, or 3 |
| reminder_times | jsonb | e.g. `["08:00","14:00","20:00"]` |
| duration_days | integer | null = ongoing |
| started_at | timestamptz | |
| active | boolean | default true |
| low_vial_alert_sent | boolean | default false — prevents duplicate alerts |
| created_at / updated_at | timestamptz | |

RLS: Users can CRUD own rows. Admins can view all.

#### 2. New Edge Function: `send-reminders` (cron-triggered)

- Runs every 15 minutes via `pg_cron` + `pg_net`
- Queries active reminders where current time (user's configured time, using a tolerance window) matches a `reminder_times` entry
- Sends Twilio SMS: "Premier Vitality: Time for your [peptide] dose ([dosage]). Reply STOP to opt out."
- Also checks `patient_peptides` for any where `quantity_remaining / usage_per_day <= 10` AND `low_vial_alert_sent = false`, sends the low-vial SMS, and sets the flag

#### 3. New Edge Function: `twilio-webhook` (inbound SMS handler)

- Receives inbound SMS from Twilio (webhook POST)
- Parses the reply body:
  - **"Y" / "YES"** → Looks up the user by phone number, finds their most recent low-vial peptide, creates a new `peptide_request` with status "approved" and the same peptide_id/price, then invokes `create-payment-link` and texts back the payment URL
  - **"N" / "NO"** → Marks the alert as acknowledged, resets `low_vial_alert_sent` so it won't nag again until next cycle
  - **"STOP"** → Handled by Twilio automatically (opt-out)
- Returns TwiML `<Response/>` to Twilio

#### 4. Portal UI: Reminder Settings Component

- New component `src/components/portal/PeptideReminders.tsx`
- Appears on each peptide card in the Dashboard tab (or as a dedicated "Reminders" sub-section)
- For each active peptide, shows a toggle to enable/disable reminders
- When enabled, shows:
  - Frequency selector (1x, 2x, 3x per day)
  - Time pickers for each reminder slot
  - Duration selector (30 days, 60 days, 90 days, Ongoing)
- Saves/updates to the `peptide_reminders` table
- Shows low-vial status indicator using existing `getDaysRemaining` logic

#### 5. Configuration Updates

- `supabase/config.toml`: Add `[functions.send-reminders]` and `[functions.twilio-webhook]` with `verify_jwt = false`
- `pg_cron` job: Schedule `send-reminders` to run every 15 minutes
- Twilio webhook URL: The inbound SMS webhook in your Twilio phone number settings needs to point to the `twilio-webhook` function URL

---

### File Changes Summary

| Action | File |
|---|---|
| Create | `supabase/functions/send-reminders/index.ts` |
| Create | `supabase/functions/twilio-webhook/index.ts` |
| Create | `src/components/portal/PeptideReminders.tsx` |
| Edit | `src/pages/Portal.tsx` — integrate reminder UI into peptide cards |
| Migration | New `peptide_reminders` table with RLS |
| Migration | Enable `pg_cron` + `pg_net` extensions, create cron schedule |
| Config | `supabase/config.toml` — register new functions |

---

### Twilio Setup Required

After implementation, you will need to configure your Twilio phone number's **Incoming Message webhook** to point to:
`https://<project-ref>.supabase.co/functions/v1/twilio-webhook`

This enables the reply-to-reorder ("Y"/"N") flow.

