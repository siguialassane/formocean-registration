import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const VerifyRegistration = () => {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const registrationId = searchParams.get("id");
  const qrValue = `${window.location.origin}/verify-info?id=${registrationId}`;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!registrationId) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "ID d'inscription invalide",
        });
        return;
      }

      try {
        const { data, error } = await supabase
          .from("contacts")
          .select("*")
          .eq("id", registrationId)
          .single();

        if (error) throw error;
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les informations de l'utilisateur",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [registrationId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Code QR d'inscription</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <QRCode value={qrValue} />
          </div>
          <p className="text-sm text-gray-500 text-center">
            Scannez ce code QR pour vérifier votre inscription
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyRegistration;