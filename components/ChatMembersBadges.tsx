"use client";

import useAdminId from "@/hooks/useAdminId";
import { ChatMembers, chatMembersRef } from "@/lib/converters/ChatMembers";
import { useCollectionData } from "react-firebase-hooks/firestore";
import LoadingSpinner from "./LoadingSpinner";
import UserAvatar from "./UserAvatar";
import { Badge } from "./ui/badge";
import { useSession } from "next-auth/react";
import { BadgeMinus, Cross, Minus, MinusCircle } from "lucide-react";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";

function ChatMembersBadges({ chatId }: { chatId: string }) {
  const [members, loading, error] = useCollectionData<ChatMembers>(
    chatMembersRef(chatId)
  );

  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: session } = useSession();

  console.log(session?.user.id);

  const adminId = useAdminId({ chatId });

  console.log(adminId);

  // FIX ADMIN ID

  if (loading && !members) return <LoadingSpinner />;

  const removeMember = async (memberId: any) => {
    if (!memberId) return;

    console.log(memberId);
    try {
      const response = await fetch("/api/deleteUserFromChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, memberId }),
      });

      if (response.ok) {
        console.log("User successfully removed from chat");
      } else {
        console.error("Failed to remove user from chat");
      }
    } catch (error) {
      console.error("Error removing user from chat:", error);
    }
  };

  return (
    !loading && (
      <div className=" rounded-xl ">
        <div className="flex flex-wrap  md:justify-start items-center gap-2 p-2">
          {members?.map((member) => (
            <Badge
              variant="outline"
              key={member.email}
              className="h-14 p-5 pl-2 pr-5 flex space-x-2"
            >
              <div className="flex items-center space-x-2">
                <UserAvatar
                  name={member.email}
                  image={member.image}
                  className=""
                />
              </div>
              <div>
                <p>{member.name}</p>
                {member.userId === adminId && (
                  <p className="text-[#EF9351] animate-pulse">Admin</p>
                )}
              </div>
              {session?.user.id === adminId && member.userId !== adminId && (
                <div>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <MinusCircle className="cursor-pointer w-3.5 ml-1 text-red-400 hover:text-red-300" />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This will remove {member.name} from the chat.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid grid-cols-2 space-x-2">
                        <Button
                          variant="default"
                          onClick={() => removeMember(member.userId)}
                        >
                          Remove
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </Badge>
          ))}
        </div>
      </div>
    )
  );
}

export default ChatMembersBadges;
