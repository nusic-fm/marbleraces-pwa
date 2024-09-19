import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { Challenge, ChallengeInvite } from "../../models/Challenge";
import { db, logFirebaseEvent } from "../firebase.service";
import { updateUserActivityTimestamp } from "./user.service";
import { GAEventNames } from "../../models/GAEventNames";

const createChallenge = async (challengeObj: Challenge) => {
  const colRef = collection(db, "challenges");
  const d = await addDoc(colRef, {
    ...challengeObj,
    createdAt: serverTimestamp(),
  });
  updateUserActivityTimestamp(challengeObj.creatorUid, "challenge_created");
  logFirebaseEvent(GAEventNames.CHALLENGE_CREATED, {
    coverId: challengeObj.coverId,
    title: challengeObj.title,
    voiceId: challengeObj.voices[0].id,
    bgNo: challengeObj.bgId,
    skinId: challengeObj.skinId,
    trailpath: challengeObj.trailpath,
    challengeId: d.id,
    email: challengeObj.creatorUserObj.email?.split("@")[0],
    uid: challengeObj.creatorUid,
  });

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
      invites: { [email]: { ...inviteObj, invitedAt: serverTimestamp() } },
    },
    { merge: true }
  );
};

export { createChallenge, getChallenge, updateChallengeInvites };
