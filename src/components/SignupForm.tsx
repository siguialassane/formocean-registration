import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import emailjs from '@emailjs/browser';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "participant" | "paneliste";
};

const SignupForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "+225",
      status: "participant",
    },
  });

  const sendUserConfirmationEmail = async (data: FormData) => {
    try {
      const templateParams = {
        to_name: `${data.firstName} ${data.lastName}`,
        to_email: data.email, // This is crucial for EmailJS to work
        user_email: data.email, // Backup in case template uses this variable
        status: data.status,
        message: `Merci de votre inscription en tant que ${data.status}`,
      };

      await emailjs.send(
        'service_sxgma2j',
        'template_dp1tu2w',
        templateParams,
        'Ro8JahlKtBGVd_OI4'
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email à l'utilisateur:", error);
      throw error;
    }
  };

  const sendOrganizerNotificationEmail = async (data: FormData) => {
    try {
      const templateParams = {
        participant_name: `${data.firstName} ${data.lastName}`,
        participant_email: data.email,
        participant_phone: data.phone,
        participant_status: data.status,
        // Make sure your EmailJS template has a default recipient email set
        // in the template settings, as we don't specify it here
      };

      await emailjs.send(
        'service_sxgma2j',
        'template_2ncsaxe',
        templateParams,
        'Ro8JahlKtBGVd_OI4'
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email à l'organisateur:", error);
      throw error;
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contacts").insert({
        nom: data.lastName,
        prenom: data.firstName,
        email: data.email,
        tel: data.phone,
        status: data.status.charAt(0).toUpperCase() + data.status.slice(1), // Capitalize first letter
      });

      if (error) throw error;

      // Envoi des emails de confirmation
      await Promise.all([
        sendUserConfirmationEmail(data),
        sendOrganizerNotificationEmail(data)
      ]);

      toast({
        title: "Inscription réussie!",
        description: "Vos informations ont été enregistrées avec succès. Un email de confirmation vous a été envoyé.",
      });
      form.reset();
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Votre prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="votre@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input placeholder="+225 XX XX XX XX XX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="participant">Participant</SelectItem>
                  <SelectItem value="paneliste">Panéliste</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;