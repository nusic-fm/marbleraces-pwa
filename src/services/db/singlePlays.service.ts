import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
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

const updateSinglePlay = async (
  playId: string,
  data: {
    survey: {
      id: number;
      rating: number;
      likedFeatures: string[];
      tellUsMore: string;
    };
  }
) => {
  const docRef = doc(db, COLLECTION_NAME, playId);
  await updateDoc(docRef, data);
};

export { createSinglePlay, updateSinglePlay };
