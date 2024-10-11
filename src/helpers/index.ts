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

export const getBeatsArray = (id: string, startOffset: number): number[] => {
  let beatsArray: number[] = [];
  if (id === "lsUBEcaYfOidpvjUxpz1") {
    // welcome to the internet
    beatsArray = [
      0.84, 1.32, 1.82, 2.08, 2.32, 2.56, 2.78, 3.04, 3.26, 3.52, 3.74, 3.98,
      4.24, 4.48, 4.72, 4.96, 5.2, 5.44, 5.68, 5.92, 6.16, 6.4, 6.64, 6.88,
      7.12, 7.36, 7.6, 7.82, 8.06, 8.3, 8.54, 8.8, 9.02, 9.26, 9.5, 9.74, 10.0,
      10.24, 10.48, 10.72, 10.96, 11.2, 11.44, 11.68, 11.92, 12.16, 12.4, 12.64,
      12.88, 13.1, 13.36, 13.6, 13.82, 14.08, 14.32, 14.56, 14.8, 15.06, 15.28,
      15.54, 15.76, 16.24, 16.46, 16.7, 16.96, 17.2, 17.44, 17.68, 17.92, 18.16,
      18.4, 18.62, 18.88, 19.12, 19.36, 19.6, 19.84, 20.08, 20.3, 20.54, 20.8,
      21.02, 21.28, 21.52, 21.76, 22.0, 22.24, 22.46, 22.7, 22.96, 23.18, 23.44,
      23.68, 23.92, 24.14, 24.38, 24.62, 24.86, 25.1, 25.34, 25.6, 25.84, 26.08,
      26.32, 26.56, 26.82, 27.04, 27.28, 27.52, 27.76, 28.0, 28.22, 28.46, 28.7,
      28.94, 29.2, 29.44, 29.68, 30.16, 30.64, 31.1, 31.58, 32.06, 32.54, 33.04,
      33.52, 33.98, 34.46, 34.94, 35.42, 35.9, 36.38, 36.86, 37.34, 37.82, 38.3,
      38.78, 39.28, 39.76, 40.24, 40.72, 41.2, 41.68, 42.16, 42.64, 43.12,
      43.58, 44.06, 44.56, 45.04, 45.52, 46.0, 46.48, 46.94, 47.42, 47.9, 48.38,
      48.86, 49.34, 49.8, 50.28, 50.76, 51.22, 51.68, 52.14, 52.62, 53.08,
      53.54, 54.02, 54.48, 54.92, 55.38, 55.84, 56.3, 56.74, 57.2, 57.64, 58.1,
      58.56, 59.0, 59.48, 59.82, 60.14, 60.52, 61.24, 61.36, 61.62, 62.04,
      62.88, 63.72, 64.14, 64.54, 64.98, 65.38, 65.8, 66.2, 66.62, 67.04, 67.42,
      67.84, 68.24, 68.64, 69.04, 69.44, 69.82, 70.22, 70.6, 70.98, 71.38,
      71.76, 72.14, 72.5, 72.9, 73.26, 73.64, 74.0, 74.38, 74.74, 75.1, 75.46,
      75.84, 76.2, 76.56, 76.92, 77.28, 77.66, 78.02, 78.38, 78.74, 79.1, 79.46,
      79.84, 80.2, 80.56, 80.92, 81.28, 82.02, 82.38, 82.74, 83.1, 83.46, 83.82,
      84.18, 84.56, 84.92, 85.28, 85.64, 86.0, 86.38, 86.74, 87.1, 87.48, 87.84,
      88.2, 88.56, 88.94, 89.28, 90.0, 90.74, 91.46, 91.82, 92.18, 92.54, 92.92,
      93.28, 93.64, 94.0, 94.36, 94.74, 95.1, 95.46, 95.82, 96.2, 96.56, 96.92,
      97.28, 97.64, 98.02, 98.38, 98.74, 99.1, 99.44, 100.18, 100.54, 100.92,
      101.28, 101.66, 102.02, 102.38, 103.1, 103.82, 104.2, 104.56, 105.3,
      106.02, 106.76, 107.48, 108.2, 108.92, 109.64, 110.0, 110.38, 110.74,
      111.1, 111.46, 111.82, 112.18, 112.56, 112.92, 113.28, 114.02, 114.74,
      115.46, 115.82, 116.2, 116.56, 116.92, 117.64, 118.38, 118.74, 119.1,
      119.3, 119.42, 119.96, 120.56, 121.14, 121.84, 122.48, 123.12, 123.76,
      124.42, 125.06, 125.7, 126.32, 126.96, 127.6, 128.22, 128.86, 129.5,
      130.1, 130.74, 131.36, 132.0, 132.64, 133.26, 133.9, 134.52, 135.14,
      135.78, 136.4, 137.04, 137.68, 138.3, 138.94, 139.58, 140.2, 140.84,
      141.46, 142.1, 142.76, 143.38, 144.0, 144.64, 145.28, 145.9, 146.54,
      147.16, 147.8, 148.42, 149.06, 149.72, 150.34, 150.96, 151.6, 152.22,
      152.82, 153.46, 154.1, 154.72, 155.36, 156.0, 156.62, 157.26, 157.9,
      158.5, 159.14, 159.78, 160.42, 161.02, 161.66, 162.3, 162.96, 163.6,
      164.24, 164.86, 165.46, 166.1, 166.72, 167.38, 167.98, 168.62, 169.28,
      169.9, 170.52, 171.14, 171.78, 172.42, 173.04, 173.68, 174.3, 174.94,
      175.56, 176.18, 176.8, 177.44, 178.08, 178.72, 179.36, 180.0, 180.62,
      181.24, 181.88, 182.54, 183.16, 183.8, 184.44, 185.08, 185.7, 186.32,
      186.92, 187.58, 188.2, 188.82, 189.48, 190.12, 190.72, 191.34, 191.98,
      192.62, 193.24, 193.88, 194.52, 195.16, 195.82, 196.42, 197.04, 197.66,
      198.3, 198.96, 199.6, 200.22, 200.84, 201.48, 202.12, 202.74, 203.38,
      204.02, 204.64, 205.28, 205.9, 206.52, 207.14, 207.76, 208.4, 209.06,
      209.24, 209.7, 210.3, 210.94, 211.56, 212.18, 212.86, 213.5, 214.12,
      214.74, 215.38, 216.04, 216.7, 217.28, 217.94, 218.56, 219.18, 219.82,
      220.44, 221.08, 221.72, 222.36, 222.96, 223.6, 224.26, 224.86, 225.46,
      226.1, 226.74, 227.2, 227.4, 228.06, 228.68, 229.3, 229.92, 230.56, 232.4,
      233.04, 233.68, 234.32, 234.98, 235.6, 236.22, 236.84, 237.48, 238.12,
      238.74, 239.38, 240.0, 240.62, 241.26, 241.86, 242.5, 243.14, 243.78,
      244.42, 245.06, 245.7, 246.34, 246.94, 247.58, 248.2, 248.84, 249.46,
      250.1, 250.74, 251.38, 252.0, 252.64, 253.26, 253.9, 254.54, 255.16,
      255.78, 256.42, 257.04, 257.68, 258.3, 258.94, 259.58, 260.22, 260.9,
      261.6, 262.18, 262.3, 262.88, 263.56, 264.12, 265.16, 265.5, 265.86,
      266.56, 267.16, 267.26, 267.8, 267.98, 268.68, 269.38, 270.1, 270.8,
      271.5, 272.2, 272.92, 273.62, 274.3,
    ];
  } else if (id === "YE7LMzWbCKgkLgSKVX9Q") {
    // mordecai treat you better
    beatsArray = [
      0.32, 1.04, 1.76, 2.48, 3.2, 3.94, 4.66, 5.38, 6.1, 6.82, 7.56, 8.28,
      8.98, 9.72, 10.44, 11.16, 11.88, 12.62, 13.34, 14.06, 14.76, 15.5, 16.22,
      16.96, 17.66, 18.4, 19.12, 19.86, 20.54, 21.28, 22.0, 22.74, 23.44, 24.16,
      24.9, 25.64, 26.34, 27.06, 27.8, 28.52, 29.24, 29.92, 30.68, 31.4, 32.12,
      32.84, 33.58, 34.3, 35.02, 35.74, 36.46, 37.2, 37.92, 38.64, 39.36, 40.08,
      40.8, 41.54, 42.24, 42.98, 43.7, 44.42, 45.14, 45.86, 46.58, 47.32, 48.04,
      48.76, 49.48, 50.2, 50.92, 51.66, 52.38, 53.1, 53.82, 54.54, 55.26, 55.98,
      56.68, 57.42, 58.16, 58.88, 59.6, 60.32, 61.04, 61.76, 62.48, 63.22,
      63.94, 64.66, 65.38, 66.12, 66.84, 67.56, 68.28, 69.0, 69.72, 70.44,
      71.16, 71.88, 72.62, 73.34, 74.06, 74.78, 75.5, 76.22, 76.96, 77.68, 78.4,
      79.1, 79.84, 80.58, 81.28, 82.02, 82.72, 83.46, 84.18, 84.9, 85.62, 86.36,
      87.08, 87.8, 88.52, 89.24, 89.96, 90.68, 91.4, 92.12, 92.84, 93.58, 94.3,
      95.02, 95.74, 96.48, 97.2, 97.9, 98.64, 99.36, 100.08, 100.8, 101.52,
      102.26, 102.96, 103.7, 104.42, 105.14, 105.86, 106.58, 107.3, 108.02,
      108.74, 109.48, 110.2, 110.92, 111.64, 112.36, 113.08, 113.8, 114.54,
      115.26, 115.98, 116.7, 117.42, 118.16, 118.88, 119.62, 120.32, 121.04,
      121.76, 122.48, 123.22, 123.94, 124.66, 125.38, 126.1, 126.82, 127.54,
      128.28, 129.0, 129.72, 130.44, 131.16, 131.9, 132.62, 133.32, 134.06,
      134.78, 135.5, 136.22, 136.94, 137.68, 138.38, 139.12, 139.86, 140.58,
      141.3, 142.02, 142.74, 143.46, 144.2, 144.94, 145.66, 146.36, 147.1,
      147.82, 148.54, 149.26, 149.96, 150.68, 151.4, 152.14, 152.86, 153.58,
      154.3, 155.02, 155.74, 156.48, 157.2, 157.9, 158.64, 159.36, 160.08,
      160.78, 161.52, 162.24, 162.98, 163.7, 164.42, 165.14, 165.86, 166.56,
      167.3, 168.02, 168.76, 169.48, 170.2, 170.92, 171.64, 172.36, 173.1,
      173.82, 174.52, 175.26, 175.98, 176.7, 177.44, 178.16, 178.88, 179.58,
      180.32, 181.04, 181.76, 182.48, 183.2, 183.92, 184.66, 185.36,
    ];
  } else if (id === "RL2bdU5NJOukDwQzzW1s") {
    // Wake me up
    beatsArray = [
      0.2, 0.66, 1.12, 1.62, 2.1, 2.58, 3.08, 3.56, 4.04, 4.54, 5.02, 5.5, 5.96,
      6.46, 6.94, 7.44, 7.92, 8.4, 8.88, 9.36, 9.84, 10.32, 10.8, 11.3, 11.78,
      12.26, 12.74, 13.24, 13.72, 14.2, 14.66, 15.14, 15.62, 16.12, 16.58,
      17.08, 17.58, 18.08, 18.56, 19.06, 19.54, 20.04, 20.52, 20.98, 21.48,
      21.94, 22.42, 22.66, 23.16, 23.62, 24.1, 24.34, 24.6, 24.84, 25.08, 25.34,
      25.56, 26.06, 26.3, 26.54, 27.04, 27.28, 27.52, 27.76, 28.0, 28.24, 28.72,
      29.18, 29.66, 30.2, 30.68, 31.16, 31.62, 32.1, 32.6, 33.08, 33.58, 34.06,
      34.56, 35.04, 35.52, 36.0, 36.48, 36.96, 37.44, 37.92, 38.42, 38.88,
      39.36, 39.82, 40.28, 40.78, 41.3, 41.78, 42.26, 42.76, 43.24, 43.72,
      44.22, 44.7, 45.18, 45.66, 46.16, 46.64, 47.12, 47.6, 48.1, 48.58, 49.06,
      49.54, 50.02, 50.5, 51.0, 51.48, 51.96, 52.44, 52.92, 53.4, 53.88, 54.38,
      54.86, 55.34, 55.82, 56.32, 56.8, 57.28, 57.76, 58.24, 58.74, 59.2, 59.7,
      60.18, 60.68, 61.14, 61.62, 62.12, 62.6, 63.08, 63.56, 64.06, 64.54,
      65.02, 65.5, 65.98, 66.46, 66.96, 67.44, 67.92, 68.42, 68.9, 69.38, 69.86,
      70.34, 70.82, 71.32, 71.8, 72.28, 72.76, 73.24, 73.74, 74.22, 74.7, 75.18,
      75.66, 76.14, 76.62, 77.1, 77.6, 78.1, 78.56, 79.06, 79.54, 80.02, 80.52,
      81.0, 81.48, 81.96, 82.44, 82.94, 83.4, 83.9, 84.38, 84.86, 85.34, 85.84,
      86.32, 86.8, 87.28, 87.76, 88.26, 88.74, 89.22, 89.7, 90.2, 90.66, 91.18,
      91.66, 92.12, 92.6, 93.1, 93.58, 94.06, 94.54, 95.04, 95.52, 96.0, 96.48,
      96.96, 97.44, 97.94, 98.42, 98.9, 99.38, 99.86, 100.34, 100.84, 101.32,
      101.8, 102.28, 102.78, 103.26, 103.74, 104.22, 104.72, 105.18, 105.68,
      106.14, 106.64, 107.12, 107.6, 108.08, 108.58, 109.06, 109.54, 110.02,
      110.52, 111.0, 111.48, 111.96, 112.46, 112.94, 113.42, 113.9, 114.38,
      114.88, 115.36, 115.84, 116.32, 116.8, 117.3, 117.76, 118.26, 118.72,
      119.22, 119.7, 120.18, 120.66, 121.14, 121.64, 122.12, 122.6, 123.08,
      123.56, 124.04, 124.52, 125.02, 125.5, 126.02, 126.2, 127.18, 127.68,
      128.16, 128.64, 129.12, 129.6, 130.08, 130.58, 131.06, 131.54, 132.02,
      132.5, 132.98, 133.48, 133.98, 134.46, 134.94, 135.44, 135.9, 136.38,
      136.62, 136.86, 137.36, 137.6, 138.08, 138.58, 139.06, 139.54, 140.02,
      140.5, 141.0, 141.48, 141.96, 142.46, 142.92, 143.42, 143.9, 144.38,
      144.86, 145.34, 145.84, 146.32, 146.8, 147.3, 147.78, 148.22, 148.72,
      149.18, 149.68, 150.18, 150.66, 151.16, 151.64, 152.12, 152.6, 153.06,
      153.56, 154.04, 154.52, 155.02, 155.52, 156.0, 156.48, 156.98, 157.46,
      157.94, 158.42, 158.9, 159.4, 159.88, 160.34, 160.84, 161.3, 161.78,
      162.28, 162.76, 163.24, 163.7, 164.2, 164.68, 165.18, 165.66, 166.14,
      166.62, 167.12, 167.6, 168.08, 168.56, 169.04, 169.52, 170.02, 170.5,
      170.98, 171.46, 171.96, 172.44, 172.92, 173.4, 173.88, 174.38, 174.86,
      175.34, 175.82, 176.3, 176.8, 177.26, 177.76, 178.24, 178.74, 179.22,
      179.7, 180.18, 180.68, 181.16, 181.64, 182.12, 182.62, 183.1, 183.58,
      184.06, 184.54, 185.02, 185.5, 185.98, 186.48, 186.96, 187.44, 187.94,
      188.42, 188.9, 189.38, 189.88, 190.36, 190.84, 191.32, 191.8, 192.28,
      192.76, 193.24, 193.74, 194.22, 194.7, 195.18, 195.66, 196.16, 196.62,
      197.12, 197.6, 198.1, 198.58, 199.06, 199.54, 200.02, 200.5, 201.0,
      201.48, 201.98, 202.42, 202.92, 203.38, 203.86, 204.36, 204.86, 205.28,
      205.84, 206.26, 206.78, 207.24, 207.76, 208.2, 208.76, 209.3, 209.72,
      210.18, 210.66, 211.14, 211.64, 212.12, 212.6, 213.08, 213.56, 214.04,
      214.52, 215.02, 215.5, 215.98, 216.46, 216.96, 217.44, 217.92, 218.42,
      218.9, 219.38, 219.86, 220.34, 220.82, 221.32, 221.8, 222.28, 222.76,
      223.24, 223.72, 224.2, 224.7, 225.18, 225.66, 226.14, 226.64, 227.12,
      227.6, 228.08, 228.58, 229.06, 229.54, 230.02, 230.52, 231.0, 231.48,
      231.96, 232.44, 232.92, 233.42, 233.9, 234.38, 234.86, 235.34, 235.84,
      236.32, 236.8, 237.28, 237.76, 238.26, 238.74, 239.22, 239.7, 240.18,
      240.68, 241.16, 241.64, 242.12, 242.6, 243.1, 243.58, 244.06, 244.54,
      245.02, 245.5, 246.0, 246.48, 246.96, 247.44, 247.92, 248.42, 248.9,
      249.38, 249.88, 250.34, 250.84, 251.32, 251.8, 252.28, 252.78, 253.24,
      253.74, 254.22, 254.7, 255.18, 255.68, 256.16, 256.64, 257.12, 257.62,
      258.1, 258.58, 259.06, 259.54, 260.02, 260.5, 261.0, 261.48, 261.96,
      262.44, 262.92, 263.4, 263.86, 264.34, 264.82, 265.3,
    ];
  } else if (id === "hoZTAYrVO5qYmHz9CZtV") {
    // something like this
    beatsArray = [
      0.36, 0.64, 1.22, 1.52, 2.1, 2.68, 3.26, 3.86, 4.44, 5.02, 5.6, 6.18,
      6.76, 7.34, 7.94, 8.52, 9.1, 9.68, 10.28, 10.86, 11.42, 12.02, 12.62,
      13.18, 13.76, 14.36, 14.94, 15.52, 16.1, 16.68, 17.26, 17.86, 18.42,
      19.02, 19.58, 20.16, 20.74, 21.32, 21.92, 22.5, 23.06, 23.66, 24.24,
      24.82, 25.4, 25.7, 25.98, 26.58, 27.16, 27.74, 28.32, 28.9, 29.5, 29.76,
      30.06, 30.36, 30.64, 30.94, 31.24, 31.52, 31.82, 32.4, 32.98, 33.56,
      34.14, 34.72, 35.3, 35.9, 36.48, 37.06, 37.64, 38.22, 38.8, 39.38, 39.96,
      40.54, 41.14, 41.7, 42.28, 42.88, 43.46, 44.04, 44.62, 45.2, 45.8, 46.38,
      46.96, 47.54, 48.12, 48.7, 49.3, 49.88, 50.46, 51.04, 51.62, 52.2, 52.78,
      53.36, 53.94, 54.54, 55.12, 55.7, 56.28, 56.86, 57.44, 58.02, 58.62, 59.2,
      59.78, 60.36, 60.94, 61.52, 62.1, 62.68, 63.28, 63.86, 64.44, 65.02, 65.6,
      66.18, 66.78, 67.36, 67.94, 68.52, 69.1, 69.68, 70.26, 70.84, 71.44,
      72.02, 72.6, 73.18, 73.76, 74.34, 74.92, 75.5, 76.1, 76.68, 77.26, 77.84,
      78.42, 79.0, 79.6, 80.16, 80.76, 81.32, 81.92, 82.5, 83.08, 83.66, 84.24,
      84.82, 85.42, 85.98, 86.56, 87.16, 87.74, 88.32, 88.9, 89.48, 90.06,
      90.64, 91.22, 91.82, 92.4, 92.98, 93.56, 94.14, 94.74, 95.3, 95.9, 96.48,
      97.06, 97.64, 98.22, 98.8, 99.38, 99.96, 100.56, 101.14, 101.72, 102.3,
      102.88, 103.46, 104.06, 104.64, 105.22, 105.8, 106.38, 106.96, 107.54,
      108.12, 108.7, 109.28, 109.86, 110.46, 111.04, 111.62, 112.2, 112.78,
      113.38, 113.94, 114.54, 115.12, 115.7, 116.28, 116.86, 117.44, 118.04,
      118.6, 119.2, 119.78, 120.36, 120.94, 121.52, 122.12, 122.7, 123.28,
      123.86, 124.44, 125.02, 125.6, 126.18, 126.76, 127.36, 127.94, 128.52,
      129.08, 129.68, 130.26, 130.86, 131.42, 132.02, 132.6, 133.18, 133.76,
      134.34, 134.92, 135.52, 136.08, 136.68, 137.26, 137.84, 138.42, 139.0,
      139.58, 140.16, 140.74, 141.32, 141.9, 142.5, 143.08, 143.66, 144.24,
      144.82, 145.4, 146.0, 146.56, 147.16, 147.72, 148.32, 148.9, 149.48,
      150.06, 150.64, 151.24, 151.82, 152.4, 152.98, 153.56, 154.14, 154.72,
      155.32, 155.9, 156.48, 157.06, 157.66, 158.22, 158.8, 159.38, 159.96,
      160.56, 161.14, 161.72, 162.3, 162.88, 163.46, 164.04, 164.64, 165.22,
      165.8, 166.38, 166.96, 167.54, 168.12, 168.7, 169.28, 169.86, 170.46,
      171.04, 171.62, 172.2, 172.78, 173.36, 173.96, 174.54, 175.12, 175.68,
      176.28, 176.86, 177.46, 178.04, 178.6, 178.9, 179.2, 179.78, 180.36,
      180.94, 181.52, 182.1, 182.68, 183.28, 183.86, 184.44, 185.02, 185.6,
      186.18, 186.76, 187.34, 187.94, 188.52, 189.1, 189.68, 190.26, 190.84,
      191.42, 192.0, 192.6, 193.18, 193.76, 194.32, 194.92, 195.5, 196.08,
      196.66, 197.26, 197.84, 198.42, 199.0, 199.58, 200.16, 200.76, 201.32,
      201.92, 202.5, 203.08, 203.66, 204.24, 204.82, 205.42, 205.98, 206.58,
      207.16, 207.74, 208.32, 208.9, 209.48, 210.08, 210.64, 211.24, 211.82,
      212.4, 212.98, 213.56, 214.14, 214.74, 215.32, 215.9, 216.48, 217.06,
      217.64, 218.22, 218.8, 219.4, 219.98, 220.56, 221.14, 221.72, 222.3,
      222.88, 223.46, 224.06, 224.64, 225.22, 225.8, 226.38, 226.96, 227.54,
      228.12, 228.72, 229.3, 229.88, 230.46, 231.04, 231.62, 232.2, 232.78,
      233.36, 233.94, 234.54, 235.12, 235.7, 236.28, 236.86, 237.44, 238.02,
      238.62, 239.2, 239.78, 240.36,
    ];
  } else if (id === "f0pmE4twBXnJmVrJzh18") {
    // Snoop
    beatsArray = [
      6.18, 6.8, 7.44, 8.68, 9.3, 9.86, 10.46, 11.1, 11.74, 12.36, 13.0, 13.6,
      14.24, 14.86, 15.48, 16.08, 16.7, 17.32, 17.94, 18.58, 19.18, 19.82,
      20.42, 21.04, 21.66, 22.28, 22.9, 23.52, 24.14, 24.76, 25.38, 25.98, 26.6,
      27.22, 27.84, 28.46, 29.08, 29.7, 30.32, 30.94, 31.56, 32.18, 32.8, 33.42,
      34.04, 34.66, 35.26, 35.88, 36.5, 37.12, 37.74, 38.38, 38.98, 39.6, 40.22,
      40.84, 41.44, 42.06, 42.7, 43.32, 43.94, 44.56, 45.18, 45.78, 46.4, 47.02,
      47.64, 48.26, 48.88, 49.5, 50.12, 50.74, 51.34, 51.96, 52.6, 53.22, 53.82,
      54.46, 55.06, 55.68, 56.3, 56.92, 57.54, 58.16, 58.78, 59.4, 60.0, 60.62,
      61.24, 61.86, 62.48, 63.1, 63.72, 64.34, 64.96, 65.58, 66.18, 66.8, 67.44,
      68.06, 68.68, 69.3, 69.9, 70.5, 71.14, 71.76, 72.38, 73.0, 73.62, 74.24,
      74.84, 75.46, 76.08, 76.7, 77.32, 77.94, 78.56, 79.18, 79.8, 80.42, 81.02,
      81.66, 82.28, 82.9, 83.52, 84.14, 84.76, 85.36, 85.98, 86.58, 87.22,
      87.84, 88.44,
    ];
  } else if (id === "Sey1qVFqitYhnKkddMuQ") {
    // kurt cobain
    beatsArray = [
      6.9, 7.0, 7.72, 8.48, 9.24, 10.0, 10.76, 11.52, 12.26, 13.04, 13.78,
      14.54, 15.3, 16.06, 16.8, 17.56, 17.92, 18.28, 18.66, 19.04, 19.42, 19.8,
      20.18, 20.56, 20.92, 21.3, 21.68, 22.06, 22.8, 23.18, 23.56, 23.94, 24.3,
      24.68, 25.06, 25.82, 26.58, 27.32, 28.06, 28.82, 29.56, 30.3, 31.04,
      31.78, 32.54, 33.28, 34.0, 34.74, 35.5, 36.24, 37.0, 37.76, 38.52, 39.28,
      40.02, 40.78, 41.52, 42.26, 43.02, 43.76, 44.52, 45.26, 46.02, 46.76,
      47.52, 48.26, 49.02, 49.76, 50.52, 51.26, 52.0, 52.74, 53.5, 54.24, 55.0,
      55.76, 56.5, 57.24, 58.0, 58.74, 59.5, 60.2, 60.96, 61.72, 62.46, 63.22,
      63.96, 64.7, 65.42, 66.16, 66.88, 67.62, 68.36, 69.1, 69.84, 70.58, 71.3,
      72.04, 72.76, 73.48, 74.18, 74.9, 75.6, 76.34, 77.06, 77.78, 78.5, 79.24,
      79.98, 80.7, 81.44, 82.16, 82.9, 83.64, 84.38, 85.1, 85.84, 86.56, 87.28,
      88.02, 88.74, 89.48, 90.22, 90.96, 91.7, 92.42, 93.16, 93.88, 94.6, 95.36,
      96.1, 96.82, 97.56, 98.3, 99.04, 99.78, 100.52, 101.26, 102.0, 102.72,
      103.46, 104.2, 104.92, 105.66, 106.4, 107.16, 107.88, 108.64, 109.34,
      110.1, 110.82, 111.56, 112.28, 113.02, 113.78, 114.5, 115.22, 115.96,
      116.7, 117.42, 118.16, 118.88, 119.6, 120.38, 121.14, 121.88, 122.6,
      123.32, 124.06, 124.78, 125.52, 126.24, 126.96, 127.68, 128.4, 129.12,
      129.84, 130.56, 131.3, 132.02, 132.74, 133.44, 134.16, 134.88, 135.62,
      136.32, 137.04, 137.78, 138.5, 139.24, 139.96, 140.7, 141.42, 142.14,
      142.86, 143.58, 144.32, 145.04, 145.76, 146.48, 147.2, 147.92, 148.66,
      149.36, 150.1, 150.84, 151.56, 152.28, 153.02, 153.74, 154.5, 155.24,
      155.98, 156.72, 157.46, 158.2, 158.92, 159.66, 160.38, 161.1, 161.84,
      162.56, 163.3, 164.02, 164.76, 165.5, 166.22, 166.94, 167.68, 168.4,
      169.14, 169.86, 170.58, 171.3, 172.02, 172.72, 173.46, 174.18, 174.9,
      175.62, 176.36, 177.08, 177.8, 178.54, 179.26, 179.96, 180.66, 181.4,
      182.12, 182.84, 183.56, 184.28, 185.02, 185.72, 186.46, 187.18, 187.9,
      188.64, 189.36, 190.08, 190.8, 191.52, 192.24, 192.96, 193.68, 194.42,
      195.14, 195.86, 196.58, 197.3, 198.02, 198.74, 199.48, 200.2, 200.92,
      201.64, 202.36, 203.08, 203.8, 204.62, 205.26,
    ];
  } else if (id === "8FbtvPhkC13vo3HnAirx") {
    // Bad day
    beatsArray = [
      0.5, 1.34, 2.2, 3.04, 3.32, 3.9, 4.76, 6.48, 7.34, 8.2, 9.04, 9.92, 10.78,
      11.6, 12.48, 13.34, 14.2, 15.04, 15.9, 16.76, 17.6, 18.44, 19.36, 20.22,
      21.08, 21.98, 22.2, 22.76, 23.32, 23.68, 24.44, 25.38, 25.62, 26.2, 26.76,
      27.32, 27.86, 28.5, 29.1, 30.5, 31.34, 32.2, 33.06, 33.92, 34.78, 35.64,
      36.5, 37.36, 38.22, 39.08, 39.94, 40.78, 41.64, 42.5, 43.36, 44.22, 45.06,
      45.92, 46.78, 47.64, 48.5, 49.36, 50.22, 51.08, 51.94, 52.78, 53.64, 54.5,
      55.36, 56.22, 57.08, 57.94, 58.8, 59.64, 60.52, 61.36, 62.22, 63.06,
      63.92, 64.78, 65.64, 66.5, 67.36, 68.22, 69.08, 69.94, 70.78, 71.66, 72.5,
      73.36, 74.22, 75.08, 75.92, 76.78, 77.64, 78.5, 79.36, 80.22, 81.08,
      81.94, 82.78, 83.64, 84.5, 85.36, 86.2, 87.08, 87.94, 88.8, 89.64, 90.5,
      91.36, 92.22, 93.08, 93.92, 94.8, 95.64, 96.5, 97.36, 98.22, 99.08, 99.92,
      100.78, 101.66, 102.5, 103.36, 104.22, 105.08, 105.94, 106.78, 107.64,
      108.5, 109.36, 110.22, 111.08, 111.94, 112.78, 113.64, 114.5, 115.36,
      116.22, 117.08, 117.94, 118.78, 119.64, 120.5, 121.36, 122.22, 123.08,
      123.94, 124.8, 125.64, 126.5, 127.36, 128.22, 129.08, 129.94, 130.78,
      131.66, 132.5, 133.36, 134.22, 135.08, 135.94, 136.8, 137.64, 138.5,
      139.36, 140.22, 141.06, 141.92, 142.78, 143.66, 144.5, 145.36, 146.22,
      147.08, 147.94, 148.8, 149.66, 150.5, 151.36, 152.22, 153.08, 153.94,
      154.8, 155.66, 156.52, 157.36, 158.22, 159.08, 159.94, 160.78, 161.64,
      162.5, 163.36, 164.22, 165.08, 165.92, 166.78, 167.64, 168.5, 169.36,
      170.22, 171.08, 171.92, 172.78, 173.62, 174.5, 175.36, 176.22, 177.06,
      177.94, 178.8, 179.64, 180.5, 181.36, 182.22, 183.08, 183.94, 184.8,
      185.64, 186.5, 187.36, 188.22, 189.06, 189.94, 190.78, 191.64, 192.5,
      193.36, 194.22, 195.08, 195.94, 196.8, 197.64, 198.5, 199.36, 200.22,
      201.08, 201.94, 202.8, 203.66, 204.5, 205.36, 206.2, 207.08, 207.94,
      208.8, 209.64, 210.52, 211.36, 212.2, 213.06, 213.94, 214.8, 215.66,
      216.5, 217.36, 218.22, 219.06, 219.92, 220.78, 221.64, 222.5, 223.36,
      224.22, 225.06, 225.92, 226.76, 227.64, 228.5, 229.36, 230.22,
    ];
  } else if (id === "NAc4aENdcDHIh2k4K5oG") {
    // Let it go
    beatsArray = [
      0.38, 1.26, 2.12, 3.02, 3.9, 4.78, 5.66, 6.52, 7.38, 8.26, 9.14, 10.06,
      10.9, 11.78, 12.66, 13.54, 14.44, 15.3, 16.18, 17.04, 17.92, 18.78, 19.66,
      20.52, 21.42, 22.3, 23.2, 24.06, 24.9, 25.78, 26.68, 27.54, 28.38, 29.28,
      30.14, 30.62, 31.06, 31.48, 31.92, 32.38, 32.82, 33.24, 33.66, 34.1,
      34.54, 34.98, 35.46, 35.92, 36.3, 36.74, 37.22, 38.42, 38.94, 39.38,
      39.84, 40.26, 40.7, 41.14, 41.56, 42.0, 42.42, 42.86, 43.3, 43.74, 44.18,
      44.62, 45.02, 45.44, 45.88, 46.3, 46.74, 47.18, 47.6, 48.04, 48.46, 48.9,
      49.34, 49.78, 50.22, 50.64, 51.1, 51.54, 51.98, 52.44, 52.88, 53.34,
      53.78, 54.24, 54.7, 55.14, 55.58, 56.02, 56.46, 56.88, 57.34, 57.76,
      58.22, 58.64, 59.06, 59.48, 59.96, 60.84, 61.72, 62.58, 63.46, 64.32,
      65.22, 66.08, 66.96, 67.84, 68.72, 69.16, 69.6, 70.48, 71.36, 72.24,
      72.66, 73.08, 73.54, 73.98, 74.86, 75.74, 76.62, 77.04, 77.48, 78.36,
      79.24, 80.1, 81.0, 81.86, 82.76, 83.62, 84.5, 85.36, 86.24, 87.12, 87.98,
      88.88, 89.3, 89.74, 90.18, 90.62, 91.06, 91.5, 91.94, 92.38, 92.82, 93.28,
      93.7, 94.14, 94.58, 95.02, 95.46, 95.9, 96.32, 96.76, 97.2, 97.64, 98.08,
      98.52, 98.94, 99.4, 99.84, 100.28, 100.7, 101.14, 101.56, 102.02, 102.44,
      102.88, 103.32, 103.76, 104.2, 104.64, 105.08, 105.52, 105.96, 106.4,
      106.84, 107.28, 107.72, 108.16, 108.6, 109.02, 109.46, 109.9, 110.34,
      110.78, 111.22, 111.66, 112.1, 112.52, 112.96, 113.4, 113.84, 114.28,
      114.72, 115.16, 115.6, 116.04, 116.48, 116.92, 117.36, 117.8, 118.24,
      118.68, 119.52, 120.4, 121.26, 122.16, 123.04, 123.9, 124.78, 125.66,
      126.54, 127.42, 128.28, 129.16, 130.04, 130.92, 131.78, 132.66, 133.54,
      134.42, 135.28, 136.16, 137.04, 137.92, 138.8, 139.68, 140.56, 141.42,
      142.3, 143.18, 144.06, 144.94, 145.8, 146.68, 147.56, 148.44, 148.86,
      149.3, 149.74, 150.18, 150.62, 151.04, 151.48, 151.94, 152.38, 152.8,
      153.24, 153.68, 154.12, 154.56, 155.0, 155.44, 155.88, 156.3, 156.74,
      157.18, 157.62, 158.06, 158.5, 158.94, 159.38, 159.82, 160.26, 160.7,
      161.14, 161.58, 162.02, 162.44, 162.9, 163.34, 163.78, 164.2, 164.66,
      165.08, 165.54, 165.96, 166.4, 166.82, 167.24, 167.7, 168.14, 168.58,
      169.02, 169.46, 169.9, 170.32, 170.76, 171.2, 171.66, 172.1, 172.52,
      172.94, 173.38, 173.84, 174.28, 174.72, 175.18, 175.64, 176.6, 177.1,
      177.34, 177.56, 177.96, 178.22, 179.08, 179.96, 180.84, 181.72, 182.58,
      183.46, 184.36, 185.22, 186.1, 186.98, 187.86, 188.72, 189.6, 190.48,
      191.36, 192.24, 193.1, 193.98, 194.86, 195.72, 196.6, 197.48, 198.36,
      199.24, 200.1, 201.0, 201.88, 202.74, 203.62, 204.5, 205.36, 206.24,
      207.12, 208.0, 208.88, 209.76, 210.68, 211.54,
    ];
  } else if (id === "PkOBGtGbdyMSEkG0BQ6O") {
    // Skyfall
    beatsArray = [
      0.64, 6.98, 7.76, 8.56, 10.18, 11.78, 12.56, 13.34, 14.92, 16.56, 18.22,
      19.0, 19.78, 21.38, 22.98, 24.56, 26.18, 27.76, 29.34, 30.16, 30.96,
      31.78, 32.6, 33.38, 34.16, 34.96, 35.78, 36.58, 37.34, 38.1, 38.92, 39.7,
      40.52, 41.34, 42.16, 42.98, 43.8, 44.58, 45.38, 46.18, 46.96, 47.76,
      48.58, 49.36, 50.16, 50.98, 51.78, 52.58, 53.38, 54.14, 54.92, 55.74,
      56.54, 57.36, 58.14, 58.96, 59.78, 60.58, 61.38, 62.18, 62.98, 63.78,
      64.58, 65.38, 66.18, 66.98, 67.76, 68.58, 69.38, 70.18, 70.96, 71.76,
      72.58, 73.38, 74.16, 74.98, 75.78, 76.58, 77.36, 78.14, 78.96, 79.74,
      80.54, 81.36, 82.16, 82.96, 83.76, 84.56, 85.38, 86.18, 86.98, 87.78,
      88.58, 89.38, 89.78, 90.18, 90.58, 90.98, 91.38, 91.78, 92.18, 92.56,
      92.96, 93.36, 93.78, 94.18, 94.56, 94.96, 95.36, 95.78, 96.16, 96.56,
      96.96, 97.36, 97.78, 98.18, 98.58, 98.96, 99.36, 99.78, 100.18, 100.58,
      100.98, 101.38, 101.78, 102.18, 102.56, 102.96, 103.36, 103.78, 104.18,
      104.58, 104.96, 105.36, 105.76, 106.16, 106.56, 106.96, 107.36, 107.78,
      108.18, 108.56, 108.98, 109.38, 109.76, 110.18, 110.58, 110.98, 111.38,
      111.78, 112.16, 112.56, 112.98, 113.38, 113.76, 114.18, 114.58, 114.96,
      115.38, 115.78, 116.18, 116.58, 116.98, 117.38, 117.78, 118.18, 118.58,
      118.98, 119.78, 120.58, 121.36, 122.18, 122.96, 123.78, 124.58, 125.38,
      126.18, 126.96, 127.76, 128.56, 129.38, 130.18, 130.98, 131.78, 132.58,
      133.4, 134.18, 134.98, 135.78, 136.58, 137.36, 138.16, 138.98, 139.78,
      140.56, 141.38, 142.18, 142.98, 143.78, 144.56, 145.36, 146.18, 146.96,
      147.78, 148.58, 149.38, 150.18, 150.98, 151.78, 152.58, 153.38, 154.18,
      154.98, 155.78, 156.58, 157.38, 158.16, 158.98, 159.78, 160.56, 161.36,
      162.18, 162.96, 163.76, 164.56, 165.38, 166.16, 166.96, 167.76, 168.56,
      169.36, 170.18, 170.96, 171.78, 172.56, 173.36, 174.16, 174.94, 175.76,
      176.56, 177.36, 178.14, 178.96, 179.76, 180.56, 181.36, 182.16, 182.94,
      183.76, 184.56, 185.36, 186.16, 186.96, 187.74, 188.56, 189.36, 190.16,
      190.96, 191.76, 192.56, 193.36, 194.14, 194.94, 195.74, 196.54, 197.32,
      198.14, 198.96, 199.76, 200.56, 201.36, 202.14, 202.96, 203.74, 204.54,
      205.34, 206.14, 206.94, 207.72, 208.52, 209.32, 210.1, 210.88, 211.68,
      212.48, 213.26, 214.04, 214.84, 215.64, 216.42, 217.2, 217.98, 218.76,
      219.56, 220.34, 221.12, 221.9, 222.68, 223.46, 224.24, 225.02, 225.8,
      226.58, 227.36, 228.14, 228.92, 229.7, 230.48, 231.26, 232.04, 232.8,
      233.6, 234.38, 235.16, 235.94, 236.72, 237.5, 238.26, 239.04, 239.82,
      240.6, 241.38, 242.16, 242.94, 243.72, 244.5, 245.28, 246.06, 246.84,
      247.62, 248.4, 249.18, 249.96, 250.74, 251.52, 252.28, 253.08, 253.86,
      254.64, 255.4, 256.2, 256.98, 257.76, 258.52, 259.3, 260.08, 260.86,
      261.64, 262.42, 263.2, 263.98, 264.76, 265.54, 266.32, 267.1, 267.94,
      268.78, 270.5, 271.34, 272.12, 275.74,
    ];
  } else if (id === "bkvtnO1D4fOUYvzwn0NJ") {
    // Where are you
    beatsArray = [
      1.02, 7.04, 7.46, 7.88, 8.3, 8.74, 9.16, 9.58, 10.02, 10.44, 10.86, 11.3,
      11.72, 12.16, 12.58, 13.02, 13.46, 13.88, 14.3, 14.74, 15.16, 15.58, 16.0,
      16.44, 16.88, 17.32, 17.74, 18.16, 18.6, 19.02, 19.44, 19.88, 20.32,
      20.74, 21.16, 22.0, 22.88, 23.3, 23.74, 24.18, 24.6, 25.02, 25.44, 25.88,
      26.3, 26.74, 27.16, 27.6, 28.02, 28.46, 28.88, 29.32, 29.74, 30.18, 30.62,
      31.04, 31.48, 31.9, 32.32, 33.16, 34.04, 34.88, 35.76, 36.6, 37.48, 38.34,
      39.18, 40.02, 40.88, 41.74, 42.6, 43.46, 44.32, 44.74, 45.16, 46.02,
      46.46, 46.88, 47.74, 48.16, 48.6, 49.46, 50.3, 51.18, 52.02, 52.88, 53.72,
      54.6, 55.46, 56.32, 57.18, 57.6, 58.02, 58.88, 60.1, 61.02, 61.88, 62.74,
      63.58, 64.46, 65.26, 66.16, 67.02, 67.86, 68.72, 69.58, 70.44, 71.3,
      72.16, 73.02, 73.86, 74.72, 75.58, 76.44, 77.3, 78.16, 79.02, 79.86,
      80.72, 81.6, 82.44, 83.3, 84.16, 85.02, 85.86, 86.72, 87.58, 88.44, 89.3,
      89.74, 90.16, 90.6, 91.02, 91.46, 91.9, 92.34, 92.76, 93.18, 93.6, 94.02,
      94.46, 94.88, 95.32, 95.7, 96.16, 96.54, 96.96, 97.44, 97.86, 98.3, 98.72,
      99.16, 99.6, 100.02, 100.48, 100.88, 101.3, 101.72, 102.16, 102.52,
      102.96, 103.4, 103.82, 104.24, 104.72, 105.16, 105.58, 106.0, 106.44,
      106.86, 107.28, 107.72, 108.14, 108.58, 108.96, 109.44, 109.86, 110.28,
      110.68, 111.16, 111.54, 111.62, 112.02, 112.4, 112.88, 113.3, 113.68,
      114.1, 114.58, 114.96, 115.44, 115.82, 116.24, 116.34, 116.74, 117.1,
      117.6, 118.04, 118.48, 118.88, 119.24, 119.66, 120.1, 120.54, 120.94,
      121.4, 121.88, 122.24, 122.68, 123.16, 123.6, 124.0, 124.44, 124.86,
      125.28, 125.72, 126.14, 126.58, 126.98, 127.4, 127.84, 128.3, 128.72,
      129.16, 129.54, 130.02, 130.46, 130.9, 131.32, 131.7, 132.18, 132.56,
      133.44, 133.84, 134.24, 134.72, 135.14, 135.6, 136.02, 136.46, 136.88,
      137.3, 137.74, 138.18, 138.56, 138.98, 139.42, 139.86, 140.3, 140.7,
      141.14, 141.58, 142.02, 142.42, 142.86, 143.26, 143.74, 144.14, 144.56,
      145.02, 145.44, 145.88, 146.3, 146.74, 147.16, 147.58, 148.02, 148.46,
      148.86, 149.28, 149.74, 150.16, 150.6, 151.02, 151.44, 151.88, 152.3,
      152.74, 153.16, 153.6, 154.02, 154.46, 154.88, 155.3, 155.74, 156.16,
      156.58, 157.02, 157.44, 157.88, 158.3, 158.74, 159.16, 159.6, 160.02,
      160.44, 160.86, 161.3, 161.72, 162.16, 162.58, 163.0, 163.44, 163.84,
      164.28, 164.72, 165.14, 165.56, 166.0, 166.44, 166.86, 167.3, 167.72,
      168.16, 168.58, 169.0, 169.44, 169.86, 170.28, 170.72, 171.14, 171.58,
      172.0, 172.44, 172.86, 173.3, 173.72, 174.16, 174.58, 175.02, 175.44,
      175.88, 176.3, 176.74, 177.16, 177.58, 178.02, 178.44, 178.88, 179.3,
      179.74, 180.16, 181.02, 181.46, 181.88, 182.3, 182.74, 183.18, 183.58,
      184.02, 184.46, 184.88, 185.3, 185.74, 186.16, 186.6, 187.02, 187.46,
      187.88, 188.3, 188.74, 189.16, 189.58, 190.02, 190.44, 190.88, 191.3,
      191.72, 192.16, 192.58, 193.02, 193.44, 193.88, 194.3, 194.72, 195.14,
      195.58, 196.02, 196.44, 196.88, 197.3, 197.74, 198.16, 198.58, 199.0,
      199.44, 199.86, 200.3, 200.72, 201.16, 201.58, 202.02, 202.44, 202.88,
      203.3, 203.72, 204.16, 204.6, 205.02, 205.44, 205.88, 206.3, 206.72,
      207.16, 207.6, 208.02, 208.38, 208.84, 209.26, 209.7, 210.1, 210.54,
      211.0, 211.44, 211.86, 212.3, 212.72, 213.16, 213.56, 214.02, 214.44,
      214.88, 215.3, 215.72, 216.14, 216.58, 217.02, 217.44, 217.88, 218.3,
      218.72, 219.16, 219.58, 220.02, 220.44, 220.86, 221.28, 221.72, 222.16,
      222.58, 223.0, 223.44, 223.82, 224.3, 224.72, 225.16, 225.6, 226.0,
      226.44, 226.86, 227.28, 227.72, 228.16, 228.58, 229.02, 229.44, 229.88,
      230.3, 230.72, 231.16, 231.58, 232.02, 232.44, 232.86, 233.3, 233.72,
      234.16, 234.6, 235.02, 235.46, 235.84, 236.3, 236.74, 237.14, 237.6,
      238.0, 238.44, 239.32, 240.16, 241.02,
    ];
  } else {
    alert("Unable to fetch beats for this cover");
  }
  return beatsArray.filter((beat) => beat > startOffset);
};

// Beats array is the array of beats in the song
// groupLength is the number of beats in the group
// groupInterval is the interval between the start of each group
export const createBeatsGroupWithInterval = (
  beatsArray: number[],
  groupLength: number,
  noOfGroups: number,
  groupInterval: number
) => {
  // Create beats from random index for the number groupLength
  // Then Ignore the groupInterval no of beats
  // Then create a new group
  // Repeat the above step for the number of groups
  // Return the result
  const resultShowBeats = [];
  let beatIndex = createRandomNumber(8, 16);
  for (let i = 0; i < noOfGroups; i++) {
    for (let j = 0; j < groupLength; j++) {
      resultShowBeats.push(beatsArray[beatIndex]);
      beatIndex += createRandomNumber(1, 3);
    }
    beatIndex += groupInterval;
  }
  return resultShowBeats;
};
