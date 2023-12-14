import { FirestoreAdapter } from "@auth/firebase-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { adminAuth, adminDb } from "./firebase-admin";
import CredentialsProvider from "next-auth/providers/credentials"; // Import the CredentialsProvider
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        id: { label: "Id", type: "id" },
      },
      async authorize(credentials, req) {
        console.log(credentials);
        if (!credentials) return null;

        const user = {
          //@ts-ignore
          name: credentials?.name,
          email: credentials?.email,
          id: credentials?.id,
        };
        return user;
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      console.log("thoxss", session.user);
      console.log("bros", token);
      if (
        session?.user &&
        token.sub &&
        typeof token.sub === "string" &&
        token.sub.trim() !== ""
      ) {
        session.user.id = token.sub;

        try {
          const firebaseToken = await adminAuth.createCustomToken(token.sub);
          session.firebaseToken = firebaseToken;
        } catch (error) {
          console.error("Error creating Firebase custom token:", error);
          // Handle the error appropriately
        }
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  adapter: FirestoreAdapter(adminDb),
} satisfies NextAuthOptions;
