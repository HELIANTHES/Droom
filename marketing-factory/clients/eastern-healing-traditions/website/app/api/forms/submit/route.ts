import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Server-side validation
    const errors: string[] = [];
    if (!body.firstName?.trim()) errors.push("First name is required");
    if (!body.lastName?.trim()) errors.push("Last name is required");
    if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
      errors.push("Valid email is required");
    if (!body.phone?.trim() || !/^[\d\s()+-]{7,}$/.test(body.phone))
      errors.push("Valid phone number is required");
    if (!body.serviceInterest) errors.push("Service interest is required");
    if (!body.preferredDate) errors.push("Preferred date is required");
    if (!body.preferredTime) errors.push("Preferred time is required");

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: errors.join(", ") },
        { status: 400 }
      );
    }

    const payload = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      serviceInterest: body.serviceInterest,
      preferredDate: body.preferredDate,
      preferredTime: body.preferredTime,
      message: (body.message || "").trim(),
      utm_source: body.utm_source || "",
      utm_medium: body.utm_medium || "",
      utm_campaign: body.utm_campaign || "",
      utm_content: body.utm_content || "",
      utm_term: body.utm_term || "",
      timestamp: new Date().toISOString(),
      formType: "booking",
      brandId: "eastern-healing-traditions",
    };

    // Forward to n8n webhook (graceful degradation)
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        // n8n unavailable — log but don't fail the user
        console.error("Failed to forward to n8n webhook");
      }
    }

    return NextResponse.json({ success: true, message: "Appointment request received" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
