// Supabase Edge Function: notify-order-status
// Called from admin when approving or denying an order
// Sends SMS via Twilio and generates Square payment link on approval
//
// Deploy: npx supabase functions deploy notify-order-status --project-ref <your-ref>
// Set secrets:
//   npx supabase secrets set TWILIO_ACCOUNT_SID=ACxxxx --project-ref <ref>
//   npx supabase secrets set TWILIO_AUTH_TOKEN=xxxx --project-ref <ref>
//   npx supabase secrets set TWILIO_FROM_NUMBER=+1xxxxxxxxxx --project-ref <ref>
//   npx supabase secrets set SQUARE_ACCESS_TOKEN=xxxx --project-ref <ref>
//   npx supabase secrets set SQUARE_LOCATION_ID=xxxx --project-ref <ref>

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { orderId, status, adminNotes } = await req.json();

    if (!orderId || !status) {
      return new Response(JSON.stringify({ error: "Missing orderId or status" }), { status: 400, headers: corsHeaders });
    }

    // Init Supabase admin client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch order
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404, headers: corsHeaders });
    }

    let squarePaymentLink: string | null = null;
    let smsBody = "";

    // ── GENERATE SQUARE PAYMENT LINK (approved orders only) ──────────────
    if (status === "approved" && order.price) {
      const squareRes = await fetch("https://connect.squareup.com/v2/online-checkout/payment-links", {
        method: "POST",
        headers: {
          "Square-Version": "2024-01-18",
          "Authorization": `Bearer ${Deno.env.get("SQUARE_ACCESS_TOKEN")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempotency_key: orderId,
          quick_pay: {
            name: order.product_name,
            price_money: {
              amount: Math.round(order.price * 100), // cents
              currency: "USD",
            },
            location_id: Deno.env.get("SQUARE_LOCATION_ID"),
          },
        }),
      });

      const squareData = await squareRes.json();
      squarePaymentLink = squareData?.payment_link?.url ?? null;

      // Save payment link to order
      if (squarePaymentLink) {
        await supabase.from("orders").update({
          status,
          admin_notes: adminNotes ?? null,
          square_payment_link: squarePaymentLink,
          square_payment_id: squareData?.payment_link?.id ?? null,
        }).eq("id", orderId);
      }

      smsBody = squarePaymentLink
        ? `Premier Vitality & Wellness: Your request for ${order.product_name} has been APPROVED by your physician. Complete your payment here: ${squarePaymentLink} — Questions? Reply STOP to opt out.`
        : `Premier Vitality & Wellness: Your request for ${order.product_name} has been APPROVED by your physician. Our team will contact you shortly to arrange payment.`;
    } else if (status === "denied") {
      // Update order as denied
      await supabase.from("orders").update({
        status,
        admin_notes: adminNotes ?? null,
      }).eq("id", orderId);

      const noteText = adminNotes ? ` Reason: ${adminNotes}` : "";
      smsBody = `Premier Vitality & Wellness: Your request for ${order.product_name} was reviewed and is not approved at this time.${noteText} Contact us for more information. Reply STOP to opt out.`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid status" }), { status: 400, headers: corsHeaders });
    }

    // ── SEND SMS VIA TWILIO ───────────────────────────────────────────────
    if (order.patient_phone) {
      const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID")!;
      const twilioToken = Deno.env.get("TWILIO_AUTH_TOKEN")!;
      const fromNumber = Deno.env.get("TWILIO_FROM_NUMBER")!;

      const twilioRes = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Authorization": `Basic ${btoa(`${twilioSid}:${twilioToken}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: fromNumber,
            To: order.patient_phone,
            Body: smsBody,
          }),
        }
      );

      const twilioData = await twilioRes.json();
      if (!twilioRes.ok) {
        console.error("Twilio error:", twilioData);
      }
    }

    return new Response(
      JSON.stringify({ success: true, squarePaymentLink }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});
