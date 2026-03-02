import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface RateLimitConfig {
  endpoint: string;
  maxRequests: number;
  windowSeconds: number;
}

/**
 * Check rate limit for a given identifier (IP, user ID, etc).
 * Returns { allowed: true } or { allowed: false, response: Response }.
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
  corsHeaders: Record<string, string>
): Promise<{ allowed: true } | { allowed: false; response: Response }> {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabaseAdmin.rpc("check_rate_limit", {
      _identifier: identifier,
      _endpoint: config.endpoint,
      _max_requests: config.maxRequests,
      _window_seconds: config.windowSeconds,
    });

    if (error) {
      console.error("Rate limit check error:", error);
      // Fail open — allow request if rate limiter errors
      return { allowed: true };
    }

    if (data === false) {
      return {
        allowed: false,
        response: new Response(
          JSON.stringify({
            error: "Too many requests. Please try again later.",
            retry_after: config.windowSeconds,
          }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
              "Retry-After": String(config.windowSeconds),
            },
          }
        ),
      };
    }

    return { allowed: true };
  } catch (err) {
    console.error("Rate limiter exception:", err);
    // Fail open
    return { allowed: true };
  }
}

/**
 * Extract a client identifier from the request.
 * Prefers user ID if available, falls back to IP.
 */
export function getClientIdentifier(req: Request, userId?: string): string {
  if (userId) return `user:${userId}`;

  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || 
    req.headers.get("x-real-ip") || 
    "unknown";
  return `ip:${ip}`;
}
