import PlayCircleRounded from "@mui/icons-material/PlayCircleRounded";
import PauseCircleRounded from "@mui/icons-material/PauseCircleRounded";
import { Box, IconButton, Typography } from "@mui/material";

type Props = {
  isPlayling: boolean;
  name: string;
  isSelected: boolean;
  onToggleClick: () => void;
};

const PlaylistNameCard = ({
  isPlayling,
  name,
  isSelected,
  onToggleClick,
}: Props) => {
  return (
    <Box
      sx={{
        background: isSelected
          ? "rgba(255,255,255,0.8)"
          : "rgba(255,255,255,0.6)",
      }}
      boxShadow={isSelected ? "rgba(255, 255, 255, 0.85) 0px 5px 15px" : ""}
      p={1}
      pr={2.5}
      borderRadius="6px"
      display={"flex"}
      // gap={1}
      alignItems="center"
    >
      <IconButton onClick={onToggleClick}>
        {isPlayling && isSelected ? (
          <PauseCircleRounded htmlColor="black" />
        ) : (
          <PlayCircleRounded htmlColor="black" />
        )}
      </IconButton>
      <Typography color="black" align="center">
        {name}
      </Typography>
    </Box>
  );
};

export default PlaylistNameCard;
