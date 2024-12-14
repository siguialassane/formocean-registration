import emailjs from '@emailjs/browser';

const EMAIL_SERVICE_ID = 'service_sxgma2j';
const USER_TEMPLATE_ID = 'template_dp1tu2w';
const ORGANIZER_TEMPLATE_ID = 'template_2ncsaxe';
const PUBLIC_KEY = 'Ro8JahlKtBGVd_OI4';
const ORGANIZER_EMAIL = 'organisateur@example.com'; // Replace with actual organizer email

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
};

export const sendUserConfirmationEmail = async (data: UserData) => {
  try {
    const templateParams = {
      to_name: `${data.firstName} ${data.lastName}`,
      to_email: data.email,
      user_email: data.email,
      status: data.status,
      message: `Merci de votre inscription en tant que ${data.status}`,
      reply_to: data.email, // Ensure reply-to is set
    };

    await emailjs.send(
      EMAIL_SERVICE_ID,
      USER_TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email à l'utilisateur:", error);
    throw error;
  }
};

export const sendOrganizerNotificationEmail = async (data: UserData) => {
  try {
    const templateParams = {
      to_email: ORGANIZER_EMAIL, // Explicitly set organizer's email
      participant_name: `${data.firstName} ${data.lastName}`,
      participant_email: data.email,
      participant_phone: data.phone,
      participant_status: data.status,
      reply_to: ORGANIZER_EMAIL,
    };

    await emailjs.send(
      EMAIL_SERVICE_ID,
      ORGANIZER_TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email à l'organisateur:", error);
    throw error;
  }
};