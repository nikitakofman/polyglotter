"use client";

import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

function ResendEmail() {
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: "http://polyglotter.app/verify",
    // This must be true.
    handleCodeInApp: true,
  };

  const { data: session } = useSession();

  console.log(session);

  const auth = getAuth();

  const resendEmail = () => {
    //@ts-ignore
    sendSignInLinkToEmail(auth, session?.user.email, actionCodeSettings);
    toast({
      title: "Success",
      description: `Activation link sent to ${session?.user.email}`,
      className: "bg-green-600 text-white",
      duration: 2000,
    });
  };
  return (
    <div>
      {" "}
      <Button onClick={() => resendEmail()}>Resend e-mail</Button>
    </div>
  );
}

export default ResendEmail;
