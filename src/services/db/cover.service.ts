import { doc, getDoc } from "firebase/firestore";
import { CoverV1, CoverV1Doc } from "../../models/Cover";
import { db } from "../firebase.service";

const getCover = async (coverId: string) => {
  const docRef = doc(db, "covers", coverId);
  const challengeDoc = await getDoc(docRef);
  return { ...challengeDoc.data(), id: coverId } as CoverV1Doc;
};

export { getCover };
