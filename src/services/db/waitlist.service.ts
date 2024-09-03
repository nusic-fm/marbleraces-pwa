import { addDoc, collection, doc } from "firebase/firestore";
import { db } from "../firebase.service";

const DB_NAME = "waitlists";

const createWaitlist = async (email: string) => {
  const c = collection(db, DB_NAME);
  await addDoc(c, { email, isInvited: false });
};
export { createWaitlist };
