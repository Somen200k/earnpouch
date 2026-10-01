import { NextResponse } from "next/server";
import { createAdminSessionToken, getAdminCookieOptions, isAdminConfigured, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ ok: false, error: "Admin authentication is not configured on this server." }, { status: 503 });
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Request body must be valid JSON." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "Username and password are required." }, { status: 400 });
  }

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ ok: false, error: "Invalid username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, redirectTo: "/admin" });
  response.cookies.set("earnpouch_admin_session", createAdminSessionToken(username), getAdminCookieOptions());
  return response;
}
