import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.service";

const DB_NAME = "waitlists";

const createWaitlist = async (email: string) => {
  const d = doc(db, DB_NAME, email);
  const docSnap = await getDoc(d);
  if (docSnap.exists()) {
    await updateDoc(d, {
      email,
      isInvited: false,
      invitedAt: serverTimestamp(),
      reInvite: true,
    });
    return;
  }
  await setDoc(d, { email, isInvited: false, invitedAt: serverTimestamp() });
};
export { createWaitlist };
