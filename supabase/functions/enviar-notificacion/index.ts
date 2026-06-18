import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

// CORS para que tu frontend (Vercel) pueda llamar a esta función
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Manejo de preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Faltan datos (to, subject, html)" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY ?? "",
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "DevPapois Coworking", email: "devpapois@gmail.com" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});