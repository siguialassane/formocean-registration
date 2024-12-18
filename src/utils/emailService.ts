import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = "service_7yvzwzp";
const EMAILJS_TEMPLATE_ID = "template_8aqw0xj";
const EMAILJS_PUBLIC_KEY = "user_K2fXVvZxDPdEV6oDqF9Xt";

export const sendUserConfirmationEmail = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
}) => {
  const templateParams = {
    to_name: `${data.firstName} ${data.lastName}`,
    to_email: data.email,
    verification_url: `${window.location.origin}/verify-registration?id=${data.id}`,
    qr_code_url: `${window.location.origin}/verify-info?id=${data.id}`,
  };

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
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
  };

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
  } catch (error) {
    console.error("Error sending organizer notification:", error);
    throw error;
  }
};