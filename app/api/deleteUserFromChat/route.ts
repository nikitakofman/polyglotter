import { adminDb } from "@/firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {
  console.log(req.body);

  try {
    const { chatId, userId, adminId, memberId } = await req.json();

    console.log(chatId);
    console.log(memberId);
    console.log(userId);

    // Fetch the admin ID from the chat document to verify
    const chatDoc = await adminDb.collection("chats").doc(chatId).get();
    const chatData = chatDoc.data();

    // if (!chatData) {
    //   return res.status(404).json({ message: "Chat not found" });
    // }

    // Verify if the requester is the admin
    // if (chatData.admin !== adminId) {
    //   return res.status(403).json({ message: "Unauthorized request" });
    // }

    // Delete the user from the members collection
    await adminDb
      .collection("chats")
      .doc(chatId)
      .collection("members")
      .doc(userId || memberId)
      .delete();

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing user from chat:", error);
  }
}
