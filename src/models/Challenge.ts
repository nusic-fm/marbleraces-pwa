import { FieldValue } from "firebase/firestore";

export type ChallengeInvite = {
  email: string;
  isCompleted: boolean;
  uid?: string;
  result?: { videoUrl: string; winnerId: string; updatedAt: FieldValue };
  xpClaimed?: boolean;
};
export type Challenge = {
  coverId: string;
  skinId: string;
  bgId: string;
  trailpath: string;
  title: string;
  tracksList: string[];

  voices: { name: string; id: string }[];
  creatorUserObj: { id: string; name?: string; email: string | null };
  invites: { [email: string]: ChallengeInvite };
  creatorUid: string;
};
export type ChallengeDoc = Challenge & { id: string };
