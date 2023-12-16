"use client";

import LoginPage from "@/components/LoginPage";
import UserButton from "@/components/UserButton";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

function page() {
  const { data: session } = useSession();
  return (
    <div>
      <LoginPage session={session} />
    </div>
  );
}

export default page;
