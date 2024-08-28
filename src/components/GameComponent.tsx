import { Box, Typography } from "@mui/material";
import { forwardRef } from "react";
import PhaserGame from "../game/PhaserGame";
import {
  getSkinPath,
  getBackgroundPath,
  getTrackPath,
  getTrailPath,
  getVoiceAvatarPath,
} from "../helpers";
import { Challenge } from "../models/Challenge";
import { IRefPhaserGame } from "../models/Phaser";
// import { PhaserGame } from "../game/PhaserGame";
// import { getBackgroundPath, getSkinPath } from "../helpers";

type Props = { challenge: Challenge; canvasElemWidth: number };

const GameComponent = forwardRef<IRefPhaserGame, Props>(function GameComponent(
  { challenge, canvasElemWidth },
  ref
) {
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
