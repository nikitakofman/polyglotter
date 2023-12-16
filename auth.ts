import { FirestoreAdapter } from "@auth/firebase-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { adminAuth, adminDb } from "./firebase-admin";
import CredentialsProvider from "next-auth/providers/credentials"; // Import the CredentialsProvider
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import admin from "firebase-admin";

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
        if (!credentials) return null;

        console.log("pxjoij", credentials);

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
    session: async ({ session, token, user }) => {
      if (session?.user && token.sub) {
        session.user.id = token.sub;

        try {
          let firebaseUser;

          // Attempt to retrieve the user by UID
          try {
            firebaseUser = await adminAuth.getUser(token.sub);
          } catch (error) {
            // If UID not found, check by email
            //@ts-ignore
            if (error.code === "auth/user-not-found") {
              try {
                firebaseUser = await adminAuth.getUserByEmail(
                  //@ts-ignore
                  session.user.email
                );
                // Handle account linking if necessary
                if (firebaseUser.uid !== token.sub) {
                  // [Implement account linking logic here]
                }
              } catch (emailError) {
                // Only if user not found by email, create a new user
                //@ts-ignore
                if (emailError.code === "auth/user-not-found") {
                  firebaseUser = await adminAuth.createUser({
                    uid: token.sub,
                    //@ts-ignore
                    email: session.user.email,
                    emailVerified: true, // Set emailVerified to true for new users
                    // ... [other user info] ...
                  });
                } else {
                  throw emailError;
                }
              }
            } else {
              throw error;
            }
          }

          // Set emailVerified to true if the user logged in with Google
          //@ts-ignore
          if (user && user.provider === "google") {
            //@ts-ignore
            session.user.emailVerified = true;
          } else {
            // Update session properties if needed
            //@ts-ignore
            session.user.emailVerified = firebaseUser.emailVerified;
          }

          // Create a custom token for the Firebase user
          const firebaseToken = await adminAuth.createCustomToken(token.sub);
          session.firebaseToken = firebaseToken;
        } catch (error) {
          console.error("Error handling Firebase user:", error);
          // Handle the error appropriately
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  adapter: FirestoreAdapter(adminDb),
} satisfies NextAuthOptions;
