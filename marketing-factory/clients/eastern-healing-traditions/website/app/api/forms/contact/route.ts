import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const errors: string[] = [];
    if (!body.name?.trim()) errors.push("Name is required");
    if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
      errors.push("Valid email is required");
    if (!body.message?.trim()) errors.push("Message is required");

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: errors.join(", ") },
        { status: 400 }
      );
    }

    const payload = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      message: body.message.trim(),
      utm_source: body.utm_source || "",
      utm_medium: body.utm_medium || "",
      utm_campaign: body.utm_campaign || "",
      utm_content: body.utm_content || "",
      utm_term: body.utm_term || "",
      timestamp: new Date().toISOString(),
      formType: "contact",
      brandId: "eastern-healing-traditions",
    };

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        console.error("Failed to forward to n8n webhook");
      }
    }

    return NextResponse.json({ success: true, message: "Message received" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
