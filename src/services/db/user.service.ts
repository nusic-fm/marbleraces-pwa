import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { UserDoc } from "../../models/User";
import { db, logFirebaseEvent } from "../firebase.service";
import { GAEventNames } from "../../models/GAEventNames";

const DB_NAME = "marblerace_users";

// Not in use
// const isNewUser = async (uid: string) => {
//   const d = doc(db, DB_NAME, uid);
//   const ss = await getDoc(d);
//   return ss.exists;
// };

const createUser = async (uid: string, email: string) => {
  const d = doc(db, DB_NAME, uid);
  const newUserObj = { uid, email, xp: 100, createdAt: serverTimestamp() };
  await setDoc(d, newUserObj);
  logFirebaseEvent(GAEventNames.USER_SIGN_UP, {
    email: email.split("@")[0],
    isNewUser: true,
    uid,
  });
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

const getUserDocByEmail = async (email: string) => {
  const d = query(collection(db, DB_NAME), where("email", "==", email));
  const ss = await getDocs(d);
  return ss.docs.map((doc) => doc.data() as UserDoc);
};

export { getUserDoc, updateUserProfile, createUser, getUserDocByEmail };
