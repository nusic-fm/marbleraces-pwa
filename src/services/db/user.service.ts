import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { UserDoc } from "../../models/User";
import { db } from "../firebase.service";

const DB_NAME = "marblerace_users";

// Not in use
// const isNewUser = async (uid: string) => {
//   const d = doc(db, DB_NAME, uid);
//   const ss = await getDoc(d);
//   return ss.exists;
// };

const createUser = async (uid: string, email: string) => {
  const d = doc(db, DB_NAME, uid);
  const newUserObj = { uid, email, xp: 100 };
  await setDoc(d, newUserObj);
  return newUserObj;
};

const getUserDoc = async (
  id: string,
  listenerCallback: (userDoc: UserDoc | undefined) => void
): Promise<UserDoc | undefined> => {
  const d = doc(db, DB_NAME, id);
  if (!!listenerCallback) {
    onSnapshot(d, (docSnapshot) => {
      listenerCallback(docSnapshot.data() as UserDoc | undefined);
    });
  }
  const ss = await getDoc(d);
  return ss.data() as UserDoc | undefined;
};

const updateUserProfile = async (id: string, profileObj: any) => {
  const d = doc(db, DB_NAME, id);
  await updateDoc(d, profileObj);
};

export { getUserDoc, updateUserProfile, createUser };
