import "server-only";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";
import { PasswordResetError } from "@/lib/password-reset-error";

export async function resetPassword(
  email: string,
  newPassword: string,
  token: string,
) {
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    const { error } = await supabase
      .schema("next_auth")
      .from("users")
      .update({ password: hashedPassword })
      .eq("email", email)
      .select()
      .single();

    if (error) {
      console.error("Failed to update password:", error);
      throw new PasswordResetError("PASSWORD_RESET_FAILED");
    }

    // Delete reset token after successful password update
    const { error: deleteError } = await supabase
      .schema("next_auth")
      .from("verification_tokens")
      .delete()
      .eq("token", token!);

    if (deleteError) {
      // Log but don't throw - token cleanup isn't critical to password update success
      console.error("Failed to delete reset token:", deleteError);
    }
  } catch (error) {
    throw error;
  }
}
