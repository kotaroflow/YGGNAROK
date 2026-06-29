import { z } from "zod";

const emailPasswordSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export const signInSchema = emailPasswordSchema;
export const signUpSchema = emailPasswordSchema;
