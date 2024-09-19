export const GAEventNames = {
  USER_SIGN_UP: "user_sign_up",
  USER_SIGN_IN: "user_sign_in",
  USER_LOGIN: "user_login",
  COVER_SELECTED: "cover_selected",
  CHALLENGE_VIEWED: "challenge_viewed",
  CHALLENGE_PLAY_STARTED: "challenge_play_started",
  CHALLENGE_COMPLETED: "challenge_completed",
  CHALLENGE_SHARE_CLICKED: "challenge_share_clicked",
  CHALLENGE_INVITE_SENT: "challenge_invite_sent",
  CHALLENGE_PLAY_CLICKED: "challenge_play_clicked",
  CHALLENGE_CREATED: "challenge_created",
  CHOOSE_SINGLE_PLAY: "choose_single_play",
  VIEW_MY_CHALLENGE: "view_my_challenge",
  CLICK_OPEN_CHALLENGE: "click_open_challenge",
  SINGLE_PLAY_STARTED: "single_play_started",
  SINGLE_PLAY_COMPLETED: "single_play_completed",
  SINGLE_PLAY_MUTED: "single_play_muted",
  SINGLE_PLAY_UNMUTED: "single_play_unmuted",
} as const;

export type TypeGAEventNames = (typeof GAEventNames)[keyof typeof GAEventNames];
