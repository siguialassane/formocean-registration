import emailjs from '@emailjs/browser';

const EMAIL_SERVICE_ID = 'service_sxgma2j';
const USER_TEMPLATE_ID = 'template_dp1tu2w';
const ORGANIZER_TEMPLATE_ID = 'template_2ncsaxe';
const PUBLIC_KEY = 'Ro8JahlKtBGVd_OI4';
const ORGANIZER_EMAIL = 'organisateur@example.com';

emailjs.init(PUBLIC_KEY);

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  id?: string;
};

export const sendUserConfirmationEmail = async (data: UserData) => {
  try {
    const verificationUrl = `${window.location.origin}/verify-info?id=${data.id}`;
    
    // Generate QR code URL using QR Server
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;
    
    const templateParams = {
      from_name: "Admin",
      to_email: data.email,
      email: data.email,
      nom: data.lastName,
      prenom: data.firstName,
      tel: data.phone,
      status: data.status,
      verification_url: verificationUrl,
      qr_code_url: qrCodeUrl,
      reply_to: data.email,
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
      to_email: ORGANIZER_EMAIL,
      email: data.email,
      nom: data.lastName,
      prenom: data.firstName,
      tel: data.phone,
      status: data.status,
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