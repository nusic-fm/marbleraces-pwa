import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase.service";

const DB_NAME = "invites";

const updateUserSignUpOnInviteDoc = async (email: string) => {
  const d = doc(db, DB_NAME, email);
  const docSnap = await getDoc(d);
  if (docSnap.exists()) {
    await updateDoc(d, { signUp: true, signUpAt: serverTimestamp() });
  }
};

export { updateUserSignUpOnInviteDoc };
