"use client";

import { useEffect, useState, useRef } from "react";
import DeleteChatButton from "./DeleteChatButton";
import InviteUser from "./InviteUser";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import ChatMembersBadges from "./ChatMembersBadges";
import useAdminId from "@/hooks/useAdminId";
import { useSession } from "next-auth/react";
import { adminDb } from "@/firebase-admin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

function AdminControls({ chatId }: { chatId: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Create a ref for the menu
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const adminId = useAdminId({ chatId });
  const { data: session } = useSession();

  console.log(adminId);

  console.log(adminId === session?.user.id);

  console.log(chatId);

  const removeUserFromChat = async () => {
    const userId = session?.user.id;

    console.log(userId);
    if (!userId) return;

    try {
      const response = await fetch("/api/deleteUserFromChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId, userId }),
      });

      if (response.ok) {
        console.log("User successfully removed from chat");
        router.push("/chat");
      } else {
        console.error("Failed to remove user from chat");
      }
    } catch (error) {
      console.error("Error removing user from chat:", error);
    }
  };

  // Close the menu when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: any) {
      //@ts-ignore
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const router = useRouter();

  const closeChat = () => {
    router.push("/chat");
  };

  return (
    <>
      <div className="flex justify-end space-x-2 ml-3 mr-3 mt-2 mb-0">
        <div className=" flex items-center flex-col sm:flex-row w-full justify-between">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full">
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center">
                <X
                  className=" text-black dark:text-white sm:mr-3  hover:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
                  onClick={() => closeChat()}
                />
                <div className="hidden sm:flex">
                  <ChatMembersBadges chatId={chatId} />
                </div>
              </div>
              {adminId === session?.user.id ? (
                <Button variant="outline" className="" onClick={toggleMenu}>
                  Chat settings
                </Button>
              ) : (
                <>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="">
                        Leave chat
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This will remove you from the chat.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid grid-cols-2 space-x-2">
                        <Button variant="default" onClick={removeUserFromChat}>
                          Leave
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
                </>
              )}
            </div>
            {/* <X
              className=" text-black dark:text-white sm:mr-2 ml-3 hidden sm:flex  hover:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
              onClick={() => closeChat()}
            /> */}
            <div className="flex sm:hidden">
              <ChatMembersBadges chatId={chatId} />
            </div>
          </div>
        </div>
        <div
          ref={menuRef} // Attach the ref to the menu div
          className={`absolute mt-12  sm:top-[80px] z-20 space-y-2 p-3 w-44 bg-white border dark:bg-[#020817] flex flex-col items-start rounded-md shadow-xl transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{ pointerEvents: isMenuOpen ? "auto" : "none" }}
        >
          <InviteUser chatId={chatId} />
          <DeleteChatButton chatId={chatId} />
        </div>
      </div>
    </>
  );
}

export default AdminControls;
