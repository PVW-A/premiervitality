

## Problem

The `upgrade-subscription` edge function fails with "No Square customer on file" because Square customers are only created during the initial subscription checkout (`create-subscription`). Users who signed up but haven't gone through that checkout yet (or existing users without a Square account) can't upgrade.

## Solution

Modify the `upgrade-subscription` edge function to **automatically create a Square customer** if one doesn't exist, rather than returning an error. This mirrors the logic already in `create-subscription` (lines 95-139).

## Implementation Steps

1. **Update `supabase/functions/upgrade-subscription/index.ts`**:
   - After the profile lookup (line 109-113), if `square_customer_id` is null, create a Square customer using the profile's `first_name`, `last_name`, `phone`, and the user's email from JWT claims
   - Save the new `square_customer_id` back to the `profiles` table
   - Continue with the existing subscription search/update flow

2. **Extract user email from JWT claims** — add `userClient.auth.getClaims()` email extraction (already partially done but email isn't captured; need to pull `claims.email`)

The key code change: replace the "No Square customer" error block with a Square customer creation call, reusing the same pattern from `create-subscription`.

