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
import { deleteDoc, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { toast } from "./ui/use-toast";
import LoadingSpinnerWhite from "./LoadingSpinnerWhite";

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
    { initialValue: initialMessages }
  );
  const router = useRouter();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

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
        router.push("/chat");
      }
    });

    return () => unsubscribe();
  }, [chatId, session?.user.id, router]);

  const handleDeleteMessage = async (messageId) => {
    try {
      // Ensure you have the chatId available in this component's scope
      const firestore = getFirestore();
      const messageRef = doc(firestore, "chats", chatId, "messages", messageId);
      await deleteDoc(messageRef);
      toast({
        title: "Message Deleted",
        description: "Your message has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="pr-5 pl-5 pb-20 mt-3">
      {!loading && messages?.length === 0 && (
        <div className="flex flex-col justify-center text-center items-center p-10 rounded-xl space-y-2 text-black dark:text-white font-extralight">
          <MessageCircleIcon className="h-10 w-10" />
          <p className="font-bold mb-3">Kick off your global chats now!</p>
          <p>
            Invite a friend, message in any language, and let us seamlessly
            handle the translation.
          </p>
        </div>
      )}
      {messages?.map((message) => {
        const isSender = message.user.id === session?.user.id;
        const hasText = message.input && message.input.trim().length > 0;

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
                {hasText && !message.translated && <LoadingSpinnerWhite />}
                {isSender && (
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                    aria-label="Delete message"
                  >
                    {/* Replace this text with an icon if preferred */}
                    Delete
                  </button>
                )}
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
