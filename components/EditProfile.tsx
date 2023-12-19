import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { generatePortalLink } from "@/actions/generatePortalLink";
import { useSubscriptionStore } from "@/store/store";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { PictureInPicture, Upload } from "lucide-react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@/components/UserContext";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;

function EditProfile() {
  const [open, setOpen] = useState(false);

  const handleSheetTriggerClick = (e: any) => {
    e.stopPropagation(); // Prevent the dropdown menu from closing
    setOpenSheet(true); // Open the sheet
  };

  const { data: session } = useSession();

  console.log("AAAAH", session);

  const subscription = useSubscriptionStore((state) => state.subscription);

  const [openSheet, setOpenSheet] = useState(false);

  const [openPass, setOpenPass] = useState(false);

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        const firestore = getFirestore();
        const userRef = doc(firestore, "users", session.user.id);

        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            console.log("User data:", docSnap.data());
            //@ts-ignore
            setUserData(docSnap.data());
          } else {
            console.log("No such user!");
          }
        } catch (error) {
          console.error("Error getting user data:", error);
        }
      }
    };

    console.log(userData);

    fetchUserData();
  }, [session]);

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

  const inputRef = useRef(null);

  const { setUser } = useUser();

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const storage = getStorage();
    const storageRef = ref(storage, "profile_pictures/" + session?.user.id);

    console.log(storageRef);

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          // Update user's profile in Firestore with downloadURL
          //@ts-ignore
          const userRef = doc(getFirestore(), "users", session.user.id);
          setDoc(userRef, { image: downloadURL }, { merge: true });
          console.log("Profile picture updated!");

          setUserData({ ...userData, image: downloadURL });

          const newUser: any = { ...session?.user, image: downloadURL };
          setUser(newUser);
          toast({
            title: "Success",
            description: "Your profile picture has been updated!",
            className: "bg-green-600 text-white",
            duration: 3000,
          });
        });
      })
      .catch((error) => {
        console.error("Upload failed:", error);
      });

    console.log(file);
  };
  const sendEmailReset = () => {
    const auth = getAuth();
    //@ts-ignore
    sendPasswordResetEmail(auth, session?.user.email)
      .then(() => {
        console.log("password reset email sent");
        toast({
          title: "Success",
          description: `Password reset e-mail sent to ${session?.user.email}.`,
          className: "bg-green-600 text-white",
          duration: 2000,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  const deletePhoto = async () => {
    if (!session?.user?.id) {
      console.error("User ID not found in session");
      return;
    }

    const defaultPhotoUrl = "/useravatar.png"; // URL of your default photo
    const userRef = doc(getFirestore(), "users", session.user.id);

    try {
      // Update the user's profile in Firestore
      await setDoc(userRef, { image: defaultPhotoUrl }, { merge: true });
      console.log("Profile picture removed!");

      // Update local state and session
      setUserData({ ...userData, image: defaultPhotoUrl });
      const newUser = { ...session.user, image: defaultPhotoUrl };
      //@ts-ignore
      setUser(newUser); // Update UserContext if you're using one

      toast({
        title: "Success",
        description: "Your profile picture has been removed!",
        className: "bg-green-600 text-white",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to remove profile picture:", error);
      toast({
        title: "Error",
        description: "There was an error removing your profile picture!",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={openSheet}>
      <SheetTrigger asChild>
        <div onClick={handleSheetTriggerClick}>Profile</div>
      </SheetTrigger>
      <SheetContent side="left" onClick={(e) => e.stopPropagation()}>
        <div className="isolate overflow-hidden dark:bg-gray-900">
          <div className="mx-auto max-w-7xl pt-10 pb-10 flex items-center justify-center flex-col">
            <div className="mx-auto flex items-center justify-center flex-col max-w-4xl">
              <h2 className="text-base mb-3 font-semibold leading-7  text-[#EF9351]">
                Profile
              </h2>
              <p className="font-bold mb-2">{session?.user.name}</p>
              <p className="font-bold text-xs mb-3">{session?.user.email}</p>
              <div className=" mt-3 mb-3">
                <div className="border-2  rounded-xl p-2 mb-2 flex flex-col items-center">
                  <p className="mt-2 font-semibold text-xs ">Profile picture</p>
                  <Image
                    width={200}
                    height={100}
                    alt="Profile pic"
                    className="w-28 h-28 mb-3 mt-3 object-cover border bg-white  rounded-full"
                    //@ts-ignore
                    src={userData?.image}
                  />

                  <input
                    type="file"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    ref={inputRef}
                  />
                  <div className="flex">
                    <Button
                      variant="ghost"
                      className=" rounded-lgs"
                      //@ts-ignore
                      onClick={() => inputRef.current.click()}
                    >
                      Replace
                    </Button>
                    <Button
                      variant="ghost"
                      className=" rounded-lg "
                      //@ts-ignore
                      onClick={() => deletePhoto()}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                {/* @ts-ignore */}
                {session?.user.provider && (
                  <Dialog open={openPass} onOpenChange={setOpenPass}>
                    <DialogTrigger asChild>
                      <Button variant="default" className="mt-3">
                        Reset your password
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Confirm password reset</DialogTitle>
                        <DialogDescription>
                          This will send an email to {session?.user.email} with
                          a link to reset your password.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid grid-cols-2 space-x-2">
                        <Button variant="default" onClick={sendEmailReset}>
                          Send
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setOpenPass(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            <div className="relative flex  space-y-4 w-full max-w-[272px] flex-col mt-3">
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
        {/* <SheetClose asChild>
          <div className="flex items-center justify-center ">
            <Button onClick={() => setOpenSheet(false)}>Close</Button>
          </div>
        </SheetClose> */}
      </SheetContent>
    </Sheet>
  );
}

export default EditProfile;
