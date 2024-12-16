import emailjs from '@emailjs/browser';

interface EmailTemplateParams {
  to_email: string;
  to_name: string;
  verification_url: string;
  qr_code_url: string;
}

interface OrganizerNotificationParams {
  organizer_email: string;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  participant_status: string;
}

export const sendConfirmationEmail = async (data: EmailTemplateParams): Promise<boolean> => {
  if (!data.to_email) {
    console.error('Email recipient is missing');
    return false;
  }

  try {
    console.log('Sending confirmation email with params:', data);
    const response = await emailjs.send(
      'service_sxgma2j',
      'template_2ncsaxe',
      data,
      'Ro8JahlKtBGVd_OI4'
    );

    console.log('Email envoyé avec succès:', response);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
};

export const sendOrganizerNotification = async (data: OrganizerNotificationParams): Promise<boolean> => {
  if (!data.organizer_email || !data.participant_email) {
    console.error('Required email addresses are missing');
    return false;
  }

  try {
    console.log('Sending organizer notification with params:', data);
    const response = await emailjs.send(
      'service_sxgma2j',
      'template_dp1tu2w',
      data,
      'Ro8JahlKtBGVd_OI4'
    );

    console.log('Notification envoyée avec succès:', response);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    return false;
  }
};