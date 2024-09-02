export type Challenge = {
  coverId: string;
  skinId: string;
  bgId: string;
  trailpath: string;
  title: string;
  tracksList: string[];

  voices: { name: string; id: string }[];
  creatorUserObj: { id: string; name?: string; email: string | null };
  inviteEmails: string[];
  creatorUid: string;
};
