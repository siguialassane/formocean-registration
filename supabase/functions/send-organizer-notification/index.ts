import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
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

    console.log("Received request to send organizer notification");
    const notificationRequest: NotificationRequest = await req.json();
    console.log("Notification request data:", notificationRequest);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Événement Registration <onboarding@resend.dev>",
        to: ["organisateur@example.com"], // Remplacez par l'email de l'organisateur
        subject: "Nouvelle inscription à l'événement",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Nouvelle inscription</h1>
            <p>Une nouvelle personne s'est inscrite à l'événement :</p>
            <ul>
              <li>Nom : ${notificationRequest.lastName}</li>
              <li>Prénom : ${notificationRequest.firstName}</li>
              <li>Email : ${notificationRequest.email}</li>
              <li>Téléphone : ${notificationRequest.phone}</li>
              <li>Status : ${notificationRequest.status}</li>
            </ul>
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
    console.error("Error in send-organizer-notification function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);