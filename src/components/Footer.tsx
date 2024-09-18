import { AppBar, Box, Fab, IconButton, styled, Toolbar } from "@mui/material";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: "0 auto",
});

type Props = {
  onHomeClick: () => void;
  onLeaderboardClick: () => void;
  onChallengesClick: () => void;
  hideLeaderboard?: boolean;
  hideOpenChallenges?: boolean;
};

const Footer = ({
  onHomeClick,
  onLeaderboardClick,
  onChallengesClick,
  hideLeaderboard,
  hideOpenChallenges,
}: Props) => {
  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{ top: "auto", bottom: 0, zIndex: 9999 }}
    >
      <Toolbar>
        {!hideLeaderboard && (
          <IconButton color="inherit" onClick={onLeaderboardClick}>
            <LeaderboardRoundedIcon />
          </IconButton>
        )}
        <StyledFab color="secondary" aria-label="add" onClick={onHomeClick}>
          <HomeRoundedIcon />
        </StyledFab>
        <Box sx={{ flexGrow: 1 }} />
        {!hideOpenChallenges && (
          <IconButton color="inherit" onClick={onChallengesClick}>
            <SportsEsportsRoundedIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
