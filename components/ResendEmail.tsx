"use client";

import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

function ResendEmail() {
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: "http://localhost:3000/verify",
    // This must be true.
    handleCodeInApp: true,
  };

  const { data: session } = useSession();

  const auth = getAuth();

  const resendEmail = () => {
    //@ts-ignore
    sendSignInLinkToEmail(auth, session?.user.email, actionCodeSettings);
  };
  return (
    <div>
      {" "}
      <Button onClick={() => resendEmail()}>Resend e-mail</Button>
    </div>
  );
}

export default ResendEmail;
