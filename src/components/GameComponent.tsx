import { forwardRef, useEffect } from "react";
import { EventBus } from "../game/EventBus";
import PhaserGame from "../game/PhaserGame";
import {
  getSkinPath,
  getBackgroundPath,
  getTrailPath,
  getVoiceAvatarPath,
} from "../helpers";
import { Challenge } from "../models/Challenge";
import { IRefPhaserGame } from "../models/Phaser";
// import { PhaserGame } from "../game/PhaserGame";
// import { getBackgroundPath, getSkinPath } from "../helpers";

type Props = {
  challenge: Challenge;
  canvasElemWidth: number;
  onGameComplete: (win: boolean, videoId: string) => Promise<void>;
};

const GameComponent = forwardRef<IRefPhaserGame, Props>(function GameComponent(
  { challenge, canvasElemWidth, onGameComplete },
  ref
) {
  useEffect(() => {
    EventBus.on("game-over", onGameComplete);

    return () => {
      EventBus.removeListener("game-over", onGameComplete);
    };
  }, []);

  return (
    <PhaserGame
      ref={ref}
      voices={challenge.voices.map((v) => ({
        ...v,
        avatar: getVoiceAvatarPath(v.id),
      }))}
      coverDocId={challenge?.coverId}
      musicStartOffset={30}
      skinPath={getSkinPath(challenge.skinId)}
      backgroundPath={getBackgroundPath(challenge.bgId)}
      selectedTracks={challenge.tracksList.slice(0, 4)}
      noOfRaceTracks={8}
      gravityY={0.8}
      width={canvasElemWidth}
      enableMotion={false}
      trailPath={getTrailPath(challenge.trailpath)}
      trailsLifeSpace={300}
      trailEndSize={0.5}
      trailsOpacity={0.5}
      recordDuration={60000}
      isRecord={false} // TODO
    />
  );
});

// const GameComponent = ({
//   selectedVoices,
//   challenge,
//   canvasElemWidth,
// }: // phaserRef,

// any) => {
//   // return (
//   //   <Box>
//   //     <Typography>
//   //       {selectedVoices}, {challenge.toString()}, {canvasElemWidth}
//   //     </Typography>
//   //   </Box>
//   // );
//   return (
//     <PhaserGame
//       // ref={phaserRef}
//       voices={selectedVoices}
//       coverDocId={challenge?.coverId}
//       musicStartOffset={30}
//       skinPath={getSkinPath(challenge.skinId)}
//       backgroundPath={getBackgroundPath(challenge.bgId)}
//       selectedTracks={challenge.tracksList.slice(0, 4)}
//       noOfRaceTracks={4}
//       gravityY={0.5}
//       width={canvasElemWidth}
//       enableMotion={false}
//       trailPath={challenge.trailpath}
//       trailsLifeSpace={300}
//       trailEndSize={0.5}
//       trailsOpacity={0.5}
//       recordDuration={60000}
//       isRecord={false} // TODO
//     />
//   );
// };

export default GameComponent;
