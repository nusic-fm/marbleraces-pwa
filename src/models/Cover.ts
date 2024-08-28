import { Timestamp } from "firebase/firestore";

export type CoverV1 = {
  audioUrl: string;
  metadata: {
    channelId: string;
    channelTitle: string;
    channelDescription: string;
    channelThumbnail: string;
    videoThumbnail: string;
    videoName: string;
    videoDescription: string;
  };
  voices: VoiceV1Cover[];
  //   avatarUrl: string;
  title: string;
  vid: string;
  sections?: { name: string; start: number }[];
  bpm: number;
  duration: number;
  error?: string;
  shareInfo: ShareInfo;
  stemsReady: boolean;
  comments?: Comment[];
  likes?: {
    [id: string]: number;
    total: number;
  };
  commentsCount?: number;
  disLikes?: {
    [id: string]: number;
    total: number;
  };
  totalLikesValue: number;
  playCount: number;
  rank: number;
  prevRank: number;
  createdAt?: Timestamp;
};
export type CoverV1Doc = CoverV1 & { id: string };
export type VoiceV1Cover = {
  url?: string;
  creatorName: string;
  name: string;
  id: string;
  imageUrl: string;
  shareInfo: ShareInfo;
  avatarPath?: string;
};

type ShareInfo = {
  id: string;
  avatar: string;
  name: string;
};
