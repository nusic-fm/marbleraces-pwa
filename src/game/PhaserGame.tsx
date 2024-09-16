import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import StartGame from "./main";
import * as Tone from "tone";
import { IGameDataParams, IRefPhaserGame } from "../models/Phaser";
import { uploadChallengeVideo } from "../services/storage/challengeVideo";
import { EventBus } from "./EventBus";

interface IProps extends IGameDataParams {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
  onGameComplete: (
    win: boolean,
    coverDocId: string,
    videoBlob: Blob
  ) => Promise<void>;
}
// const downloadVideo = (videoUrl: string, name: string) => {
//   const link = document.createElement("a");
//   link.href = videoUrl;
//   link.download = `${name}.webm`; // Set the file name for download
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame(
  {
    voices,
    coverDocId,
    musicStartOffset,
    skinPath,
    backgroundPath,
    selectedTracks,
    noOfRaceTracks,
    gravityY,
    width,
    enableMotion,
    trailPath,
    trailsLifeSpace,
    trailsOpacity,
    trailEndSize,
    recordDuration,
    isRecord,
    challengeId,
    userDoc,
    onGameComplete,
  },
  ref
) {
  const game = useRef<Phaser.Game | null>(null!);

  const [mediaRecorder, setMediaRecorder] = useState<null | MediaRecorder>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const isCurrentUserWin = useRef<boolean>(false);

  const stopRecording = (win: boolean) => {
    isCurrentUserWin.current = win;
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    EventBus.on("game-over", stopRecording);

    return () => {
      EventBus.removeListener("game-over", stopRecording);
    };
  }, [mediaRecorder]);

  const startRecording = (canvas: HTMLCanvasElement) => {
    // const canvas = canvasRef.current;
    const canvasStream = canvas.captureStream(120); // 30 FPS
    const audioCtx = Tone.getContext().rawContext;
    const dest = (audioCtx as any).createMediaStreamDestination();
    Tone.getDestination().connect(dest);
    const audioStream = dest.stream;

    // navigator.mediaDevices
    //     .getUserMedia({ audio: true })
    //     .then((micStream) => {
    // Combine the canvas video stream and the audio stream
    const combinedStream = new MediaStream([
      ...canvasStream.getTracks(),
      ...audioStream.getTracks(),
    ]);

    const recorder = new MediaRecorder(combinedStream, {
      mimeType: "video/webm; codecs=vp9,opus",
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      // downloadVideo(URL.createObjectURL(blob), coverDocId);
      // Store the video in Firebase Storage

      onGameComplete(isCurrentUserWin.current, coverDocId, blob);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);

    // setTimeout(() => {
    //   stopRecording(recorder);
    // }, recordDuration * 1000);
  };

  useLayoutEffect(() => {
    game.current = StartGame("game-container", {
      voices,
      coverDocId,
      musicStartOffset,
      skinPath,
      backgroundPath,
      selectedTracks,
      noOfRaceTracks,
      gravityY,
      width,
      enableMotion,
      trailPath,
      trailsLifeSpace,
      trailsOpacity,
      trailEndSize,
      recordDuration,
      isRecord,
      challengeId,
      userDoc,
    });
    if (typeof ref === "function") {
      ref({ game: game.current, scene: null });
    } else if (ref) {
      ref.current = { game: game.current, scene: null };
    }
    if (game.current && isRecord) {
      startRecording(game.current.canvas);
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        if (game.current !== null) {
          game.current = null;
        }
      }
    };
  }, [ref]);

  return <div id="game-container" style={{ height: "100%" }}></div>;
});

export default PhaserGame;
