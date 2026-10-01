import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "earnpouch_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD &&
    process.env.ADMIN_SESSION_SECRET,
  );
}

export function getAdminCredentials(): { username: string; password: string } | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!username || !password) return null;
  return { username, password };
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const credentials = getAdminCredentials();
  if (!credentials) return false;

  if (username.length !== credentials.username.length || password.length !== credentials.password.length) {
    return false;
  }

  return (
    timingSafeEqual(Buffer.from(username), Buffer.from(credentials.username)) &&
    timingSafeEqual(Buffer.from(password), Buffer.from(credentials.password))
  );
}

export function createAdminSessionToken(username: string): string {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? "earnpouch-dev-secret";
  const payload = `${username}:${Date.now()}`;
  const encodedPayload = Buffer.from(payload, "utf8").toString("base64url");
  const signature = createHmac("sha256", sessionSecret).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token: string): boolean {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? "earnpouch-dev-secret";
  const expectedSignature = createHmac("sha256", sessionSecret).update(payload).digest("base64url");

  if (signature.length !== expectedSignature.length) {
    return false;
  }

  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return false;
  }

  try {
    const decoded = Buffer.from(payload, "base64url").toString("utf8");
    const [username, issuedAt] = decoded.split(":");
    if (!username || !issuedAt) return false;

    const timestamp = Number(issuedAt);
    if (!Number.isFinite(timestamp)) return false;

    const ageInSeconds = Math.floor((Date.now() - timestamp) / 1000);
    if (ageInSeconds < 0 || ageInSeconds > ADMIN_SESSION_TTL_SECONDS) return false;

    const credentials = getAdminCredentials();
    return Boolean(credentials && timingSafeEqual(Buffer.from(username), Buffer.from(credentials.username)));
  } catch {
    return false;
  }
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  };
}

export function clearAdminCookieOptions() {
  return {
    ...getAdminCookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  };
}
