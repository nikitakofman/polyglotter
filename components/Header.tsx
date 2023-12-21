import Logo from "./Logo";
import UserButton from "./UserButton";
import DarkModeToggle from "./DarkModeToggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Link from "next/link";
import {
  HelpCircle,
  MessageSquarePlus,
  MessageSquarePlusIcon,
  MessagesSquareIcon,
} from "lucide-react";
import CreateChatButton from "./CreateChatButton";
import UpgradeBanner from "./UpgradeBanner";
import LanguageSelect from "./LanguageSelect";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Button } from "./ui/button";
import HelpCircleButton from "./HelpCircle";

async function Header() {
  const session: any = await getServerSession(authOptions);
  console.log("this", session?.user.emailVerified);

  return (
    <header className="sticky w-full top-0 z-50 bg-white border-b-2 dark:bg-gray-900">
      <nav className="flex flex-col sm:flex-row items-center pr-2 pl-2 bg-white pb-2 sm:pb-0 dark:bg-transparent  border-white/30 max-w-full mx-auto">
        <div className="flex items-center justify-between w-full">
          {" "}
          <Logo />{" "}
          <div className="sm:hidden flex items-center">
            <UpgradeBanner />
            <DarkModeToggle />
          </div>
        </div>
        <div className="flex-1 flex items-center w-full justify-between sm:justify-end ">
          {/* LanguageSelect */}
          <div className="flex items-center">
            <div className="mr-4">
              <LanguageSelect />
            </div>{" "}
            <div className="bg-transparent hidden sm:flex">
              {" "}
              <UpgradeBanner />
            </div>
            {session ? (
              session?.user.emailVerified ? (
                <>
                  <Link href={"/chat"} prefetch={false}>
                    <MessagesSquareIcon className="text-black dark:text-white" />
                  </Link>
                  <CreateChatButton />
                </>
              ) : (
                <>
                  <Link href={"/chat"} prefetch={false}>
                    <MessagesSquareIcon className="text-black mr-2 dark:text-white" />
                  </Link>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <MessageSquarePlusIcon className="text-gray-500 mr-2 cursor-not-allowed " />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-full">
                      <p className="text-[14px]">
                        Verify your e-mail to start chatting!
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </>
              )
            ) : (
              // "<Link href="/pricing" className="hover:text-gray-400 pr-3">
              //   Pricing
              // </Link>
              <div className="-m-2 sm:mr-3">
                <HelpCircleButton />
              </div>
            )}
          </div>
          <div className="flex items-center">
            <div className="hidden sm:flex mr-3">
              <DarkModeToggle />
            </div>
            <UserButton session={session} />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
