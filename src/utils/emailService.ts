import emailjs from '@emailjs/browser';

interface EmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}

export const sendConfirmationEmail = async (data: EmailData) => {
  try {
    const templateParams = {
      to_name: `${data.firstName} ${data.lastName}`,
      to_email: data.email,
      user_status: data.status,
      user_phone: data.phone,
    };

    const response = await emailjs.send(
      'YOUR_SERVICE_ID', // Remplacez par votre Service ID
      'YOUR_TEMPLATE_ID', // Remplacez par votre Template ID
      templateParams,
      'YOUR_PUBLIC_KEY' // Remplacez par votre Public Key
    );

    return response;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};