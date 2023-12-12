import { adminDb } from "@/firebase-admin";
import { NextResponse } from "next/server";

// MAKE A VERIFICATION THAT THE SENDER OF THE DELETE REQUEST IF ITS NOT THE SAME ID AS THE ADMIN WHO TRYING TO DELETE COLLECTION DO NOT DELETE

// MAKE A VERIFICATION THAT THE SENDER OF THE DELETE REQUEST IF ITS NOT THE SAME ID AS THE ADMIN WHO TRYING TO DELETE COLLECTION DO NOT DELETE

// MAKE A VERIFICATION THAT THE SENDER OF THE DELETE REQUEST IF ITS NOT THE SAME ID AS THE ADMIN WHO TRYING TO DELETE COLLECTION DO NOT DELETE

// MAKE A VERIFICATION THAT THE SENDER OF THE DELETE REQUEST IF ITS NOT THE SAME ID AS THE ADMIN WHO TRYING TO DELETE COLLECTION DO NOT DELETE

// MAKE A VERIFICATION THAT THE SENDER OF THE DELETE REQUEST IF ITS NOT THE SAME ID AS THE ADMIN WHO TRYING TO DELETE COLLECTION DO NOT DELETE

// MAKE A VERIFICATION THAT THE SENDER OF THE DELETE REQUEST IF ITS NOT THE SAME ID AS THE ADMIN WHO TRYING TO DELETE COLLECTION DO NOT DELETE

// MAKE A VERIFICATION THAT THE SENDER OF THE DELETE REQUEST IF ITS NOT THE SAME ID AS THE ADMIN WHO TRYING TO DELETE COLLECTION DO NOT DELETE

export async function DELETE(req: Request) {
  const { chatId } = await req.json();

  const ref = adminDb.collection("chats").doc(chatId);

  const bulkWriter = adminDb.bulkWriter();
  const MAX_RETRY_ATTEMPTS = 5;

  bulkWriter.onWriteError((error) => {
    if (error.failedAttempts < MAX_RETRY_ATTEMPTS) {
      return true;
    } else {
      console.log("Failed write at document: ", error.documentRef.path);
      return false;
    }
  });

  try {
    await adminDb.recursiveDelete(ref, bulkWriter);
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Promise rejected: ", error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}
