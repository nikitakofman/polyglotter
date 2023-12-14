import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, getFirestore } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

console.log("hello");

export default async function register(
  req: NextApiRequest,
  //@ts-ignore
  res: NextApiResponse
) {
  console.log(req.body);
  const { email, password } = req.body;

  console.log(email);

  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // User is created in Firebase Authentication
    const user = userCredential.user;

    // Now add this user's information to Firestore
    const firestore = getFirestore();
    const userRef = doc(firestore, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      // Add any other user information you want to store in Firestore
    });

    // Here you would also start a NextAuth session for the user
    // You can use the NextAuth signIn function with the credentials provider for this

    // Respond with success
    res.status(200).json({ message: "Registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
