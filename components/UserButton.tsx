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
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "@/firebase";
import { toast } from "./ui/use-toast";
import { register } from "module";
import { useUser } from "./UserContext";
import { database } from "firebase-admin";
import EditProfile from "./EditProfile";

function UserButton({ session }: { session: Session | null }) {
  const { user, setUser } = useUser();

  console.log(user);
  // Subscription listener...
  const subscription = useSubscriptionStore((state) => state.subscription);

  const router = useRouter();

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: "http://polyglotter.app/verify",
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
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [emailForgot, setEmailForgot] = useState("");

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

  const openForgotPass = () => {
    setIsLoginDialogOpen(false);
    setIsForgotPassword(true);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(registerEmail);

    const auth = getAuth();

    console.log(registerEmail);
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
          emailVerified: false,
          image: "/useravatar.png",
          name: registerName,
          isGoogle: false,
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
                isGoogle: false,
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
        let errorMessage;
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "This email is already in use.";
            break;
          case "auth/missing-password":
            errorMessage = "Missing password. Please enter your password.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email. Please check your email address.";
            break;
          case "auth/invalid-credential":
            errorMessage = "Invalid credentials. Please try again.";
            break;
          default:
            errorMessage = "An error occurred. Please try again.";
        }
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
          duration: 2000,
        });
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
          // Handle the case where the user data does not exist in Firestore
          console.error("User data not found in Firestore");
        }
      })
      .catch((error) => {
        console.log(error);
        let errorMessage;
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "This email is already in use.";
            break;
          case "auth/missing-password":
            errorMessage = "Missing password. Please enter your password.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email. Please check your email address.";
            break;
          case "auth/invalid-credential":
            errorMessage = "Invalid credentials. Please try again.";
            break;
          default:
            errorMessage = "An error occurred. Please try again.";
        }
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
          duration: 2000,
        });
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

  const handleForgotPassword = (e: any) => {
    e.preventDefault(); // Prevent the default form submission
    console.log(emailForgot); // Log the email value from state
    if (emailForgot) {
      sendPasswordResetEmail(auth, emailForgot)
        .then(() => {
          console.log("Email has been sent!");
          toast({
            title: "Success",
            description:
              "We've sent a password reset email to the address provided, if it's associated with an account.",
            className: "bg-green-600 text-white",
            duration: 3000,
          });
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "There has been an error.",
            variant: "destructive",
            duration: 2000,
          });
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          // Handle error scenarios here, like showing an error message to the user
        });
    } else {
      console.log("Email is undefined or empty");
      // Handle the case where email is not provided
    }
  };

  const handleNameChange = (e: any) => {
    const regex = /^[a-zA-Z0-9._-]+$/;
    const name = e.target.value;
    if (name === "" || regex.test(name)) {
      setRegisterName(name);
    }
  };

  if (!session) {
    return (
      <>
        <Button variant={"outline"} onClick={openLoginDialog}>
          Sign in
        </Button>

        {/* Login Dialog */}
        <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
          <DialogContent>
            <p className="font-bold mt-3">Log in</p>
            <Button
              variant="outline"
              onClick={() =>
                signIn("google", { callbackUrl: window.location.href })
              }
              className=""
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
                <label htmlFor="email">E-mail</label>
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
                <Button type="submit" variant="default">
                  Log in
                </Button>
                <p>No account yet ?</p>
              </div>
            </form>
            <div className="w-full flex items-center justify-between">
              <div>
                <p
                  className="font-light cursor-pointer hover:text-gray-300"
                  onClick={openForgotPass}
                >
                  Forgot password?
                </p>
              </div>
              <div className="flex flex-col">
                <div
                  className="rounded-md cursor-pointer bg-[#ef9351] px-3.5 py-2.5 text-sm font-semibold text-white dark:text-white shadow-sm hover:bg-[#FE9D52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF9351]"
                  onClick={openRegisterDialog}
                >
                  Create account
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isForgotPassword} onOpenChange={setIsForgotPassword}>
          <DialogContent>
            <p className="font-bold mt-3">Forgot your password ?</p>

            <form
              onSubmit={(e) => handleForgotPassword(e)}
              className="space-y-8"
            >
              <div>
                <label htmlFor="email">Enter your e-mail</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={emailForgot}
                  className="mt-2"
                  onChange={(e) => setEmailForgot(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Button type="submit" variant="default">
                  Send
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
            <p className="font-bold mt-3">Create your account</p>
            <form onSubmit={handleRegister} className="space-y-8">
              <div>
                <label htmlFor="username">Display name</label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={registerName}
                  className="mt-2"
                  onChange={handleNameChange} // Updated to use handleNameChange
                  maxLength={20}
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
              <Button type="submit" variant="default">
                Register
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  console.log(session.user.image);

  return (
    session && (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar
            name={session.user?.name}
            // Replace session.user.image with user.image from context
            image={user?.image || session.user?.image}
            className="border"
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
            {/* <div onClick={openProfile}>Profile</div> */}
            <EditProfile />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/support")}
          >
            {/* <div onClick={openProfile}>Profile</div> */}
            Support
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
