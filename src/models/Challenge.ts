export type Challenge = {
  coverId: string;
  skinId: string;
  bgId: string;
  trailpath: string;
  title: string;
  tracksList: string[];

  userObj: { id: string; name?: string; email: string | null };
  voices: { name: string; id: string }[];
};
