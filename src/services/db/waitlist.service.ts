import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase.service";

const DB_NAME = "waitlists";

const createWaitlist = async (email: string): Promise<boolean> => {
  const d = doc(db, DB_NAME, email);
  const docSnap = await getDoc(d);
  if (docSnap.exists()) {
    // await updateDoc(d, {
    //   reInvite: true,
    //   reInvitedAt: serverTimestamp(),
    // });
    return false;
  }
  // Waitlist created in the server
  // await setDoc(d, { email, isInvited: false, invitedAt: serverTimestamp() });
  return true;
};

const updateUserSignUpOnWaitlistDoc = async (email: string) => {
  const d = doc(db, DB_NAME, email);
  const docSnap = await getDoc(d);
  if (docSnap.exists()) {
    await updateDoc(d, { signUp: true, signUpAt: serverTimestamp() });
  }
};

export { createWaitlist, updateUserSignUpOnWaitlistDoc };
