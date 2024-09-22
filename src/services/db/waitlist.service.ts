import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.service";

const DB_NAME = "waitlists";

const waitlistExists = async (email: string): Promise<boolean> => {
  const d = doc(db, DB_NAME, email);
  const docSnap = await getDoc(d);
  return docSnap.exists();
  // if (docSnap.exists()) {
  //   // await updateDoc(d, {
  //   //   reInvite: true,
  //   //   reInvitedAt: serverTimestamp(),
  //   // });
  //   return true;
  // }
  // // Waitlist created in the server
  // // await setDoc(d, { email, isInvited: false, invitedAt: serverTimestamp() });
  // return false;
};

const updateUserSignUpOnWaitlistDoc = async (email: string) => {
  const d = doc(db, DB_NAME, email);
  const docSnap = await getDoc(d);
  if (docSnap.exists()) {
    await updateDoc(d, { signUp: true, signUpAt: serverTimestamp() });
  }
};

const countOfWaitlistUsers = async () => {
  const q = query(collection(db, DB_NAME), where("signUp", "==", false));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};

export { waitlistExists, updateUserSignUpOnWaitlistDoc, countOfWaitlistUsers };
