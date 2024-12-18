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
      nom: data.lastName,
      prenom: data.firstName,
      verification_url: `${window.location.origin}/verify-registration?email=${encodeURIComponent(data.email)}`,
    };

    const response = await emailjs.send(
      'service_sxgma2j',
      'template_2ncsaxe',
      templateParams,
      'KeyRo8JahlKtBGVd_OI4'
    );

    return response;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};