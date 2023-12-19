import { CheckIcon } from "lucide-react";
import Link from "next/link";
import CheckoutButton from "./CheckoutButton";
import GetStarted from "./GetStarted";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const tiers = [
  {
    name: "Starter",
    id: null,
    href: "#",
    priceMonthly: null,
    description: "Dive into the world of multilingual messaging!",
    features: [
      "Add 2 other participants to your chats",
      "Create and join up to 3 distinct chat rooms",
      "Multilingual support for 2 languages",
    ],
  },
  {
    name: "Pro",
    id: "pro",
    href: "#",
    priceMonthly: "€5.99",
    description: "Unlock the Full Potential with Pro!",
    features: [
      "Unlimited number of participants in your chats",
      "Create and join limitless chat rooms",
      "Translate chats to all available languages",
      "Unlock ability to send media in chat",
    ],
  },
];

async function PricingCards({ redirect }: { redirect: boolean }) {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="flex flex-col justify-between rounded-3xl bg-white shadow-md p-8 border sm:p-10"
          >
            <div>
              <h3
                id={tier.id + tier.name}
                className="text-base font-semibold leading-7 text-[#EF9351]"
              >
                {tier.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-x-2">
                {tier.priceMonthly ? (
                  <>
                    <span className="text-5xl font-bold tracking-tight text-gray-900">
                      {tier.priceMonthly}
                    </span>
                    <span className="text-base font-sebmiold leading-7 text-gray-600">
                      /month
                    </span>
                  </>
                ) : (
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    Free
                  </span>
                )}
              </div>
              <p className="mt-6 text-base leading-7 text-gray-600">
                {tier.description}
              </p>
              <ul
                role="list"
                className="mt-10 space-y-4 text-sm leading-6 text-gray-600"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-[#EF9351]"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            {redirect ? (
              // <Link
              //   href="/register"
              //   className="mt-8 block rounded-md bg-[#EF9352] px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#FE9C50] focus:visible:outline focus:visible:outline-2 focus:visible:outline-offset-2 focus:visible:outline-[#EF9351] cursor-pointer disabled:opacity-80"
              // >
              //   Get Started Today
              // </Link>
              <div className="mt-8">
                <GetStarted session={session} />
              </div>
            ) : (
              tier.id && <CheckoutButton />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingCards;
