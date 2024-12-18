import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = "service_sxgma2j";
const EMAILJS_USER_TEMPLATE_ID = "template_2ncsaxe";
const EMAILJS_ORGANIZER_TEMPLATE_ID = "template_dp1tu2w";
const EMAILJS_PUBLIC_KEY = "Ro8JahlKtBGVd_OI4";

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendUserConfirmationEmail = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
}) => {
  const templateParams = {
    to_name: `${data.firstName} ${data.lastName}`,
    to_email: data.email,
    user_email: data.email, // Ajout de user_email pour s'assurer que le destinataire est défini
    verification_url: `${window.location.origin}/verify-registration?id=${data.id}`,
    qr_code_url: `${window.location.origin}/verify-info?id=${data.id}`,
  };

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_USER_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    console.log("Email de confirmation envoyé avec succès:", response);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
};

export const sendOrganizerNotificationEmail = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}) => {
  const templateParams = {
    participant_name: `${data.firstName} ${data.lastName}`,
    participant_email: data.email,
    participant_phone: data.phone,
    participant_status: data.status,
    user_email: data.email, // Ajout de user_email pour s'assurer que le destinataire est défini
    to_email: data.email, // Ajout de to_email pour la cohérence
  };

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_ORGANIZER_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    console.log("Email de notification envoyé avec succès:", response);
  } catch (error) {
    console.error("Error sending organizer notification:", error);
    throw error;
  }
};