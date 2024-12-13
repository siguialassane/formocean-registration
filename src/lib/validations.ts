import * as z from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z
    .string()
    .min(13, "Le numéro doit contenir au moins 13 caractères")
    .regex(/^\+225[0-9]{10}$/, "Le format doit être +225 suivi de 10 chiffres"),
  status: z.enum(["participant", "paneliste"]),
});