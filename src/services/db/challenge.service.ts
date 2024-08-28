import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { Challenge } from "../../models/Challenge";
import { db } from "../firebase.service";

const createChallenge = async (challengeObj: Challenge) => {
  const colRef = collection(db, "challenges");
  const d = await addDoc(colRef, challengeObj);

  return d.id;
};

const getChallenge = async (challengeId: string) => {
  const docRef = doc(db, "challenges", challengeId);
  const challengeDoc = await getDoc(docRef);
  return challengeDoc.data() as Challenge;
};

export { createChallenge, getChallenge };
