import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const allowedTopics = new Set(["Editorial feedback", "Privacy request", "Partnership inquiry", "Other"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactInput = {
  name?: unknown;
  email?: unknown;
  topic?: unknown;
  message?: unknown;
  website?: unknown;
};

export async function POST(request: Request) {
  const user = process.env.GMAIL_SMTP_USER;
  const appPassword = process.env.GMAIL_SMTP_APP_PASSWORD;
  const from = process.env.GMAIL_SMTP_FROM;
  if (!user || !appPassword || !from) {
    return NextResponse.json({ error: "The contact form is temporarily unavailable. Please email support@earnpouch.com." }, { status: 503 });
  }

  let input: ContactInput;
  try {
    input = await request.json() as ContactInput;
  } catch {
    return NextResponse.json({ error: "The submitted form could not be read. Please try again." }, { status: 400 });
  }

  if (typeof input.website === "string" && input.website.trim()) {
    return NextResponse.json({ error: "The submission could not be accepted." }, { status: 400 });
  }

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const topic = typeof input.topic === "string" ? input.topic : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";

  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Enter a name that is no longer than 100 characters." }, { status: 400 });
  }
  if (email.length > 254 || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!allowedTopics.has(topic)) {
    return NextResponse.json({ error: "Choose one of the listed topics." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json({ error: "Your message must be between 10 and 5,000 characters." }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user, pass: appPassword },
  });

  try {
    await transporter.sendMail({
      from: `"EarnPouch Contact Form" <${from}>`,
      to: "support@earnpouch.com",
      replyTo: { name, address: email },
      subject: `EarnPouch inquiry: ${topic}`,
      text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`,
    });
  } catch (error) {
    console.error("Contact form email delivery failed:", error);
    return NextResponse.json({ error: "We couldn’t send your message right now. Please try again or email support@earnpouch.com." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
