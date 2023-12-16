"use client";

import { useState } from "react"; // 4.1k (gzipped: 1.8k)
import { Button } from "./ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useToast } from "./ui/use-toast";
import { useSession } from "next-auth/react"; // 35.4k (gzipped: 10k)
import { useRouter } from "next/navigation"; // 11.5k (gzipped: 2.8k)
import useAdminId from "@/hooks/useAdminId";
import { Trash2 } from "lucide-react";

function DeleteChatButton({ chatId }: { chatId: string }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const adminId = useAdminId({ chatId });

  const handleDelete = async () => {
    toast({
      title: "Deleting chat",
      description: "Please wait while we delete the chat...",
    });

    console.log("Deleting :", chatId);

    await fetch("/api/chat/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId: chatId }),
    })
      .then((res) => {
        toast({
          title: "Success",
          description: "Your chat has been deleted!",
          className: "bg-green-600 text-white",
          duration: 3000,
        });
        router.replace(`/chat`);
      })
      .catch((err) => {
        console.error(err.message);
        toast({
          title: "Error",
          description: "There was an error deleting your chat!",
          variant: "destructive",
        });
      })
      .finally(() => setOpen(false));
  };

  return (
    session?.user.id === adminId && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <p className="text-red-400 flex text-sm items-center cursor-pointer hover:text-red-300   w-full">
            <Trash2 className="w-4 mr-2" />
            Delete Chat
          </p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will delete the chat for all users.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 space-x-2">
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}

export default DeleteChatButton;
