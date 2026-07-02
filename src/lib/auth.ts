import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          return null;
        }

        // Hardcoded OTP for testing
        if (credentials.otp !== "1234") {
          return null;
        }

        // Normalize phone: strip +91, country codes, spaces, dashes, brackets
        let phone = (credentials.phone as string).replace(/[\s\-().]/g, "");
        // Remove leading + and country codes like +91, 0091
        phone = phone.replace(/^\+91/, "").replace(/^0091/, "").replace(/^\+/, "");
        // Keep only last 10 digits if longer
        if (phone.length > 10) {
          phone = phone.slice(-10);
        }

        // Try exact match first, then normalized
        let user = await prisma.user.findFirst({
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
