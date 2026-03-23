/**
 * Sanitize user messages before passing to AI.
 * Strips known prompt injection patterns and role-manipulation attempts.
 */
export function sanitizeMessage(text: string): string {
  const patterns = [
    /ignore\s+(all\s+)?previous\s+instructions/gi,
    /you\s+are\s+now\s+/gi,
    /system\s*:\s*/gi,
    /\[system\]/gi,
    /\{system\}/gi,
    /act\s+as\s+(if\s+you\s+are\s+)?a\s+/gi,
    /pretend\s+(you\s+are|to\s+be)\s+/gi,
    /forget\s+(everything|all|your)\s+(instructions|rules|guidelines)/gi,
    /disregard\s+(all|your|the)\s+(previous|above|prior)/gi,
    /new\s+instructions?\s*:/gi,
    /override\s+(system|instructions|prompt)/gi,
    /repeat\s+(your|the)\s+(system|initial)\s+(prompt|instructions|message)/gi,
  ];
  let sanitized = text;
  for (const pattern of patterns) {
    sanitized = sanitized.replace(pattern, "[filtered]");
  }
  // Strip role-setting attempts at line starts
  sanitized = sanitized.replace(/^(system|assistant)\s*:/gim, "[filtered]:");
  return sanitized.trim();
}
