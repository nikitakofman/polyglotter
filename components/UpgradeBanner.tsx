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
    <Button
      onClick={() => router.push("/register")}
      className="w-full rounded-non bg-gradient-to-r from-orange-700 to-orange-200 text-center text-white px-5 py-5 hover:from-orange-600 hover:to-orange-100 hover:shadow-md transition-all"
    >
      Upgrade to Pro to unlock all features!
    </Button>
  );
}

export default UpgradeBanner;
