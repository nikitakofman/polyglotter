"use client";

import { useEffect } from "react";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function VerifyEmailPage() {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    if (
      isSignInWithEmailLink(auth, window.location.href) &&
      session?.user?.email
    ) {
      const email = session.user.email; // Email from session

      signInWithEmailLink(auth, email, window.location.href)
        .then(async (result) => {
          // User is successfully verified here
          const firestore = getFirestore();
          const userRef = doc(firestore, "users", result.user.uid);

          await updateDoc(userRef, {
            emailVerified: true,
          }).then(() => {
            toast({
              title: "Success",
              description: "Your e-mail has been verified",
              className: "bg-green-600 text-white",
              duration: 3000,
            });
            router.push("/chat");
          });

          // Redirect the user or show verification success message
        })
        .catch((error) => {
          // Handle errors, such as invalid or expired link
        });
    }
  }, [session, status]); // Dependency on session and status

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <LoadingSpinner />
      Verifying your email...
    </div>
  );
}
