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
        image: { label: "Image", type: "image" },
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
    signIn: async ({ user, account, profile }) => {
      if (user) {
        // Add provider to the token object
        user.provider = account.provider;
      }
      return true;
    },
    jwt: async ({ token, user }) => {
      // Transfer provider to the token for use in session callback
      if (user) {
        token.provider = user.provider;
      }
      return token;
    },
    session: async ({ session, token, user }) => {
      if (session?.user && token.sub) {
        session.user.id = token.sub;

        try {
          let firebaseUser;

          // Attempt to retrieve the user by UID
          try {
            firebaseUser = await adminAuth.getUser(token.sub);

            const userRef = adminDb.collection("users").doc(token.sub);
            const userDoc = await userRef.get();
            if (userDoc.exists) {
              // Assuming 'image' is the field where the image URL is stored
              const customImageURL = userDoc.data()!.image;
              if (customImageURL) {
                session.user.image = customImageURL;
              }
            } else {
              console.log(
                "No user found in Firestore with the UID:",
                token.sub
              );
            }
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
            console.log("hello");
            session.user.emailVerified = true;
          } else {
            // Update session properties if needed
            //@ts-ignore
            session.user.emailVerified = firebaseUser.emailVerified;
            console.log(firebaseUser);

            const customImageProperty =
              //@ts-ignore
              firebaseUser.photoURL || firebaseUser["image"]; // Replace with your actual property name

            if (customImageProperty) {
              session.user.image = customImageProperty;
            }
          }

          // Create a custom token for the Firebase user
          const firebaseToken = await adminAuth.createCustomToken(token.sub);
          session.firebaseToken = firebaseToken;
        } catch (error) {
          console.error("Error handling Firebase user:", error);
          // Handle the error appropriately
        }
        session.user.provider = token.provider;
      }
      console.log(session);

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  adapter: FirestoreAdapter(adminDb),
} satisfies NextAuthOptions;
