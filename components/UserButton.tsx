"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { Session } from "next-auth";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useSubscriptionStore } from "@/store/store";
import LoadingSpinner from "./LoadingSpinner";
import { StarIcon } from "lucide-react";
import ManageAccountButton from "./ManageAccountButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import Image from "next/image";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "@/firebase";
import { toast } from "./ui/use-toast";

function UserButton({ session }: { session: Session | null }) {
  // Subscription listener...
  const subscription = useSubscriptionStore((state) => state.subscription);

  const router = useRouter();

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: "http://localhost:3000/verify",
    // This must be true.
    handleCodeInApp: true,
  };

  const signOutRe = async () => {
    await signOut().then(() => {
      window.location.reload();
      window.location.href = "/";
    });
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  // Function to open login dialog
  const openLoginDialog = () => {
    setIsLoginDialogOpen(true);
    setIsRegisterDialogOpen(false); // Close register dialog if open
  };

  // Function to open register dialog
  const openRegisterDialog = () => {
    setIsLoginDialogOpen(false); // Close login dialog if open
    setIsRegisterDialogOpen(true);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;

        // Now add this user's information to Firestore
        const firestore = getFirestore();
        const userRef = doc(firestore, "users", user.uid);
        await setDoc(userRef, {
          email: user.email,
          emailVerified: false,
          image: "/useravatar.png",
          name: registerName,
        }).then(() => {
          const auth = getAuth();

          sendSignInLinkToEmail(auth, registerEmail, actionCodeSettings);

          signInWithEmailAndPassword(auth, registerEmail, registerPassword)
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;

              signIn("credentials", {
                name: registerName,
                email: registerEmail,
                password: registerPassword,
                id: user.uid,
                callbackUrl: "/chat",
              });
            })
            .then(() => {})
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
            });
        });
      })
      .catch((error) => {
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Full error:", error);
      });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;

        // Fetch user details from Firestore
        const firestore = getFirestore();
        const userRef = doc(firestore, "users", user.uid);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          // Now sign in with NextAuth
          signIn("credentials", {
            name: userData.name, // Extracted name from Firestore
            email: email,
            password: password,
            id: user.uid,
            callbackUrl: "/chat",
          });
        } else {
          toast({
            title: "Error",
            description: "Invalid e-mail or password.",
            variant: "destructive",
            duration: 2000,
          });
          // Handle the case where the user data does not exist in Firestore
          console.error("User data not found in Firestore");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  // if (!session)
  // return (
  //   <Button
  //     variant={"outline"}
  //     onClick={() => signIn("google", { callbackUrl: "/chat" })}
  //   >
  //     Sign in
  //   </Button>
  // );

  if (!session) {
    return (
      <>
        <Button variant={"outline"} onClick={openLoginDialog}>
          Sign in
        </Button>

        {/* Login Dialog */}
        <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
          <DialogContent>
            <Button
              variant="outline"
              onClick={() => signIn("google", { callbackUrl: "/chat" })}
              className="mt-8"
            >
              <Image
                width={300}
                height={100}
                alt="google logo"
                src="/google.png"
                className="w-5 mr-2"
              />
              Continue with Google
            </Button>
            <div className="flex w-full mt-3 mb-3 items-center justify-center">
              <div className="flex-grow h-px bg-gray-500"></div>
              <p className="mx-2 text-sm text-gray-600 ml-5 mr-5 dark:text-white">
                or
              </p>
              <div className="flex-grow h-px bg-gray-500"></div>
            </div>
            <form onSubmit={handleLogin} className="space-y-8">
              <div>
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                  className="mt-2"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  className="mt-2"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Button type="submit" variant="outline">
                  Log in
                </Button>
                <Button variant={"outline"} onClick={openRegisterDialog}>
                  Register
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Registration Dialog */}
        <Dialog
          open={isRegisterDialogOpen}
          onOpenChange={setIsRegisterDialogOpen}
        >
          <DialogContent>
            <form onSubmit={handleRegister} className="space-y-8">
              <div>
                <label htmlFor="username">Name</label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={registerName}
                  className="mt-2"
                  onChange={(e) => setRegisterName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="registerEmail">E-mail</label>
                <Input
                  type="text"
                  id="registerEmail"
                  name="registerEmail"
                  value={registerEmail}
                  className="mt-2"
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="registerPassword">Password</label>
                <Input
                  type="password"
                  id="registerPassword"
                  name="registerPassword"
                  value={registerPassword}
                  className="mt-2"
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
              <Button type="submit" variant="outline">
                Register
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    session && (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar
            name={session.user?.name}
            image={session.user?.image}
            className=""
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {subscription === undefined && (
            <DropdownMenuItem>
              <LoadingSpinner />
            </DropdownMenuItem>
          )}

          {subscription?.role === "pro" && (
            <>
              <DropdownMenuLabel className="text-xs flex items-center justify-center space-x-1 text-[#EF9351] animate-pulse">
                <StarIcon fill="#EF9351" />
                <p>PRO</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <ManageAccountButton />
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem className="cursor-pointer">
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => signOutRe()}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}

export default UserButton;
