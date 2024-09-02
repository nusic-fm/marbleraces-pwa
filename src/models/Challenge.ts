export type ChallengeInvite = {
  email: string;
  isCompleted: boolean;
  uid?: string;
  result?: { videoId: string; winnerId: string; updatedAt: string };
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
