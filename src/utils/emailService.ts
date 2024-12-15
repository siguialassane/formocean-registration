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
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${data.lastName};${data.firstName};;;`,
      `FN:${data.firstName} ${data.lastName}`,
      `TEL;TYPE=CELL:${data.phone}`,
      `EMAIL:${data.email}`,
      `TITLE:${data.status}`,
      'END:VCARD'
    ].join('\n');

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(vCardData)}`;
    
    const templateParams = {
      from_name: "Admin",
      to_email: data.email,
      email: data.email,
      nom: data.lastName,
      prenom: data.firstName,
      tel: data.phone,
      status: data.status,
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