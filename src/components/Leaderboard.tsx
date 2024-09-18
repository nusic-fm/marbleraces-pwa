import {
  Box,
  Chip,
  LinearProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { query, collection, orderBy, limit } from "firebase/firestore";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../services/firebase.service";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

type Props = {};

const Leaderboard = (props: Props) => {
  const [usersDocs, loading, error] = useCollectionData(
    query(collection(db, "marblerace_users"), orderBy("xp", "desc"), limit(10))
  );
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack
      gap={5}
      width={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
      pt={5}
    >
      <Stack direction={"row"} alignItems={"center"} gap={1}>
        <Typography
          variant="h5"
          fontWeight={900}
          position={"relative"}
          zIndex={1}
        >
          Leaderboard
        </Typography>
        <LeaderboardRoundedIcon />
      </Stack>
      <Box
        display={"flex"}
        justifyContent={"center"}
        width={"100%"}
        height={isMobileView ? "50vh" : "100%"}
        sx={{ overflowY: "auto" }}
        mb={isMobileView ? 8 : 0}
      >
        <Stack gap={2} width={"100%"} alignItems={"center"}>
          {loading
            ? [1, 2, 3].map((x) => <LinearProgress key={x} />)
            : usersDocs?.map((user, index) => (
                <Stack
                  direction={"row"}
                  key={user.id}
                  width={"100%"}
                  // sx={{
                  //   outline: index === 0 ? "2px solid #c3c3c3" : "unset",
                  //   borderRadius: 2,
                  // }}
                  px={2}
                  alignItems={"center"}
                >
                  <Box
                    flexBasis={"10%"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"left"}
                  >
                    {index === 0 ? (
                      <EmojiEventsRoundedIcon sx={{ color: "gold" }} />
                    ) : (
                      <Typography>
                        {index <= 8 ? `0${index + 1}` : index + 1}
                      </Typography>
                    )}
                  </Box>
                  <Typography flexBasis={"60%"}>
                    {user.email.split("@")[0]}
                  </Typography>
                  {/* <Badge
                    badgeContent={
                      <img
                        src={"xp.png"}
                        alt="xp"
                        style={{ width: "30px", height: "30px" }}
                      />
                    }
                  > */}
                  <Chip
                    label={<Typography> {user.xp} XP</Typography>}
                    sx={{
                      borderRadius: 1,
                      width: "100px",
                    }}
                  />
                  {/* </Badge> */}
                  {/* <Typography flexBasis={"30%"} align="left">
                    {user.xp} XP
                  </Typography> */}
                </Stack>
              ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default Leaderboard;
