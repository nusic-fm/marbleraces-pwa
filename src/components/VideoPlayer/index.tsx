import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { useAudioPlayer } from "react-use-audio-player";
import { useInViewport } from "../../hooks/useInViewport";

type Props = {
  song: any;
  inView: (index: number) => void;
  isPlaying: boolean;
};

const VideoPlayer = ({ song, inView, isPlaying }: Props) => {
  const { isInViewport, ref } = useInViewport(song.name);
  const { pause, togglePlayPause } = useAudioPlayer();
  const videoRef = useRef<HTMLVideoElement>(null);
  // const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isInViewport) {
      inView(song.idx);
      // setIsPlaying(true);
    } else {
      // pause();
      // setIsPlaying(false);
    }
  }, [isInViewport]);

  // const togglePauseOrPlay = () => {
  //   setIsPlaying(!isPlaying);
  // };

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      ref={(r: any) => ref(r)}
      onClick={() => togglePlayPause()}
    >
      <Box
        width={"100%"}
        height={"100%"}
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        alignItems="center"
      >
        <video
          ref={videoRef}
          width="260px"
          height="260px"
          src={`song.audioFileUrl`}
          // autoPlay
          muted
          // controls
          poster={`song.artworkUrl`}
        ></video>
      </Box>
    </Box>
  );
};

export default VideoPlayer;
