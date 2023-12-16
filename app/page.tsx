import { authOptions } from "@/auth";
import GetStarted from "@/components/GetStarted";
import HowItWorks from "@/components/HowItWorks";
import UserButton from "@/components/UserButton";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="">
      <div className="isolate  dark:bg-gray-900">
        {/* <div
          className="absolute inset-x-0 top-28 -z-10 transofrm-gpu overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80B5] to-[#9089FC] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div> */}
        <div className=" flex items-center justify-center bg-gradient-to-t from-[#EF9351]/40 to-bg-gray-900 customminheight">
          <div className="max-w-7xl flex flex-col items-center sm:flex-row">
            <div className="w-full p-6 text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Revolutionizing communication
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Say it in your voice, hear it in theirs – instant multilingual
                chat made real.
                {/* <span className="text-[#EF9351] dark:text-[#EF9351]">
                  Let AI handle the translation.
                </span> */}
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {/* <Link
                  href="/chat"
                  className="rounded-md bg-[#ef9351] px-3.5 py-2.5 text-sm font-semibold text-white dark:text-white shadow-sm hover:bg-[#FE9D52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF9351]"
                >
                  Get started
                </Link> */}
                <GetStarted session={session} />
                <a
                  href="#howItWorks"
                  className="rounded-md  px-3.5 py-2.5 text-sm font-semibold text-black hover:text-gray-400 dark:hover:text-gray-400 dark:text-white  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF9351]"
                >
                  How it works
                </a>
                {/* <Link
                  href="/pricing"
                  className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-300"
                >
                  View Pricing <span aria-hidden="true">→</span>
                </Link> */}
              </div>
            </div>
            <div className="mt-16 flex hidden items-center justify-center sm:mt-0 w-full">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                  unoptimized
                  src="/demogif.png"
                  alt="App screenshot"
                  width={2432}
                  height={1442}
                  className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>
        </div>
        <div id="howItWorks">
          <HowItWorks />
        </div>
      </div>
    </main>
  );
}
