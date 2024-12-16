import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ConfirmationMessage from "@/components/ConfirmationMessage";
import { sendConfirmationEmail, sendOrganizerNotification } from "@/utils/emailService";

const ConfirmationInscription = () => {
  const [countdown, setCountdown] = useState(5);
  const [showButton, setShowButton] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
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
    const button = document.querySelector('.return-button');
    if (button) {
      button.classList.add('animate-firework');
      setTimeout(() => {
        button.classList.add('hidden');
      }, 500);
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
      
      const emailSent = await sendConfirmationEmail({
        to_email: formData.email,
        to_name: `${formData.firstName} ${formData.lastName}`,
        verification_url: `${window.location.origin}/verify-registration?id=${insertedData.id}`,
        qr_code_url: `${window.location.origin}/verify-info?id=${insertedData.id}`
      });

      if (emailSent) {
        toast.success("Email de confirmation envoyé !");
      } else {
        toast.error("Erreur lors de l'envoi de l'email de confirmation");
      }

      const notificationSent = await sendOrganizerNotification({
        organizer_email: 'votre@email.com',
        participant_name: `${formData.firstName} ${formData.lastName}`,
        participant_email: formData.email,
        participant_phone: formData.phone,
        participant_status: formData.status
      });

      if (notificationSent) {
        console.log("Notification envoyée à l'organisateur");
      } else {
        console.error("Erreur lors de l'envoi de la notification");
      }

      toast.success("Inscription réussie !");
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
      <ConfirmationMessage firstName={formData.firstName} lastName={formData.lastName} />
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
  );
};

export default ConfirmationInscription;