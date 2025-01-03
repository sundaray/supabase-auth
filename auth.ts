import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: process.env.NODE_ENV === "development", // Enable logging for development
  session: { strategy: "jwt" },
  providers: [Google],
})