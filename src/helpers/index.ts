import { ethers } from "ethers";

const getProvider = () => {
  return new ethers.providers.AlchemyProvider(
    process.env.NEXT_PUBLIC_CHAIN_NAME as string,
    process.env.NEXT_PUBLIC_ALCHEMY as string
  );
};

export const getEnsName = (address: string): Promise<string | null> => {
  const provider = getProvider();
  return provider.lookupAddress(address);
};

export const fmtMSS = (s: number) => {
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
};

export const createRandomNumber = (min: number, max: number, not?: number) => {
  let random = Math.floor(Math.random() * (max - min + 1) + min);
  while (random === not) {
    random = Math.floor(Math.random() * (max - min + 1) + min);
  }
  return random;
};

// Fill the array with its elements until it reaches the desired length
export const duplicateArrayElemToN = (
  arr: string[],
  n: number = 6
): string[] => {
  const result = [...arr];
  while (result.length < n) {
    result.push(arr[createRandomNumber(0, arr.length - 1)]);
  }
  return result.sort(() => Math.random() - 0.5);
};

export const getBackgroundPath = (id: string) =>
  `https://voxaudio.nusic.fm/marble_race%2Fbackgrounds%2FBG${id}.png?alt=media`;
export const getTrailPath = (id: string) =>
  `https://voxaudio.nusic.fm/marble_race%2Ftrails%2F${id}?alt=media`;
export const getSkinPath = (id: string) =>
  `https://voxaudio.nusic.fm/${encodeURIComponent(
    "marble_race/track_skins/"
  )}${id}?alt=media`;
export const getTrackPath = (id: string) =>
  `https://voxaudio.nusic.fm/marble_race%2Foriginal_tracks%2F${id}.png?alt=media`;
export const getTrackPreviewPath = (id: string) =>
  `https://voxaudio.nusic.fm/marble_race%2Foriginal_tracks%2F${id}.png?alt=media`;
export const getVoiceAvatarPath = (voiceId: string) =>
  `https://voxaudio.nusic.fm/${encodeURIComponent(
    "voice_models/avatars/thumbs/"
  )}${voiceId}_200x200?alt=media`;

export const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const getClientTimeInCustomFormat = () => {
  const time = new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeArray = time.split(",");
  return `${timeArray[0]}, ${timeArray[2]} ${timeArray[1].trim()}`; // Format: 10:57 PM, Sep 28  2024
};
export const TRAILS_SELECTION = [
  "firework.png",
  "money08.png",
  "protect_ball01.png",
  "stars_01.png",
  "snow.png",
];
