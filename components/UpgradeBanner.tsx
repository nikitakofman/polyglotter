"use client";

import { useSubscriptionStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

function UpgradeBanner() {
  const subscription = useSubscriptionStore((state) => state.subscription);

  console.log(subscription);

  const isPro = subscription?.role === "pro";
  const router = useRouter();

  if (subscription === undefined || isPro) return null;

  return (
    <div
      onClick={() => router.push("/register")}
      className="bg-[#EF9352] cursor-pointer mr-3 inline-block text-transparent bg-clip-text"
    >
      PRO
    </div>
  );
}

export default UpgradeBanner;
