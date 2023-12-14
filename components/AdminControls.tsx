"use client";

import { useEffect, useState, useRef } from "react";
import DeleteChatButton from "./DeleteChatButton";
import InviteUser from "./InviteUser";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import ChatMembersBadges from "./ChatMembersBadges";

function AdminControls({ chatId }: { chatId: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Create a ref for the menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
      <div className="flex justify-end space-x-2 ml-5 mr-5 mt-3 mb-0">
        <div className=" flex items-center flex-col sm:flex-row w-full justify-between">
          <div className="flex flex-col sm:flex-row items-center">
            <X
              className=" text-black dark:text-white sm:mr-3  hover:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
              onClick={() => closeChat()}
            />
            <Button
              variant="outline"
              className="mt-2 sm:mt-0"
              onClick={toggleMenu}
            >
              Chat settings
            </Button>
            <ChatMembersBadges chatId={chatId} />
          </div>
        </div>
        <div
          ref={menuRef} // Attach the ref to the menu div
          className={`absolute mt-12 left-1  z-50 space-y-2 p-3 w-44 bg-white border dark:bg-[#020817] flex flex-col items-start rounded-md shadow-xl transition-opacity duration-300 ${
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
