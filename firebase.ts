import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBwTxEz3smjzo4VKQa4U0AeHA-4MldCxeg",
  authDomain: "polyglotter-6ef1c.firebaseapp.com",
  projectId: "polyglotter-6ef1c",
  storageBucket: "polyglotter-6ef1c.appspot.com",
  messagingSenderId: "372956549923",
  appId: "1:372956549923:web:8ce678e8fefb70fe66f296",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { db, auth, functions, app };
