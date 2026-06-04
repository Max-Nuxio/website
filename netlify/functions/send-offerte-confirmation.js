const jsonHeaders = {
  "Content-Type": "application/json",
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: jsonHeaders,
      body: JSON.stringify({ success: false, message: "Method Not Allowed" }),
    };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM || "Nuxio <support@nuxio.nl>";

  if (!resendApiKey) {
    console.error("RESEND_API_KEY missing in function environment");
    return {
      statusCode: 500,
      headers: jsonHeaders,
      body: JSON.stringify({
        success: false,
        message: "RESEND_API_KEY ontbreekt in Netlify environment variables.",
      }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    console.error("Invalid JSON payload received", event.body);
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({
        success: false,
        message: "Ongeldige JSON payload.",
      }),
    };
  }

  const name = (payload.name || "").trim();
  const email = (payload.email || "").trim();
  const phone = (payload.telefoon || "").trim();
  const company = (payload.bedrijf || "").trim();
  const packageChoice = (payload.pakket || "").trim();
  const message = (payload.message || "").trim();

  if (!name || !email || !message) {
    console.error("Missing required fields", {
      hasName: Boolean(name),
      hasEmail: Boolean(email),
      hasMessage: Boolean(message),
    });
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify({
        success: false,
        message: "Verplichte velden ontbreken voor bevestigingsmail.",
      }),
    };
  }

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; color: #201f20; line-height: 1.6;">
      <h2 style="margin: 0 0 12px; color: #fb7c5d;">Bedankt voor je offerte-aanvraag, ${escapeHtml(name)}.</h2>
      <p style="margin: 0 0 12px;">We hebben je aanvraag goed ontvangen en nemen binnen 24 uur contact met je op.</p>
      <p style="margin: 0 0 16px;"><strong>Samenvatting van je aanvraag:</strong></p>
      <table cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 640px; border: 1px solid #e5e2e3;">
        <tr><td style="border: 1px solid #e5e2e3;"><strong>Naam</strong></td><td style="border: 1px solid #e5e2e3;">${escapeHtml(name)}</td></tr>
        <tr><td style="border: 1px solid #e5e2e3;"><strong>E-mail</strong></td><td style="border: 1px solid #e5e2e3;">${escapeHtml(email)}</td></tr>
        <tr><td style="border: 1px solid #e5e2e3;"><strong>Telefoon</strong></td><td style="border: 1px solid #e5e2e3;">${escapeHtml(phone || "-")}</td></tr>
        <tr><td style="border: 1px solid #e5e2e3;"><strong>Bedrijf</strong></td><td style="border: 1px solid #e5e2e3;">${escapeHtml(company || "-")}</td></tr>
        <tr><td style="border: 1px solid #e5e2e3;"><strong>Pakket</strong></td><td style="border: 1px solid #e5e2e3;">${escapeHtml(packageChoice || "-")}</td></tr>
      </table>
      <p style="margin: 16px 0 8px;"><strong>Toelichting</strong></p>
      <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e2e3;" />
      <p style="margin: 0;">Met vriendelijke groet,<br /><strong>Nuxio</strong><br />support@nuxio.nl</p>
    </div>
  `;

  const text = [
    `Bedankt voor je offerte-aanvraag, ${name}.`,
    "",
    "We hebben je aanvraag goed ontvangen en nemen binnen 24 uur contact met je op.",
    "",
    "Samenvatting:",
    `- Naam: ${name}`,
    `- E-mail: ${email}`,
    `- Telefoon: ${phone || "-"}`,
    `- Bedrijf: ${company || "-"}`,
    `- Pakket: ${packageChoice || "-"}`,
    `- Toelichting: ${message}`,
    "",
    "Groet,",
    "Nuxio",
    "support@nuxio.nl",
  ].join("\n");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFrom,
      to: [email],
      reply_to: "support@nuxio.nl",
      subject: "We hebben je offerte-aanvraag ontvangen - Nuxio",
      html,
      text,
    }),
  });

  const resendResult = await resendResponse.json().catch(() => ({}));

  if (!resendResponse.ok) {
    console.error("Resend API request failed", {
      status: resendResponse.status,
      response: resendResult,
      from: resendFrom,
      to: email,
    });
    return {
      statusCode: 502,
      headers: jsonHeaders,
      body: JSON.stringify({
        success: false,
        message: "Verzenden van bevestigingsmail is mislukt.",
        details: resendResult,
      }),
    };
  }

  return {
    statusCode: 200,
    headers: jsonHeaders,
    body: JSON.stringify({ success: true }),
  };
};
