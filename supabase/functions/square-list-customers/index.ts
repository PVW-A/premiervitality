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

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const SQUARE_ACCESS_TOKEN = Deno.env.get("SQUARE_ACCESS_TOKEN");
    if (!SQUARE_ACCESS_TOKEN) throw new Error("Square not configured");

    // Paginate through ALL Square customers
    const allCustomers: any[] = [];
    let cursor: string | undefined = undefined;

    do {
      const url = new URL(`${SQUARE_BASE}/customers`);
      url.searchParams.set("limit", "100");
      if (cursor) url.searchParams.set("cursor", cursor);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Square API error ${res.status}: ${errBody}`);
      }

      const data = await res.json();
      if (data.customers) {
        allCustomers.push(...data.customers);
      }
      cursor = data.cursor;
    } while (cursor);

    // Map to a consistent shape
    const customers = allCustomers.map((c: any) => ({
      id: c.id,
      email: c.email_address || null,
      phone: c.phone_number || null,
      birthday: c.birthday || null,
      given_name: c.given_name || null,
      family_name: c.family_name || null,
      created_at: c.created_at || null,
      note: c.note || null,
      company_name: c.company_name || null,
      address: c.address || null,
    }));

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
