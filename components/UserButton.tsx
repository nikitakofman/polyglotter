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
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "@/firebase";

function UserButton({ session }: { session: Session | null }) {
  // Subscription listener...
  const subscription = useSubscriptionStore((state) => state.subscription);

  const router = useRouter();

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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        // Now add this user's information to Firestore
        const firestore = getFirestore();
        const userRef = doc(firestore, "users", user.uid);
        await setDoc(userRef, {
          email: user.email,
          emailVerified: null,
          image: "john",
          name: registerName,
          // Add other user information as needed
        }).then(() => {
          const auth = getAuth();
          signInWithEmailAndPassword(auth, registerEmail, registerPassword)
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              console.log("thisxxX", user.email);
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
          console.log(userData.name);
          // Now sign in with NextAuth
          signIn("credentials", {
            name: userData.name, // Extracted name from Firestore
            email: email,
            password: password,
            id: user.uid,
            callbackUrl: "/chat",
          });
        } else {
          // Handle the case where the user data does not exist in Firestore
          console.error("User data not found in Firestore");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Handle login errors here
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

  if (!session)
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"}>Sign in</Button>
        </DialogTrigger>
        <DialogContent>
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
            <div className="flex items-center justify-center">
              <Button type="submit" variant="outline">
                Log in
              </Button>
            </div>
          </form>

          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/chat" })}
          >
            <Image
              width={300}
              height={100}
              alt="google logo"
              src="/google.png"
              className="w-5 mr-2"
            />
            Connect with Google
          </Button>

          <p className="text-center">No account yet ?</p>

          <Dialog
            open={isRegisterDialogOpen}
            onOpenChange={setIsRegisterDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant={"outline"}>Register</Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleRegister} className="space-y-8">
                {/* Registration Fields */}
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
                  <label htmlFor="email">E-mail</label>
                  <Input
                    type="text"
                    id="email"
                    name="email"
                    value={registerEmail}
                    className="mt-2"
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={registerPassword}
                    className="mt-2"
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                </div>
                {/* Additional Fields as Needed */}
                <Button type="submit" variant="outline">
                  Register
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    );

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
