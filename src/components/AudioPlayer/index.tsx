/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/** @jsxRuntime classic */
/** @jsx jsx */
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import { useAudioPlayer } from "react-use-audio-player";

const roteteImage = keyframes`
  from {
    transform: rotate(0dev);
  }

  to {
    transform: rotate(360deg);
  }
`;

type Props = {
  song: any;
  // inView: (index: number) => void;
  isPlaying: boolean;
};

const AudioPlaer = ({ song, isPlaying }: Props) => {
  // const audioRef = useRef(new Audio(song.audioFileUrl));
  // const { isInViewport, ref } = useInViewport(song.name);
  // const [isPlaying, setIsPlaying] = useState(false);
  // const animationRef = useRef<HTMLImageElement>(null);
  const { togglePlayPause, pause } = useAudioPlayer();

  // const togglePlayPause = () => {
  //   setIsPlaying(!isPlaying);
  // };
  // useEffect(() => {
  //   if (isPlaying) {
  //     if (animationRef.current)
  //       animationRef.current.style.animationPlayState = "running";
  //     // audioRef.current.play();
  //   } else {
  //     if (animationRef.current)
  //       animationRef.current.style.animationPlayState = "paused";
  //     // audioRef.current.pause();
  //   }
  // }, [isPlaying]);

  // useEffect(() => {
  //   if (isInViewport) {
  //     inView(song.idx);
  //     // setIsPlaying(true);
  //   } else {
  //     // pause();
  //     // setIsPlaying(false);
  //   }
  // }, [isInViewport]);

  return (
    <Box
      width="100%"
      height="100%"
      // ref={(r) => ref(r as any)}
      onClick={() => togglePlayPause()}
      display="flex"
      alignItems="center"
    >
      <Box
        width={"100%"}
        height={"100%"}
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
      >
        <img
          // ref={animationRef}
          // css={css`
          //   animation: ${roteteImage} 30s ease infinite;
          //   border-radius: 50%;
          // `}
          src={song.posterUrl}
          alt=""
          width="70%"
          style={{ borderRadius: "8px" }}
          // height="260px"
        ></img>
      </Box>
      {/* <Box display={"flex"} gap={2} justifyContent="center">
        <LoadingButton
          // loading={loading}
          onClick={() => {
            togglePlayPause();
          }}
          color="secondary"
        >
          {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
        </LoadingButton>
      </Box> */}
    </Box>
  );
};

export default AudioPlaer;
