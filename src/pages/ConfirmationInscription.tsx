import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

const ConfirmationInscription = () => {
  const [countdown, setCountdown] = useState(5);
  const [showButton, setShowButton] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    // Get data from localStorage
    const storedData = localStorage.getItem('registrationData');
    if (!storedData) {
      navigate("/");
      return;
    }
    setFormData(JSON.parse(storedData));

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleButtonDisappear();
          handleFinalSubmission();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleButtonDisappear = () => {
    setShowButton(false);
    // Add firework animation class
    const button = document.querySelector('.return-button');
    if (button) {
      button.classList.add('animate-firework');
      setTimeout(() => {
        button.classList.add('hidden');
      }, 500);
    }
  };

  const sendConfirmationEmail = async (data: any) => {
    if (!data.email) {
      console.error('Email recipient is missing');
      return false;
    }

    try {
      const templateParams = {
        to_email: data.email,
        to_name: `${data.firstName} ${data.lastName}`,
        verification_url: `${window.location.origin}/verify-registration?id=${data.id}`,
        qr_code_url: `${window.location.origin}/verify-info?id=${data.id}`
      };

      console.log('Sending confirmation email with params:', templateParams);

      const response = await emailjs.send(
        'service_sxgma2j',
        'template_2ncsaxe',
        templateParams,
        'Ro8JahlKtBGVd_OI4'
      );

      console.log('Email envoyé avec succès:', response);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  };

  const sendOrganizerNotification = async (data: any) => {
    try {
      const templateParams = {
        organizer_email: 'votre@email.com', // Replace with actual organizer email
        participant_name: `${data.firstName} ${data.lastName}`,
        participant_email: data.email,
        participant_phone: data.phone,
        participant_status: data.status
      };

      console.log('Sending organizer notification with params:', templateParams);

      const response = await emailjs.send(
        'service_sxgma2j',
        'template_dp1tu2w',
        templateParams,
        'Ro8JahlKtBGVd_OI4'
      );

      console.log('Notification envoyée avec succès:', response);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      return false;
    }
  };

  const handleFinalSubmission = async () => {
    if (!formData) {
      console.error('No form data available');
      return;
    }

    try {
      console.log("Sending data to database:", formData);
      const { data: insertedData, error } = await supabase
        .from("contacts")
        .insert({
          nom: formData.lastName,
          prenom: formData.firstName,
          email: formData.email,
          tel: formData.phone,
          status: formData.status.charAt(0).toUpperCase() + formData.status.slice(1),
        })
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        toast.error("Erreur lors de l'enregistrement des données");
        throw error;
      }

      console.log("Data inserted successfully:", insertedData);
      
      // Send confirmation email with the inserted data
      const emailSent = await sendConfirmationEmail({
        ...formData,
        id: insertedData.id
      });

      if (emailSent) {
        toast.success("Email de confirmation envoyé !");
      } else {
        toast.error("Erreur lors de l'envoi de l'email de confirmation");
      }

      // Send notification to organizer
      const notificationSent = await sendOrganizerNotification(formData);

      if (notificationSent) {
        console.log("Notification envoyée à l'organisateur");
      } else {
        console.error("Erreur lors de l'envoi de la notification");
      }

      toast.success("Inscription réussie !");
      // Clear localStorage after successful submission
      localStorage.removeItem('registrationData');
    } catch (error) {
      console.error("Erreur lors de l'inscription finale:", error);
      toast.error("Une erreur est survenue lors de l'inscription");
    }
  };

  const handleReturn = () => {
    navigate("/");
  };

  if (!formData) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Félicitations {formData.firstName} {formData.lastName} ! 🎉
        </h1>
        
        <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
          <p className="font-medium">
            Votre inscription a été validée avec succès.
          </p>
          <p>
            Vous recevrez prochainement un e-mail de confirmation avec les prochaines étapes.
          </p>
          <p>
            Nous sommes impatients de vous accueillir à notre événement.
          </p>
          <p className="font-medium">
            Merci d'avoir pris le temps de vous inscrire !
          </p>
        </div>

        {showButton && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleReturn}
              className="return-button bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-500"
            >
              Modifier mes informations ({countdown}s)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationInscription;