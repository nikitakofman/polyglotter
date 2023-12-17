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

const formSchema = z.object({
  input: z.string().max(1000),
});

function ChatInput({ chatId }: { chatId: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  const { toast } = useToast();

  const [isPickerVisible, setPickerVisible] = useState(false);

  const subscription = useSubscriptionStore((state) => state.subscription);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  function useOutsideClick(ref, callback) {
    useEffect(() => {
      function handleClickOutside(event) {
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const inputCopy = values.input.trim();
    form.reset();

    if (values.input.length === 0) {
      return;
    }

    if (!session?.user) {
      return;
    }

    const messages = (await getDocs(limitedMessagesRef(chatId))).docs.map(
      (doc) => doc.data()
    ).length;

    const isPro =
      subscription?.role === "pro" && subscription.status === "active";

    if (!isPro && messages >= 20) {
      toast({
        title: "Free plan limit exceeded",
        description:
          "You've exceeded the FREE plan limit of 20 messages per chat. Upgrade to PRO for unlimited chat messages!",
        variant: "destructive",
        action: (
          <ToastAction
            altText="Upgrade"
            onClick={() => router.push("/register")}
          >
            Upgrade to PRO
          </ToastAction>
        ),
      });

      return;
    }

    const userToStore: User = {
      id: session?.user.id!,
      name: session?.user.name!,
      email: session?.user.email!,
      image: session?.user.image || "",
    };

    addDoc(messagesRef(chatId), {
      input: inputCopy,
      timestamp: serverTimestamp(),
      user: userToStore,
    });
  }

  const pickerRef = useRef(null);

  useOutsideClick(pickerRef, () => {
    if (isPickerVisible) {
      setPickerVisible(false);
    }
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center space-x-2 p-2 rounded-t-xl mx-auto bg-white dark:bg-slate-800"
        >
          <button
            type="button"
            onClick={() => setPickerVisible(!isPickerVisible)}
          >
            <img src="/emoji.png" className="w-4 " />
          </button>

          {isPickerVisible && (
            <div ref={pickerRef} className="relative">
              <div className="absolute bottom-[-5px] left-[-50px] z-10 w-64 transform scale-[0.85]">
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) => {
                    const currentValue = form.getValues("input");
                    form.setValue("input", currentValue + emoji.native);
                    setPickerVisible(false);
                  }}
                />
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormItem className="flex-1">
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
