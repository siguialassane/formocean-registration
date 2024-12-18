import { supabase } from "@/integrations/supabase/client";

const FRONTEND_URL = "https://evenement-registration.exias.app";

export const sendUserConfirmationEmail = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
}) => {
  const verificationUrl = `${FRONTEND_URL}/verify-registration?id=${data.id}`;
  const qrCodeUrl = `${FRONTEND_URL}/verify-info?id=${data.id}`;

  const { error } = await supabase.functions.invoke('send-confirmation-email', {
    body: {
      to: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      verificationUrl,
      qrCodeUrl
    }
  });

  if (error) throw error;
};

export const sendOrganizerNotificationEmail = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}) => {
  const { error } = await supabase.functions.invoke('send-organizer-notification', {
    body: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      status: data.status
    }
  });

  if (error) throw error;
};