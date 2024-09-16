import { collection, orderBy, query } from "firebase/firestore";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { db, logFirebaseEvent } from "../services/firebase.service";
import { Avatar, Box, Button, Stack, Tooltip, Typography } from "@mui/material";
import { Challenge } from "../models/Challenge";
import { useRouter } from "next/router";
import { getBackgroundPath, getVoiceAvatarPath } from "../helpers";

type Props = { userUid?: string; email?: string };

const OpenChallenges = ({ userUid, email }: Props) => {
  const [challenges, loading, error] = useCollectionOnce(
    query(collection(db, "challenges"), orderBy("createdAt", "desc"))
  );
  const router = useRouter();
  return (
    <Stack
      gap={4}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
      sx={{ overflowY: "auto" }}
    >
      <Typography
        variant="h5"
        fontWeight={900}
        position={"relative"}
        zIndex={1}
      >
        Open Challenges
        <Typography
          component={"span"}
          fontWeight={400}
          p={"5px"}
          borderRadius={2}
          sx={{ background: "rgba(165, 50, 255, 0.8)" }}
          position={"absolute"}
          bottom={0}
          left={0}
          width={"100%"}
          zIndex={-1}
        />
      </Typography>
      <Stack width={"100%"} gap={2}>
        {challenges?.docs.map((challenge) => {
          const challengeDoc = challenge.data() as Challenge;
          const isCompleted = email && challengeDoc.invites[email]?.isCompleted;
          if (isCompleted) return null;
          return (
            <Stack
              key={challenge.id}
              direction={"row"}
              alignItems={"center"}
              gap={2}
            >
              <Stack
                gap={1}
                alignItems={"center"}
                height={50}
                justifyContent={"center"}
                width={50}
                // borderBottom={"2px solid rgba(255,255,255,0.2)"}
                position={"relative"}
                zIndex={1}
                flexShrink={0}
              >
                <Tooltip
                  title={challengeDoc.creatorUserObj?.email?.split("@")[0]}
                >
                  <Typography variant="h6" fontWeight={900}>
                    {challengeDoc.creatorUserObj?.email?.[0].toUpperCase()}
                  </Typography>
                </Tooltip>
                <Box
                  position={"absolute"}
                  bottom={-10}
                  left={0}
                  width={"100%"}
                  height={"100%"}
                  zIndex={-1}
                  sx={{
                    backgroundImage: `url(${getBackgroundPath(
                      challengeDoc.bgId
                    )})`,
                    backgroundSize: "cover",
                    borderRadius: "10px",
                    // backgroundPosition: "center",
                  }}
                />
              </Stack>
              <Stack
                key={challenge.id}
                gap={1}
                alignItems={"center"}
                height={100}
                justifyContent={"center"}
                width={"calc(100% - 80px)"}
                // borderBottom={"2px solid rgba(255,255,255,0.2)"}
                position={"relative"}
                zIndex={1}
              >
                {/* <Box
                  position={"absolute"}
                  bottom={-10}
                  left={0}
                  width={"100%"}
                  height={"10px"}
                  zIndex={-1}
                  sx={{
                    backgroundImage: `url(${getBackgroundPath(
                      challengeDoc.bgId
                    )})`,
                    backgroundSize: "cover",
                    // backgroundPosition: "center",
                  }}
                /> */}

                <Typography
                  align="center"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%",
                    // backdropFilter: "blur(10px)",
                  }}
                  variant="body1"
                >
                  {challenge.data().title}
                </Typography>
                <Stack
                  direction={"row"}
                  gap={2}
                  alignItems={"center"}
                  justifyContent={"center"}
                  width={"100%"}
                  // sx={{ backdropFilter: "blur(10px)" }}
                >
                  <Stack
                    direction={"row"}
                    gap={1}
                    alignItems={"center"}
                    width={"50%"}
                  >
                    <Avatar
                      src={getVoiceAvatarPath(challengeDoc.voices[0].id)}
                      sx={{ width: 30, height: 30 }}
                    />
                    <Typography
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {challengeDoc.voices[0].name}
                    </Typography>
                  </Stack>
                  {/* {userUid !== challengeDoc.creatorUid &&
                  email &&
                  challengeDoc.invites[email]?.isCompleted ? (
                    <Chip label="Completed" color="success" size="small" />
                  ) : (
                  )} */}
                  <Button
                    variant="outlined"
                    size="small"
                    color="info"
                    onClick={() => {
                      if (userUid === challengeDoc.creatorUid) {
                        logFirebaseEvent("view_my_challenge", {
                          challengeId: challenge.id,
                          userUid,
                        });
                      } else {
                        logFirebaseEvent("play_open_challenge", {
                          challengeId: challenge.id,
                          userUid,
                        });
                      }
                      router.push(`challenges/${challenge.id}`);
                    }}
                  >
                    {userUid === challengeDoc.creatorUid ? "View" : "Play"}
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default OpenChallenges;
