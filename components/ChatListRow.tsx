"use client";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { Skeleton } from "./ui/skeleton";
import { Message, limitedSortedMessagesRef } from "@/lib/converters/Message";
import UserAvatar from "./UserAvatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/store/store";
import { useState, useEffect } from "react";
import { doc, getFirestore, getDoc, onSnapshot } from "firebase/firestore";

function ChatListRow({ chatId }: { chatId: string }) {
  const [messages, loading, error] = useCollectionData<Message>(
    limitedSortedMessagesRef(chatId)
  );
  const language = useLanguageStore((state) => state.language);

  const router = useRouter();

  const [userImages, setUserImages] = useState<{ [userId: string]: string }>(
    {}
  );
  const firestore = getFirestore();

  const { data: session } = useSession();

  const [userData, setUserData]: any = useState({});

  useEffect(() => {
    const firestore = getFirestore();
    const userListeners: any = {};

    messages?.forEach((message) => {
      const userId = message.user.id;
      if (!userListeners[userId]) {
        const userRef = doc(firestore, "users", userId);
        userListeners[userId] = onSnapshot(userRef, (doc) => {
          const data = doc.data();
          setUserData((prevData: any) => ({
            ...prevData,
            [userId]: { image: data?.image, name: data?.name },
          }));
        });
      }
    });

    // Cleanup
    return () => {
      Object.values(userListeners).forEach((unsubscribe: any) => unsubscribe());
    };
  }, [messages]);

  function prettyUUID(n = 4) {
    return chatId.substring(0, n);
  }

  console.log(session?.user.image);

  const row = (message?: Message) => {
    // Extract the user's updated info if available
    const userInfo = message && userData[message.user.id];
    const userName = userInfo?.name || message?.user.name || session?.user.name;
    const userImage = userInfo?.image || session?.user.image;

    return (
      <div
        key={chatId}
        onClick={() => router.push(`/chat/${chatId}`)}
        className="flex p-5 items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
      >
        <UserAvatar name={userName} image={userImage} className="" />
        <div className="flex-1">
          <p className="font-bold">
            {!message && "New Chat"}
            {message && userName.split(" ")[0]}
          </p>
          <p className="text-gray-400 line-clamp-1">
            {message?.translated?.[language] ||
              "Get the conversation started..."}
          </p>
        </div>
        <div className="text-xs text-gray-400 text-right">
          <p className="mb-auto">
            {message
              ? new Date(message.timestamp).toLocaleTimeString()
              : "No messages yet"}
          </p>
          <p className="">chat #{prettyUUID()}</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      {loading && (
        <div className="flex p-5 items-center space-x-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      )}

      {messages?.length === 0 && !loading && row()}

      {messages?.map((message) => row(message))}
    </div>
  );
}

export default ChatListRow;
