export function generateTrackingId(prefix = "COMP") {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  // Generate 3 random bytes using Web Crypto API
  const randomBytes = crypto.getRandomValues(new Uint8Array(3));
  const randomHex = Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  return `${prefix}-${date}-${randomHex}`;
}
