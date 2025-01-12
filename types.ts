import type { EmailOtpType } from "@supabase/supabase-js";

export type AuthMethodType = Extract<
  EmailOtpType,
  "signup" | "magiclink" | "recovery"
>;
