import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/slack/api";

async function findChannelId(channelName: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
  const SLACK_API_KEY = Deno.env.get("SLACK_API_KEY")!;
  const name = channelName.replace(/^#/, "");
  let cursor = "";
  do {
    const url = `${GATEWAY_URL}/conversations.list?types=public_channel&limit=200${cursor ? `&cursor=${cursor}` : ""}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": SLACK_API_KEY,
      },
    });
    const data = await res.json();
    if (!data.ok) throw new Error(`conversations.list failed: ${JSON.stringify(data)}`);
    const match = data.channels?.find((c: any) => c.name === name);
    if (match) return match.id;
    cursor = data.response_metadata?.next_cursor || "";
  } while (cursor);
  throw new Error(`Channel "${channelName}" not found`);
}

async function slackPost(channel: string, text: string) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const SLACK_API_KEY = Deno.env.get("SLACK_API_KEY");
  if (!LOVABLE_API_KEY || !SLACK_API_KEY) {
    console.warn("Slack not configured, skipping notification");
    return;
  }
  try {
    const channelId = await findChannelId(channel);
    await fetch(`${GATEWAY_URL}/conversations.join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": SLACK_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel: channelId }),
    });
    await fetch(`${GATEWAY_URL}/chat.postMessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": SLACK_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel: channelId, text }),
    });
  } catch (e) {
    console.error("Slack notification failed:", e);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invitee_email, inviter_name, inviter_user_id } = await req.json();

    if (!invitee_email) {
      return new Response(JSON.stringify({ error: "invitee_email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const senderName = inviter_name || "A Premier Vitality member";
    const signupUrl = "https://premiervitalityandwellness.com/auth?tab=signup";

    // ─── Send invite email via Resend ───
    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="text-align:center;padding-bottom:32px;">
          <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:28px;color:hsl(220,26%,14%);margin:0;">
            Premier Vitality
          </h1>
        </td></tr>
        <tr><td style="background:hsl(40,18%,92%);border-radius:8px;padding:40px 32px;">
          <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:400;font-size:22px;color:hsl(220,26%,14%);margin:0 0 16px;">
            You've been invited to link accounts
          </h2>
           <p style="font-size:14px;line-height:1.6;color:hsl(218,12%,45%);margin:0 0 24px;">
            ${senderName} has invited you to link your Premier Vitality accounts. 
            Linking accounts allows family members to share health data, manage billing together, 
            and stay connected on your wellness journey.
          </p>
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr><td style="background:hsl(39,38%,45%);border-radius:4px;padding:12px 32px;text-align:center;">
              <a href="${signupUrl}" style="color:hsl(40,20%,96%);text-decoration:none;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;font-family:'Inter',Arial,sans-serif;font-weight:400;">
                Create Your Account
              </a>
            </td></tr>
          </table>
          <p style="font-size:12px;line-height:1.5;color:hsl(218,12%,45%);margin:24px 0 0;text-align:center;">
            Already have an account? Simply log in — your accounts will be linked automatically.
          </p>
        </td></tr>
        <tr><td style="text-align:center;padding-top:24px;">
          <p style="font-size:11px;color:hsl(218,12%,45%);margin:0;">
            Premier Vitality & Wellness · Scottsdale, AZ
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Premier Vitality <noreply@premiervitalityandwellness.com>",
        to: [invitee_email],
        subject: `${senderName} invited you to join Premier Vitality & Wellness`,
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();
    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      return new Response(JSON.stringify({ error: "Failed to send email", details: resendData }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Create in-app notification for invitee (if they already have an account) ───
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    // Look up user by email
    const { data: userData } = await admin.auth.admin.listUsers();
    const inviteeUser = userData?.users?.find(
      (u: any) => u.email?.toLowerCase() === invitee_email.toLowerCase()
    );

    if (inviteeUser) {
      await admin.from("notifications").insert({
        user_id: inviteeUser.id,
        type: "info",
        title: "Family Link Invitation",
        message: `${senderName} has invited you to link accounts. Go to Linked Accounts to accept.`,
        link: "/portal?tab=linked",
      });
    }

    // ─── Slack notification ───
    await slackPost(
      "#orders",
      `👥 *Family Link Invite*\n*From:* ${senderName}\n*To:* ${invitee_email}\n*Status:* ${inviteeUser ? "Existing patient — in-app notification sent" : "New email — invite email sent"}`
    );

    return new Response(JSON.stringify({ success: true, email_sent: true, in_app: !!inviteeUser }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-invite-email error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
