import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const VerifyInfo = () => {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const registrationId = searchParams.get("id");

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

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Aucune information trouvée</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Informations d'inscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Nom:</p>
              <p>{userData.nom}</p>
            </div>
            <div>
              <p className="font-semibold">Prénom:</p>
              <p>{userData.prenom}</p>
            </div>
            <div>
              <p className="font-semibold">Email:</p>
              <p>{userData.email}</p>
            </div>
            <div>
              <p className="font-semibold">Téléphone:</p>
              <p>{userData.tel}</p>
            </div>
            <div>
              <p className="font-semibold">Status:</p>
              <p>{userData.status}</p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">@exias</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyInfo;