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
  phone: string;
  status: string;
  id: string;
}) => {
  const templateParams = {
    nom: data.lastName,
    prenom: data.firstName,
    email: data.email,
    tel: data.phone,
    status: data.status,
    verification_url: `${window.location.origin}/verify-registration?id=${data.id}`,
    to: data.email, // Changed from to_email to to
    from_name: "@exias",
    reply_to: data.email,
  };

  try {
    console.log("Sending user confirmation email with params:", templateParams);
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_USER_TEMPLATE_ID,
      templateParams
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
    to: data.email, // Changed from to_email to to
    from_name: "@exias",
    reply_to: data.email,
  };

  try {
    console.log("Sending organizer notification email with params:", templateParams);
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_ORGANIZER_TEMPLATE_ID,
      templateParams
    );
    console.log("Email de notification envoyé avec succès:", response);
  } catch (error) {
    console.error("Error sending organizer notification:", error);
    throw error;
  }
};