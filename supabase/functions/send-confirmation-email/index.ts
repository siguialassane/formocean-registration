import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  firstName: string;
  lastName: string;
  verificationUrl: string;
  qrCodeUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      throw new Error("RESEND_API_KEY is not configured");
    }

    console.log("Received request to send confirmation email");
    const emailRequest: EmailRequest = await req.json();
    console.log("Email request data:", emailRequest);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Événement Registration <onboarding@resend.dev>",
        to: [emailRequest.to],
        subject: "Confirmation de votre inscription à l'événement",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Confirmation d'inscription</h1>
            <p>Bonjour ${emailRequest.firstName} ${emailRequest.lastName},</p>
            <p>Nous vous remercions pour votre inscription à notre événement.</p>
            <p>Voici votre lien de vérification : <a href="${emailRequest.verificationUrl}">Vérifier mon inscription</a></p>
            <p>Voici votre QR Code personnel : <a href="${emailRequest.qrCodeUrl}">Voir mon QR Code</a></p>
            <p>À très bientôt !</p>
            <p>L'équipe Événement</p>
          </div>
        `,
      }),
    });

    const responseData = await res.json();
    console.log("Resend API response:", responseData);

    if (res.ok) {
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      console.error("Resend API error:", responseData);
      return new Response(JSON.stringify({ error: responseData }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);