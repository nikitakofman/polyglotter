"use client";

import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { signOut, useSession } from "next-auth/react";

function Profile() {
  const { data: session } = useSession();

  console.log("this", session?.user.id);

  const [open, setOpen] = useState(false);

  const router = useRouter();

  const handleDelete = async () => {
    if (!session?.user?.id) {
      console.error("User ID not found in session");
      return;
    }

    toast({
      title: "Deleting chat",
      description: "Please wait while we delete the chat...",
    });

    console.log("Deleting :", session?.user.id);

    try {
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session?.user.id }),
      });

      if (res.ok) {
        // First, sign out the user and wait for the process to complete
        await signOut({ redirect: false });

        // Then, navigate to the home page
        router.push(`/`);

        toast({
          title: "Success",
          description: "Your account has been deleted!",
          className: "bg-green-600 text-white",
          duration: 3000,
        });
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "There was an error deleting your account!",
        variant: "destructive",
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete Account</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will delete your account permanently.
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
    </div>
  );
}

export default Profile;
