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

const createWaitlist = async (email: string): Promise<boolean> => {
  const d = doc(db, DB_NAME, email);
  const docSnap = await getDoc(d);
  if (docSnap.exists()) {
    await updateDoc(d, {
      isInvited: false,
      reInvite: true,
      reInvitedAt: serverTimestamp(),
    });
    return false;
  }
  await setDoc(d, { email, isInvited: false, invitedAt: serverTimestamp() });
  return true;
};
export { createWaitlist };
