import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const callerId = claimsData.claims.sub as string;

    const adminClient = createClient(supabaseUrl, serviceKey);

    // Check caller is admin
    const { data: isAdmin } = await adminClient.rpc("has_role", {
      _user_id: callerId,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse body - expects array of { email, phone, first_name?, last_name? }
    const { patients } = await req.json();
    if (!Array.isArray(patients) || patients.length === 0) {
      return new Response(
        JSON.stringify({ error: "Provide a 'patients' array with email and phone" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: Array<{ email: string; status: string; error?: string }> = [];

    // Get the legacy tier
    const { data: legacyTier } = await adminClient
      .from("membership_tiers")
      .select("id")
      .eq("slug", "legacy")
      .single();

    for (const patient of patients) {
      const { email, phone, first_name, last_name } = patient;
      if (!email || !phone) {
        results.push({ email: email || "unknown", status: "skipped", error: "Missing email or phone" });
        continue;
      }

      // Clean phone to digits only for password
      const phoneDigits = phone.replace(/\D/g, "");
      const password = `${phoneDigits}!`;

      try {
        // Create the auth user
        const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            first_name: first_name || "",
            last_name: last_name || "",
            phone: phone,
          },
        });

        if (createError) {
          // User might already exist
          results.push({ email, status: "error", error: createError.message });
          continue;
        }

        const userId = newUser.user.id;

        // Mark profile for forced password change
        await adminClient
          .from("profiles")
          .update({ force_password_change: true })
          .eq("user_id", userId);

        // Create legacy membership if tier exists
        if (legacyTier) {
          await adminClient.from("memberships").upsert(
            {
              user_id: userId,
              tier_id: legacyTier.id,
              billing_cycle: "monthly",
              status: "active",
              started_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );
        }

        results.push({ email, status: "created" });
      } catch (err) {
        results.push({ email, status: "error", error: String(err) });
      }
    }

    console.log(`Provisioned ${results.filter((r) => r.status === "created").length} legacy accounts`);

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("provision-legacy-accounts error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
