import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.service";

const COLLECTION_NAME = "singlePlays";

const createSinglePlay = async (challengeObj: {
  email: string;
  userId: string;
  voices: { id: string; name: string }[];
  coverId: string;
  win: boolean;
}) => {
  const colRef = collection(db, COLLECTION_NAME);
  const d = await addDoc(colRef, {
    ...challengeObj,
    createdAt: serverTimestamp(),
  });

  return d.id;
};

export { createSinglePlay };
