export interface UserDoc {
  id: string;
  email: string;
  name?: null | string;
  providerPhotoUrl?: null | string;
  phoneNumber?: null | string;
  profileComplete?: null | string;
  bio?: string;
  avatarUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  twitterUrl?: string;
  discordUrl?: string;
  spotifyUrl?: string;
  websiteUrl?: string;
}
