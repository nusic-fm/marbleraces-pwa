import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { Challenge, ChallengeInvite } from "../../models/Challenge";
import { db } from "../firebase.service";

const createChallenge = async (challengeObj: Challenge) => {
  const colRef = collection(db, "challenges");
  const d = await addDoc(colRef, challengeObj);

  return d.id;
};

const getChallenge = async (
  challengeId: string,
  listenerCallback?: (challengeDoc: Challenge | undefined) => void
) => {
  const docRef = doc(db, "challenges", challengeId);
  const challengeDoc = await getDoc(docRef);
  if (!!listenerCallback) {
    onSnapshot(docRef, (docSnapshot) => {
      listenerCallback(docSnapshot.data() as Challenge | undefined);
    });
  }
  return challengeDoc.data() as Challenge | undefined;
};

const updateChallengeInvites = async (
  inviteObj: ChallengeInvite,
  email: string,
  challengeId: string
) => {
  const docRef = doc(db, "challenges", challengeId);
  await setDoc(
    docRef,
    {
      invites: { [email]: inviteObj },
    },
    { merge: true }
  );
};

export { createChallenge, getChallenge, updateChallengeInvites };
