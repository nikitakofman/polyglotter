"use client";

import { useSession } from "next-auth/react";
import { Form, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import {
  User,
  limitedMessagesRef,
  messagesRef,
} from "@/lib/converters/Message";
import { useRouter } from "next/navigation";
import { useSubscriptionStore } from "@/store/store";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useEffect, useRef, useState } from "react";
import { MdEmojiEmotions } from "react-icons/md";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { Image, ImageOff, MinusCircle, X } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const formSchema = z.object({
  input: z.string().max(1000),
});

function ChatInput({ chatId }: { chatId: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [imagePreviewURL, setImagePreviewURL] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const storage = getStorage();

  const { toast } = useToast();

  const [isPickerVisible, setPickerVisible] = useState(false);

  const [imageURL, setImageURL] = useState(null);

  const subscription = useSubscriptionStore((state) => state.subscription);

  console.log(subscription);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });
  //@ts-ignore
  function useOutsideClick(ref, callback) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, callback]);
  }

  console.log(imageURL);

  const isPro =
    subscription?.role === "pro" && subscription.status === "active";

  console.log(isPro);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const inputCopy = values.input.trim();
    form.reset();

    if (!inputCopy && !selectedFile) {
      return;
    }

    if (!session?.user) {
      return;
    }

    const messagesCount = (await getDocs(limitedMessagesRef(chatId))).docs
      .length;
    const isPro =
      subscription?.role === "pro" && subscription.status === "active";

    // if (!isPro && messagesCount >= 20) {
    //   toast({
    //     title: "Free plan limit exceeded",
    //     description:
    //       "You've exceeded the FREE plan limit of 20 messages per chat. Upgrade to PRO for unlimited chat messages!",
    //     variant: "destructive",
    //     action: (
    //       <ToastAction
    //         altText="Upgrade"
    //         onClick={() => router.push("/register")}
    //       >
    //         Upgrade to PRO
    //       </ToastAction>
    //     ),
    //   });
    //   return;
    // }

    const userToStore = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image || "",
    };

    // Handling image upload if a file is selected
    if (selectedFile) {
      const storageRef = ref(
        storage,
        //@ts-ignore
        `chat_images/${chatId}/${Date.now()}_${selectedFile.name}`
      );

      uploadBytes(storageRef, selectedFile)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              // Create a new message with the image URL

              type WithImage = {
                input: string;
                timestamp: any;
                user: {};
                imageUrl: string;
              };

              const newMessageWithImage: WithImage = {
                input: inputCopy,
                timestamp: serverTimestamp(),
                user: userToStore,
                imageUrl: downloadURL,
              };

              // Send the message with the image
              addDoc(messagesRef(chatId), newMessageWithImage)
                .then(() => {
                  // Handle successful message sending
                })
                .catch((error) => {
                  console.error("Error sending message with image: ", error);
                  // Handle the error
                });
            })
            .catch((error) => {
              console.error("Error getting download URL: ", error);
              // Handle the error
            });
        })
        .catch((error) => {
          console.error("Error uploading file: ", error);
          // Handle the error
        });
    } else {
      // Handling text-only message sending
      const newMessageWithoutImage: any = {
        input: inputCopy,
        timestamp: serverTimestamp(),
        user: userToStore,
        imageUrl: "undefined",
      };

      addDoc(messagesRef(chatId), newMessageWithoutImage)
        .then(() => {
          // Handle successful message sending
        })
        .catch((error) => {
          console.error("Error sending text-only message: ", error);
          // Handle the error
        });
    }

    // Resetting the states
    setSelectedFile(null);
    setImagePreviewURL(null);
  }

  const pickerRef = useRef(null);

  useOutsideClick(pickerRef, () => {
    if (isPickerVisible) {
      setPickerVisible(false);
    }
  });

  const fileInputRef: any = useRef(null);

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      // Create a local URL for preview
      const localPreviewURL: any = URL.createObjectURL(file);
      setImagePreviewURL(localPreviewURL);
      setSelectedFile(file); // Store the file object
    } else {
      console.error("No file selected.");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="ml-3 mb-3 flex flex-col relative">
        {imagePreviewURL && (
          <div>
            <button
              onClick={() => {
                setImagePreviewURL(null);
                {
                  /*@ts-ignore*/
                }
                fileInputRef.current.value = null; // Reset file input
              }}
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                zIndex: 10,
              }}
              className="bg-black/50 w-[75px] "
            >
              <p className="text-[13px] text-gray-300 hover:text-white">
                Remove
              </p>
            </button>
            <img
              src={imagePreviewURL}
              alt="Preview"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
              className=""
            />
          </div>
        )}
      </div>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center  p-2 rounded-t-xl mx-auto bg-white dark:bg-slate-800"
        >
          <button
            type="button"
            onClick={() => setPickerVisible(!isPickerVisible)}
          >
            <img src="/emoji.png" className="w-4 ml-1 mr-2" />
          </button>
          {/* <button type="button" onClick={() => fileInputRef.current.click()}>
            Upload Image
          </button> */}
          {isPickerVisible && (
            <div ref={pickerRef} className="relative">
              <div className="absolute bottom-[-5px] left-[-50px] z-10 w-64 transform scale-[0.85]">
                <Picker
                  data={data}
                  onEmojiSelect={(emoji: any) => {
                    const currentValue = form.getValues("input");
                    form.setValue("input", currentValue + emoji.native);
                    setPickerVisible(false);
                  }}
                />
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            ref={fileInputRef}
          />
          {/*@ts-ignore*/}
          {isPro ? (
            <Image
              className="cursor-pointer hover:text-gray-400 mr-2"
              onClick={() => fileInputRef.current.click()}
            />
          ) : (
            <HoverCard>
              <HoverCardTrigger asChild>
                <ImageOff className="mr-2 text-gray-500 cursor-not-allowed" />
              </HoverCardTrigger>
              <HoverCardContent className="w-full">
                <Button
                  variant="secondary"
                  className=""
                  onClick={() => router.push("/register")}
                >
                  Upgrade to <p className="text-[#EF9352] mx-1">PRO</p> to send
                  media
                </Button>
              </HoverCardContent>
            </HoverCard>
          )}

          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormItem className="flex-1 mr-2">
                <FormControl>
                  <Input
                    className="border-2 dark:border-slate-600 bg-white dark:bg-slate-800 text-[16px] dark:placeholder:text-white/70"
                    placeholder="Enter a message in ANY language..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-[#EF9351] text-white">
            Send
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

export default ChatInput;
