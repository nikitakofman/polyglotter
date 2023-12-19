"use client";

import { Copy } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { Dispatch, SetStateAction } from "react";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import Link from "next/link";

function ShareLink({
  isOpen,
  chatId,
  setIsOpen,
}: {
  isOpen: boolean;
  chatId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { toast } = useToast();

  const host = window.location.host;

  const linkToChat =
    process.env.NODE_ENV === "development"
      ? `http://${host}/chat/${chatId}`
      : `https://${host}/chat/${chatId}`;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(linkToChat);
      console.log("Text copied to clipboard");

      toast({
        title: "Copied Successfully",
        description:
          "Share this to the person you want to chat with! They must be added to the chat to access it.",
        className: "bg-green-600 text-white",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }
  return (
    <Dialog
      onOpenChange={(open) => setIsOpen(open)}
      open={isOpen}
      defaultOpen={isOpen}
    >
      <DialogTrigger asChild>
        <p className="text-black dark:text-white flex text-sm hover:text-gray-400 dark:hover:text-gray-300 cursor-pointer items-center">
          {" "}
          <Copy className="w-4 mr-2" />
          Share Link
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Any user who has been{" "}
            <span className="text-[#EF9351] font-bold">granted access</span> can
            use this link
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={linkToChat} readOnly />
          </div>
          <Button
            type="submit"
            onClick={() => copyToClipboard()}
            size="sm"
            className="px-3"
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
      {/* <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <p className="text-white">
            {" "}
            <Link href="/chat">Close</Link>
          </p>
        </DialogClose>
      </DialogFooter> */}
    </Dialog>
  );
}

export default ShareLink;
