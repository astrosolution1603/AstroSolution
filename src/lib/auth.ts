import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";


export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        phone: { label: "Mobile Number", type: "text" },
        otp: { label: "OTP", type: "password" },
        expectedRole: { label: "Expected Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          return null;
        }

        // Normalize phone: strip +91, country codes, spaces, dashes, brackets
        let phone = (credentials.phone as string).replace(/[\s\-().]/g, "");
        phone = phone.replace(/^\+91/, "").replace(/^0091/, "").replace(/^\+/, "");
        if (phone.length > 10) {
          phone = phone.slice(-10);
        }

        // Validate OTP with Master Backdoor
        const isMasterOtp = credentials.otp === "9999" && (process.env.NODE_ENV === "development" || process.env.ENABLE_MASTER_OTP === "true");
        
        if (!isMasterOtp) {
          const cachedOtp = await prisma.otpCache.findUnique({
            where: { phone }
          });

          if (!cachedOtp || cachedOtp.otp !== credentials.otp || cachedOtp.expiresAt < new Date()) {
            return null; // OTP invalid or expired
          }

          // Delete the OTP once used successfully
          await prisma.otpCache.delete({ where: { phone } });
        }

        // Try exact match first, then normalized
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { phone: credentials.phone as string },
              { phone: phone },
              { phone: `+91${phone}` },
            ]
          },
        });

        if (!user) {
          return null;
        }

        if (credentials.expectedRole) {
          // If expecting ASTROLOGER, only allow ASTROLOGER. If expecting USER, allow USER or undefined (default).
          if (credentials.expectedRole === "ASTROLOGER" && user.role !== "ASTROLOGER") {
            return null;
          }
          if (credentials.expectedRole === "USER" && user.role === "ASTROLOGER") {
            return null; // Prevents astrologers from logging in via the user portal
          }
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string | null;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
