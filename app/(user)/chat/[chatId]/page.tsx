import { authOptions } from "@/auth";
import AdminControls from "@/components/AdminControls";
import ChatInput from "@/components/ChatInput";
import ChatMembersBadges from "@/components/ChatMembersBadges";
import ChatMessages from "@/components/ChatMessages";
import { chatMembersRef } from "@/lib/converters/ChatMembers";
import { sortedMessagesRef } from "@/lib/converters/Message";
import { getDocs } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import ResendEmail from "@/components/ResendEmail";

type Props = {
  params: {
    chatId: string;
  };
};

async function ChatPage({ params: { chatId } }: Props) {
  const session = await getServerSession(authOptions);

  console.log(session);

  const initialMessages = (await getDocs(sortedMessagesRef(chatId))).docs.map(
    (doc) => doc.data()
  );

  const hasAccess = (await getDocs(chatMembersRef(chatId))).docs
    .map((doc) => doc.id)
    .includes(session?.user.id!);

  if (!hasAccess) redirect("/chat?error=permission");

  return (
    <>
      {/*@ts-ignore*/}
      {session?.user.emailVerified ? (
        <>
          <AdminControls chatId={chatId} />
          <div className="flex-1">
            <ChatMessages
              chatId={chatId}
              session={session}
              initialMessages={initialMessages}
            />
          </div>
          <ChatInput chatId={chatId} />{" "}
        </>
      ) : (
        <div className="w-screen h-screen flex flex-col mt-10 p-10 text-center">
          Please verify your e-mail. We have sent an activation link to:
          <p className="font-bold mt-5 mb-5">{session?.user.email}</p>
          <ResendEmail />
        </div>
      )}
    </>
  );
}

export default ChatPage;
