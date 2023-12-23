import NextAuthGoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import { DEFAULT_ROLE } from "../../auth";

export const GOOGLE_MAIL_SUFFIXES = ["gmail.com", "googlemail.com"];

export default NextAuthGoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  profile(profile: GoogleProfile) {
    return {
      id: profile.sub,
      role: DEFAULT_ROLE,
      isEmailVerified: profile.email_verified,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    };
  },
});
