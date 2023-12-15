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

              <Button variant="outline" className="" onClick={toggleMenu}>
                Chat settings
              </Button>
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
