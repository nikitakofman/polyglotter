import { authOptions } from "@/auth";
import ChatList from "@/components/ChatList";
import ChatPermissionError from "@/components/ChatPermissionError";
import ResendEmail from "@/components/ResendEmail";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { getServerSession } from "next-auth";

type Props = {
  params: {};
  searchParams: {
    error: string;
  };
};

async function ChatsPage({ searchParams: { error } }: Props) {
  const session = await getServerSession(authOptions);
  //@ts-ignore
  console.log(session?.user.emailVerified);

  return (
    <div>
      {error && (
        <div className="m-2">
          <ChatPermissionError />
        </div>
      )}
      {/*@ts-ignore*/}
      {session?.user.emailVerified ? (
        <ChatList />
      ) : (
        <div className="w-screen h-screen flex flex-col mt-10 p-10 text-center">
          Please verify your e-mail. We have sent an activation link to:
          <p className="font-bold mt-5 mb-5">{session?.user.email}</p>
          <ResendEmail />
        </div>
      )}
    </div>
  );
}

export default ChatsPage;
