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
import Image from "next/image";
import { generatePortalLink } from "@/actions/generatePortalLink";
import { useSubscriptionStore } from "@/store/store";

function Profile() {
  const { data: session } = useSession();

  const subscription = useSubscriptionStore((state) => state.subscription);

  console.log(subscription);

  console.log("this", session?.user.id);

  const [open, setOpen] = useState(false);

  console.log(session?.user.email);

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
        window.location.href = "/";
        // Then, navigate to the home page

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
    <div className="isolate overflow-hidden dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-10  flex flex-col items-center  text-center customminheight lg:px-8">
        <div className="mx-auto  flex flex-col items-center max-w-4xl">
          <h2 className="text-base font-semibold leading-7  text-[#EF9351]">
            Profile
          </h2>
          <div
            //   onClick={handleGoogleLogin}
            className="h-10 bg-white flex mt-6  items-center text-black border border-gray-300 min-w-[270px] rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <Image
              width={300}
              height={100}
              alt="google logo"
              src="/google.png"
              className="w-6 ml-2"
            />{" "}
            <p className="ml-7">{session?.user.email}</p>
          </div>
        </div>
        <div className="relative flex  space-y-4 w-full max-w-[272px] flex-col mt-6">
          {/* {subscription === undefined && (
           
          )} */}

          {subscription?.role === "pro" && (
            <form action={generatePortalLink}>
              <button
                type="submit"
                className="rounded-md bg-[#ef9351] px-3.5 py-2.5 text-sm w-full font-semibold text-white dark:text-white shadow-sm hover:bg-[#FE9D52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF9351]"
              >
                Manage Billing
              </button>
            </form>
          )}

          <Button variant="outline">Sign out</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="link">Delete Account</Button>
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
      </div>

      {/* <div className="flow-root bg-white pb-24 sm:pb-32">
      <div className="-mt-80">
        <PricingCards redirect={true} />
      </div>
    </div> */}
    </div>
  );
}

export default Profile;
