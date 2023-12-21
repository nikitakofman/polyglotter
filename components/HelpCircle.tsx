"use client";

import { HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

function HelpCircleButton() {
  const router = useRouter();
  return (
    <HelpCircle
      onClick={() => router.push("/support")}
      className="cursor-pointer"
    />
  );
}

export default HelpCircleButton;
