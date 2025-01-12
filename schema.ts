import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
});

export const signInEmailPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
  password: z.string({ required_error: "Password is required" }),
});

export const signUpEmailPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
    confirmNewPassword: z.string({ required_error: "Password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    // This tells Zod which field to attach the error to
    path: ["confirmNewPassword"],
  });
