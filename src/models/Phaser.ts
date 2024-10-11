import { GameVoiceInfo } from "../game/scenes/Preloader";
import { UserDoc } from "./User";

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

export interface IGameDataParams {
  voices: GameVoiceInfo[];
  coverDocId: string;
  musicStartOffset: number;
  skinPath: string;
  backgroundPath: string;
  selectedTracks: string[];
  noOfRaceTracks: number;
  gravityY: number;
  width: number;
  enableMotion: boolean;
  trailPath: string;
  trailsLifeSpace: number;
  trailsOpacity: number;
  trailEndSize: number;
  recordDuration: number;
  isRecord: boolean;
  challengeId: string;
  userDoc: UserDoc;
  height?: number;
  dprAdjustedWidth?: number;
  dprAdjustedHeight?: number;
  showObstacles?: boolean;
  showRythmicPads?: boolean;
}
