import { z } from "zod";

export const signInWithEmailSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});

export const signInWithEmailAndPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required"),
    confirmNewPassword: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    // This tells Zod which field to attach the error to
    path: ["confirmNewPassword"],
  })