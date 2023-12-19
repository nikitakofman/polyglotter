"use client";

import { Message, sortedMessagesRef } from "@/lib/converters/Message";
import { useLanguageStore } from "@/store/store";
import { MessageCircleIcon } from "lucide-react";
import { Session } from "next-auth";
import { createRef, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import UserAvatar from "./UserAvatar";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";
import { chatMembersRef } from "@/lib/converters/ChatMembers";
import { onSnapshot } from "firebase/firestore";
import { toast } from "./ui/use-toast";

function ChatMessages({
  chatId,
  initialMessages,
  session,
}: {
  chatId: string;
  initialMessages: Message[];
  session: Session | null;
}) {
  const language = useLanguageStore((state) => state.language);
  const messagesEndRef = createRef<HTMLDivElement>();

  const [messages, loading, error] = useCollectionData<Message>(
    sortedMessagesRef(chatId),
    {
      initialValue: initialMessages,
    }
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  const router = useRouter();

  useEffect(() => {
    const membersRef = chatMembersRef(chatId);
    const unsubscribe = onSnapshot(membersRef, (snapshot) => {
      const isMember = snapshot.docs.some(
        (doc) => doc.data().userId === session?.user.id
      );
      if (!isMember) {
        toast({
          title: "Admin removed you",
          description: "You have been removed from this chat",
          duration: 3000,
        });
        router.push("/chat"); // Replace with your redirection logic
      }
    });

    return () => unsubscribe();
  }, [chatId, session?.user.id, router]);

  return (
    <div className="pr-5 pl-5 pb-20 mt-3">
      {!loading && messages?.length === 0 && (
        <div className="flex flex-col justify-center text-center items-center p-10  rounded-xl space-y-2  text-black dark:text-white font-extralight">
          <MessageCircleIcon className="h-10 w-10" />
          <h2>
            <span className="font-bold">Invite a friend</span> &{" "}
            <span className="font-bold">
              Send your first message in ANY language
            </span>{" "}
            below to get started!
          </h2>
          <p>The AI will auto-detect & translate it all for you</p>
        </div>
      )}
      {messages?.map((message) => {
        const isSender = message.user.id === session?.user.id;
        const hasText = message.input && message.input.trim().length > 0; // Check if there's text content

        return (
          <div key={message.id} className="flex my-2 items-end">
            <div
              className={`flex flex-col relative space-y-2 p-4 w-fit mx-2 rounded-lg ${
                isSender
                  ? "ml-auto border border-[#EF9351]/30 text-black dark:text-white rounded-br-none"
                  : "bg-gray-100 dark:bg-slate-700 dark:text-gray-100 rounded-bl-none"
              }`}
            >
              <p
                className={`text-xs italic font-extralight ${
                  isSender ? "text-right" : "text-left"
                }`}
              >
                {message.user.name.split(" ")[0]}
              </p>
              {message.imageUrl && message.imageUrl !== "undefined" && (
                <img
                  src={message.imageUrl}
                  alt="Uploaded"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                  className="object-cover"
                />
              )}
              <div className="flex items-center space-x-2">
                <p>{message.translated?.[language] || message.input}</p>
                {hasText && !message.translated && <LoadingSpinner />}
              </div>
            </div>
            <UserAvatar
              name={message.user.name}
              image={message.user.image}
              className={`${!isSender && "order-1"}`}
            />
          </div>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;
