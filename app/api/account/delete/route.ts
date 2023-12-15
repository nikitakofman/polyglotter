import { getAuth } from "firebase-admin/auth";
import { adminDb } from "@/firebase-admin";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();

    // Delete the user from Firebase Authentication
    await getAuth().deleteUser(userId);

    // Reference to the user's document in Firestore
    const userRef = adminDb.collection("users").doc(userId);

    // Initialize bulk writer for batch operations in Firestore
    const bulkWriter = adminDb.bulkWriter();

    bulkWriter.onWriteError((error) => {
      console.error("Failed write at document: ", error.documentRef.path);
      return false; // Do not retry the write if there's an error
    });

    // Delete user's document and potentially any subcollections
    await adminDb.recursiveDelete(userRef, bulkWriter);

    // Await the bulk writer to finish all its operations
    await bulkWriter.close();

    console.log("Successfully deleted user data from Firestore");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
