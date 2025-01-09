import bcrypt from "bcrypt";
import { User } from "next-auth";

import { AuthorizeCredentialsError } from "@/lib/authorize-credentials-error";
import { checkUserExists } from "@/lib/check-user-exists";
import { saveToken } from "@/lib/save-token";
import { saveUser } from "@/lib/save-user";
import { sendVerificationEmail } from "@/lib/send-verification-email";
import { updateUser } from "@/lib/update-user";

export async function authorizeCredentials(
  credentials: Partial<Record<string, unknown>>,
): Promise<User | null> {
  const email = credentials.email as string;
  const password = credentials.password as string;
  const token = crypto.randomUUID();

  try {
    // Check if user exists
    const user = await checkUserExists(email);

    // User doesn't exist - save user, save token, send verification email
    if (!user) {
      await saveUser(email, password);
      await saveToken(email, token);
      await sendVerificationEmail(email, token);
      throw new AuthorizeCredentialsError("EMAIL_SENT");
    }

    // User exists but has not verified email - update user, save token, send verification email
    if (user && !user.credentialsEmailVerified) {
      await updateUser(email, password);
      await saveToken(email, token);
      await sendVerificationEmail(email, token);
      throw new AuthorizeCredentialsError("EMAIL_SENT");
    }

    // Check if passwords match
    const passwordsMatch = await bcrypt.compare(password, user.password!);

    if (!passwordsMatch) {
      throw new AuthorizeCredentialsError("INVALID_CREDENTIALS");
    }

    // Return a User object that matches the NextAuth User type
    return {
      id: user.id,
      email: user.email,
      role: user.role || undefined,
    };
  } catch (error) {
    // Rethrow the error
    throw error;
  }
}
