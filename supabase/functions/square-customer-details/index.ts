import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SQUARE_BASE = "https://connect.squareup.com/v2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) throw new Error("Unauthorized");

    // Check admin
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { customer_ids } = await req.json();
    if (!customer_ids || !Array.isArray(customer_ids) || customer_ids.length === 0) {
      return new Response(JSON.stringify({ customers: {} }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SQUARE_ACCESS_TOKEN = Deno.env.get("SQUARE_ACCESS_TOKEN");
    if (!SQUARE_ACCESS_TOKEN) throw new Error("Square not configured");

    // Batch retrieve customers from Square
    const customers: Record<string, any> = {};

    // Square doesn't have a batch endpoint, so we fetch in parallel (max 10 at a time)
    const chunks: string[][] = [];
    for (let i = 0; i < customer_ids.length; i += 10) {
      chunks.push(customer_ids.slice(i, i + 10));
    }

    for (const chunk of chunks) {
      const results = await Promise.all(
        chunk.map(async (id: string) => {
          try {
            const res = await fetch(`${SQUARE_BASE}/customers/${id}`, {
              headers: {
                Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
              },
            });
            if (!res.ok) return null;
            const data = await res.json();
            return data.customer || null;
          } catch {
            return null;
          }
        })
      );

      results.forEach((customer) => {
        if (customer) {
          customers[customer.id] = {
            email: customer.email_address || null,
            phone: customer.phone_number || null,
            birthday: customer.birthday || null,
            given_name: customer.given_name || null,
            family_name: customer.family_name || null,
            created_at: customer.created_at || null,
          };
        }
      });
    }

    return new Response(JSON.stringify({ customers }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
