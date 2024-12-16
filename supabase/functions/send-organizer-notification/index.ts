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
    const notificationRequest: NotificationRequest = await req.json();
    console.log("Sending organizer notification for:", notificationRequest.email);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Événement Registration <onboarding@resend.dev>",
        to: ["organisateur@example.com"], // Replace with actual organizer email
        subject: "Nouvelle inscription à l'événement",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Nouvelle Inscription</h1>
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

    if (res.ok) {
      const data = await res.json();
      console.log("Notification sent successfully:", data);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const error = await res.text();
      console.error("Error sending notification:", error);
      return new Response(JSON.stringify({ error }), {
        status: 400,
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