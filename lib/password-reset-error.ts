export class PasswordResetError extends Error {
  public static readonly errorMessages = {
    TOKEN_EXPIRED: "Invalid token.",
    TOKEN_NOT_FOUND: "Invalid token.",
    PASSWORD_RESET_FAILED: "Password reset failed. Please try again.",
    USER_NOT_FOUND: "User not found.",
    ACCOUNT_NOT_VERIFIED: "Account not verified.",
    EMAIL_NOT_SENT: "Failed to send password reset link. Please try again.",
  } as const;

  public readonly code: keyof typeof PasswordResetError.errorMessages;

  constructor(code: keyof typeof PasswordResetError.errorMessages) {
    const message = PasswordResetError.errorMessages[code];
    super(message);

    this.code = code;
    this.name = "PasswordResetError";
  }

  public static getErrorMessage(
    code: keyof typeof PasswordResetError.errorMessages,
  ) {
    return this.errorMessages[code];
  }
}
