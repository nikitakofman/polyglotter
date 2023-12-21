"use client";

import { Message, sortedMessagesRef } from "@/lib/converters/Message";
import { useLanguageStore } from "@/store/store";
import {
  Cog,
  MessageCircleIcon,
  Pencil,
  PencilLine,
  Settings,
  Settings2,
} from "lucide-react";
import { Session } from "next-auth";
import { createRef, useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import UserAvatar from "./UserAvatar";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";
import { chatMembersRef } from "@/lib/converters/ChatMembers";
import { deleteDoc, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { toast } from "./ui/use-toast";
import LoadingSpinnerWhite from "./LoadingSpinnerWhite";
import { updateDoc } from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

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
  const [messages, loading, error]: any = useCollectionData<Message>(
    sortedMessagesRef(chatId),
    { initialValue: initialMessages }
  );
  const router = useRouter();

  const [userAvatars, setUserAvatars] = useState({});

  const [updatedMessages, setUpdatedMessages] = useState([]);

  useEffect(() => {
    setUpdatedMessages(messages); // Initialize updatedMessages with the fetched messages
  }, [messages]);

  useEffect(() => {
    const firestore = getFirestore();
    const userListeners: any = {};

    updatedMessages?.forEach((message: any) => {
      const userId = message.user.id;
      if (!userListeners[userId]) {
        const userRef = doc(firestore, "users", userId);
        userListeners[userId] = onSnapshot(userRef, (doc) => {
          const userData = doc.data();

          // Update userAvatars state
          setUserAvatars((prevAvatars) => ({
            ...prevAvatars,
            [userId]: userData?.image, // Assuming 'image' is the field where avatar URL is stored
          }));

          // Optionally update message user names (if they are also meant to be dynamic)
          setUpdatedMessages((prevMessages: any) =>
            prevMessages.map((msg: any) =>
              msg.user.id === userId
                ? { ...msg, user: { ...msg.user, name: userData?.name } }
                : msg
            )
          );
        });
      }
    });

    // Cleanup
    return () => {
      Object.values(userListeners).forEach((unsubscribe: any) => unsubscribe());
    };
  }, [updatedMessages]);

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const handleEditMessage = (message: any) => {
    setEditingMessageId(message.id);
    setEditingContent(message.input);
  };

  const handleSaveEditedMessage = async () => {
    if (!editingMessageId || !editingContent.trim()) return;

    try {
      const firestore = getFirestore();
      const messageRef = doc(
        firestore,
        "chats",
        chatId,
        "messages",
        editingMessageId
      );
      await updateDoc(messageRef, {
        input: editingContent,
        // Add any other fields that need to be updated, e.g., updatedAt timestamp
      });
      setEditingMessageId(null);
      setEditingContent("");
      toast({
        title: "Message Updated",
        description: "Your message has been successfully updated.",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const prevMessagesLength = useRef(messages?.length);

  useEffect(() => {
    //@ts-ignore
    if (messages?.length > prevMessagesLength.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesLength.current = messages?.length;
  }, [messages, messagesEndRef]);

  useEffect(() => {
    const membersRef = chatMembersRef(chatId);
    const unsubscribe = onSnapshot(membersRef, (snapshot) => {
      const isMember = snapshot.docs.some(
        (doc) => doc.data().userId === session?.user.id
      );
      if (!isMember) {
        // toast({
        //   title: "Admin removed you",
        //   description: "You have been removed from this chat",
        //   duration: 2000,
        // });
        router.push("/chat");
      }
    });

    return () => unsubscribe();
  }, [chatId, session?.user.id, router]);

  const handleDeleteMessage = async (messageId: any) => {
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
          <p className="font-bold mb-3">Kick off the conversation now!</p>
        </div>
      )}
      {updatedMessages?.map((message: any) => {
        const isSender = message.user.id === session?.user.id;
        const hasText = message.input && message.input.trim().length > 0;
        const isEditing = editingMessageId === message.id;
        //@ts-ignore
        const userAvatar = userAvatars[message.user.id] || message.user.image;

        return (
          <div key={message.id} className="flex my-2 items-end">
            <div
              className={`flex flex-col relative space-y-2 p-4 w-fit mx-2 rounded-lg ${
                isSender
                  ? "ml-auto border border-[#EF9351]/30 text-black dark:text-white rounded-br-none"
                  : "bg-gray-100 dark:bg-slate-700 dark:text-gray-100 rounded-bl-none"
              }`}
            >
              <div className="flex justify-between items-center">
                <p
                  className={`text-xs italic font-extralight ${
                    isSender ? "text-right" : "text-left"
                  }`}
                >
                  {message.user.name.split(" ")[0]}
                </p>
                {isSender && !isEditing && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button aria-label="Options">
                        <Pencil className="w-3 ml-1 text-gray-500 dark:text-white hover:text-gray-700 dark:hover:text-gray-300" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onSelect={() => handleEditMessage(message)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleDeleteMessage(message.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              {message.imageUrl &&
                message.imageUrl !== "undefined" &&
                !isEditing && (
                  <img
                    src={message.imageUrl}
                    alt="Uploaded"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                    className="object-cover"
                  />
                )}
              {!isEditing && (
                <div className="flex items-center space-x-2">
                  <pre className="break-all whitespace-pre-wrap font-sans text-base">
                    {message.translated?.[language] || message.input}
                  </pre>
                  {hasText && !message.translated && <LoadingSpinnerWhite />}
                </div>
              )}
              {isEditing && (
                <div>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="border bg-transparent dark:border-white/50 border-gray-300 pl-3 pr-3 pt-2 pb-2 rounded"
                  />
                  <div className="flex justify-between mt-2 items-center">
                    <Button
                      onClick={handleSaveEditedMessage}
                      variant="secondary"
                      className=""
                      aria-label="Save edited message"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingMessageId(null)}
                      variant="ghost"
                      className=""
                      aria-label="Cancel editing"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <UserAvatar
              name={message.user.name}
              image={userAvatar}
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
