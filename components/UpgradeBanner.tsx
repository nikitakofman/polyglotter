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
      className="bg-[#EF9352] hover:bg-orange-300 flex items-center flex-col cursor-pointer mr-3  text-transparent bg-clip-text"
    >
      <p className=" text-[10px] leading-[0px] mt-2.5"> GET</p>
      <p> PRO</p>
    </div>
  );
}

export default UpgradeBanner;
