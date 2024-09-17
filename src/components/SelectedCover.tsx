import { LoadingButton } from "@mui/lab";
import {
  Stack,
  Typography,
  Avatar,
  Divider,
  Box,
  IconButton,
  Button,
  MenuItem,
  Menu,
  Badge,
  Backdrop,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import router from "next/router";
import {
  getBackgroundPath,
  getVoiceAvatarPath,
  getTrailPath,
} from "../helpers";
import { createChallenge } from "../services/db/challenge.service";
import { logFirebaseEvent } from "../services/firebase.service";
import SelectRacetracks from "./SelectRacetracks";
import { CoverV1Doc } from "../models/Cover";
import { User } from "firebase/auth";
import { UserDoc } from "../models/User";
import { cardVariants } from "../../pages";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { canvasElemWidth } from "../../pages/challenges/[challengeId]";
import dynamic from "next/dynamic";
import { IRefPhaserGame } from "../models/Phaser";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import { downloadAudioFiles, stopAndDestroyPlayers } from "../hooks/useTonejs";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { updateUserProfile } from "../services/db/user.service";
import { increment, serverTimestamp } from "firebase/firestore";
import { createSinglePlay } from "../services/db/singlePlays.service";

type Props = {
  selectedCoverDoc: CoverV1Doc;
  selectedVoiceObj: {
    name: string;
    id: string;
  } | null;
  setSelectedCoverDoc: Dispatch<SetStateAction<CoverV1Doc | null>>;
  setSelectedVoiceObj: Dispatch<
    SetStateAction<{
      name: string;
      id: string;
    } | null>
  >;
  selectedTracksList: string[];
  setSelectedTracksList: Dispatch<SetStateAction<string[]>>;
  selectedTrail: string;
  setSelectedTrail: (trail: string) => void;
  isMobileView: boolean;
  activeStep: number;
  setActiveStep: (step: number) => void;
  isCreateChallengeLoading: boolean;
  setIsCreateChallengeLoading: (loading: boolean) => void;
  user: User | null | undefined;
  userDoc: UserDoc | null;
  bgNo: number;
  selectedSkin: string;
};

const AppWithoutSSR = dynamic(
  () => import("../../src/components/GameComponent"),
  {
    ssr: false,
  }
);

const SelectedCover = (props: Props) => {
  const {
    selectedCoverDoc,
    selectedVoiceObj,
    setSelectedVoiceObj,
    selectedTracksList,
    setSelectedTracksList,
    selectedTrail,
    setSelectedTrail,
    isMobileView,
    activeStep,
    setActiveStep,
    isCreateChallengeLoading,
    setIsCreateChallengeLoading,
    user,
    userDoc,
    bgNo,
    selectedSkin,
    setSelectedCoverDoc,
  } = props;
  const [showPlayMode, setShowPlayMode] = useState(false);
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [secondaryVoiceObj, setSecondaryVoiceObj] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [ready, setReady] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [resultLoading, setResultLoading] = useState(false);

  const downloadAndPlay = async () => {
    if (isDownloading) return;
    if (!secondaryVoiceObj) {
      alert("Choose a Voice to Play the Race");
      return;
    }
    if (selectedVoiceObj && secondaryVoiceObj) {
      const voices = [selectedVoiceObj, secondaryVoiceObj].map((v) => ({
        id: v.id,
        name: v.name,
        avatar: `https://voxaudio.nusic.fm/${encodeURIComponent(
          "voice_models/avatars/"
        )}${v.id}?alt=media`,
      }));
      setIsDownloading(true);
      await downloadAudioFiles(
        [
          `https://voxaudio.nusic.fm/covers/${selectedCoverDoc.id}/instrumental.mp3`,
          ...voices.map(
            (v) =>
              `https://voxaudio.nusic.fm/covers/${selectedCoverDoc.id}/${v.id}.mp3`
          ),
        ],
        (progress: number) => {
          console.log("progress", progress);
          setDownloadProgress(progress);
        }
      );
      setIsDownloading(false);
      //   logFirebaseEvent("challenge_play_started", {
      //     challengeId,
      //     coverId: challenge?.coverId,
      //     voiceId: challenge?.voices[0].id,
      //     voiceName: challenge?.voices[0].name,
      //     email: user?.email,
      //     chosenVoiceId: challenge?.voices[1].id,
      //     chosenVoiceName: challenge?.voices[1].name,
      //   });
      setReady(true);
    }
  };

  const goBack = (goToHome?: boolean) => {
    setShowPlayMode(false);
    setReady(false);
    setIsDownloading(false);
    setSecondaryVoiceObj(null);
    phaserRef.current?.game?.destroy(true);
    stopAndDestroyPlayers();
    if (goToHome) {
      router.push("/", undefined, { shallow: false });
    }
  };

  if (showPlayMode) {
    return (
      <Stack>
        <Typography
          align="center"
          variant="h5"
          sx={{
            background:
              "linear-gradient(270deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%) text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          {selectedCoverDoc.title}
        </Typography>
        <Stack
          mt={2}
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          width={isMobileView ? "100vw" : "100%"}
          height={700}
          flexWrap={"wrap"}
          gap={2}
          position={"relative"}
        >
          <Box
            position={"absolute"}
            top={"100%"}
            left={"50%"}
            sx={{ transform: "translate(-50%, -50%)" }}
          >
            <Stack direction={"row"} gap={1} alignItems={"center"}>
              {!ready && (
                <IconButton onClick={() => goBack(false)}>
                  <ArrowBackRoundedIcon />
                </IconButton>
              )}
              <Button
                variant="contained"
                onClick={() => {
                  if (ready) {
                    goBack();
                  } else {
                    if (user) downloadAndPlay();
                    // else if (user) {
                    //   logFirebaseEvent("challenge_play_clicked", {
                    //     challengeId,
                    //     coverId: challenge?.coverId,
                    //     voiceId: challenge?.voices[0].id,
                    //     voiceName: challenge?.voices[0].name,
                    //     email: user?.email,
                    //     error: "Choose a Voice to Play the Race",
                    //   });
                    //   alert("Choose a Voice to Play the Race");
                    // } else {
                    //   logFirebaseEvent("challenge_play_clicked", {
                    //     challengeId,
                    //     coverId: challenge?.coverId,
                    //     voiceId: challenge?.voices[0].id,
                    //     voiceName: challenge?.voices[0].name,
                    //     error: "Sign In to play the Challenge",
                    //   });
                    //   alert("Sign In to play the Challenge");
                    // }
                  }
                }}
                color={ready ? "error" : "success"}
              >
                {ready ? "Stop Game" : "Start Game"}
              </Button>
            </Stack>
          </Box>
          <Box
            width={canvasElemWidth}
            height={(canvasElemWidth * 16) / 9}
            sx={{
              background: ready
                ? "unset"
                : `url(${getBackgroundPath(bgNo.toString())})`,
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              // borderRadius: 8,
            }}
            display="flex"
            alignItems={"start"}
            justifyContent={"center"}
          >
            <Backdrop
              sx={(theme) => ({
                color: "#fff",
                zIndex: 9,
                width: "100vw",
                height: "100vh",
              })}
              open={resultLoading}
            >
              <Stack justifyContent={"center"}>
                <Typography variant="h6" fontWeight={900}>
                  Loading Results
                </Typography>
                <LinearProgress color="inherit" />
              </Stack>
            </Backdrop>
            {ready && userDoc ? (
              <AppWithoutSSR
                ref={phaserRef}
                challenge={{
                  id: "",
                  bgId: bgNo.toString(),
                  skinId: selectedSkin,
                  trailpath: selectedTrail,
                  title: selectedCoverDoc.title,
                  coverId: selectedCoverDoc.id,
                  voices: [
                    {
                      name: selectedVoiceObj?.name || "",
                      id: selectedVoiceObj?.id || "",
                    },
                    {
                      name: secondaryVoiceObj?.name || "",
                      id: secondaryVoiceObj?.id || "",
                    },
                  ],
                  tracksList: selectedTracksList,
                  creatorUserObj: { id: "", email: "" },
                  creatorUid: "",
                  invites: {},
                }}
                // musicStartOffset={30}
                // skinPath={getSkinPath(challenge.skinId)}
                // backgroundPath={getBackgroundPath(challenge.bgId)}
                // selectedTracks={challenge.tracksList.slice(0, 4)}
                // noOfRaceTracks={4}
                // gravityY={0.5}
                canvasElemWidth={canvasElemWidth}
                onGameComplete={async (
                  win: boolean,
                  coverDocId: string,
                  videoBlob: Blob
                ) => {
                  if (userDoc) {
                    setResultLoading(true);
                    // const videoUrl = await uploadChallengeVideo(
                    //   videoBlob,
                    //   coverDocId,
                    //   userDoc.uid
                    // );
                    if (win) {
                      await updateUserProfile(userDoc.uid, {
                        xp: increment(500),
                      });
                    }
                    await createSinglePlay({
                      email: userDoc.email,
                      userId: userDoc.uid,
                      coverId: selectedCoverDoc.id,
                      win,
                      voices: [
                        {
                          id: selectedVoiceObj?.id || "",
                          name: selectedVoiceObj?.name || "",
                        },
                        {
                          id: secondaryVoiceObj?.id || "",
                          name: secondaryVoiceObj?.name || "",
                        },
                      ],
                    });
                    setResultLoading(false);
                    setTimeout(() => {
                      goBack(true);
                    }, 1000);
                  }
                }}
                userDoc={userDoc}
                // enableMotion={false}
                // trailPath={challenge.trailpath}
                // trailsLifeSpace={300}
                // trailEndSize={0.5}
                // trailsOpacity={0.5}
                // recordDuration={60000}
                // isRecord={false} // TODO
              />
            ) : (
              <Stack
                alignItems={"center"}
                py={8}
                width="100%"
                gap={4}
                sx={{
                  background: "rgba(0,0,0,0.8)",
                }}
              >
                <Typography
                  height={"100%"}
                  width={"100%"}
                  display="flex"
                  justifyContent={"center"}
                  variant="h6"
                  align="center"
                >
                  {selectedCoverDoc.title}
                </Typography>
                {isDownloading ? (
                  <LinearProgressWithLabel
                    value={downloadProgress}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                ) : (
                  <Stack gap={2}>
                    <Stack
                      direction={"row"}
                      alignItems="center"
                      gap={2}
                      justifyContent="center"
                    >
                      <Badge
                        badgeContent={<StarRoundedIcon htmlColor="gold" />}
                        color="primary"
                      >
                        <Avatar
                          src={`https://voxaudio.nusic.fm/${encodeURIComponent(
                            "voice_models/avatars/thumbs/"
                          )}${selectedVoiceObj?.id}_200x200?alt=media`}
                          key={selectedVoiceObj?.id}
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                          onClick={() => {}}
                        />
                      </Badge>

                      <Typography variant="h6" fontWeight={900}>
                        VS
                      </Typography>
                      <IconButton
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                        }}
                      >
                        <Badge
                          badgeContent="Change"
                          sx={{
                            // Set badge Background
                            "& .MuiBadge-badge": {
                              background: "#c3c3c3",
                              color: "black",
                            },
                          }}
                        >
                          <Avatar
                            src={`https://voxaudio.nusic.fm/${encodeURIComponent(
                              "voice_models/avatars/thumbs/"
                            )}${secondaryVoiceObj?.id}_200x200?alt=media`}
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: "50%",
                              cursor: "pointer",
                            }}
                          />
                        </Badge>
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={!!anchorEl}
                        onClose={() => setAnchorEl(null)}
                        transformOrigin={{
                          horizontal: "left",
                          vertical: "top",
                        }}
                        anchorOrigin={{
                          horizontal: "left",
                          vertical: "bottom",
                        }}
                      >
                        {selectedCoverDoc.voices
                          .filter((v) => v.id !== selectedVoiceObj?.id)
                          .map((voice) => (
                            <MenuItem
                              key={voice.id}
                              value={voice.id}
                              onClick={() => {
                                setSecondaryVoiceObj({
                                  id: voice.id,
                                  name: voice.name,
                                });
                                setAnchorEl(null);
                              }}
                            >
                              <Avatar
                                src={getVoiceAvatarPath(voice.id)}
                                sx={{
                                  width: 45,
                                  height: 45,
                                  borderRadius: "50%",
                                  mr: 1,
                                }}
                              />
                              {voice.name}
                            </MenuItem>
                          ))}
                      </Menu>
                      {/* {secondaryVoiceObj ? (
                      <Avatar
                        src={`https://voxaudio.nusic.fm/${encodeURIComponent(
                          "voice_models/avatars/thumbs/"
                        )}${secondaryVoiceObj?.id}_200x200?alt=media`}
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setSecondaryVoiceObj(null);
                        }}
                      />
                    ) : (
                      <Select
                        onChange={(e) => {
                          const voice = selectedCoverDoc.voices.find(
                            (v) => v.id === e.target.value
                          );
                          if (voice) {
                            setSecondaryVoiceObj(voice);
                          }
                        }}
                      >
                        {selectedCoverDoc.voices
                          .filter((v) => v.id !== selectedVoiceObj?.id)
                          .map((voice) => (
                            <MenuItem key={voice.id} value={voice.id}>
                              <Avatar
                                src={getVoiceAvatarPath(voice.id)}
                                sx={{
                                  width: 45,
                                  height: 45,
                                  borderRadius: "50%",
                                  mr: 1,
                                }}
                              />
                              {voice.name}
                            </MenuItem>
                          ))}
                      </Select>
                    )} */}
                    </Stack>
                  </Stack>
                )}
              </Stack>
            )}
          </Box>
        </Stack>
      </Stack>
    );
  }
  return (
    <Stack
      direction={"row"}
      justifyContent={isMobileView ? "center" : "unset"}
      alignItems={"center"}
      width={isMobileView ? "100%" : 800}
      height={700}
      flexWrap={"wrap"}
      gap={2}
    >
      {!isMobileView && (
        <motion.div
          style={{
            fontSize: 164,
            width: 300,
            height: 430,
            display: "flex",
            alignItems: "start",
            justifyContent: "center",
            // background:
            //   "linear-gradient(306deg, rgb(107, 46, 66), rgb(46, 87, 107))",
            backgroundImage: `url(${getBackgroundPath(bgNo.toString())}`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 20,
            boxShadow: `0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075),
                      0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075),
                      0 0 16px hsl(0deg 0% 0% / 0.075)`,
            // transformOrigin: "10% 60%",
          }}
          variants={cardVariants}
        >
          <Stack alignItems={"center"}>
            <Typography
              variant="h6"
              align="center"
              sx={{
                background: "rgba(0,0,0,0.8)",
                overflow: "hidden",
              }}
              mt={2}
              height="4.2rem"
            >
              {selectedCoverDoc.title}
            </Typography>
          </Stack>
        </motion.div>
      )}
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
        mx={isMobileView ? 0 : "auto"}
      >
        <Stack gap={2} alignItems="center">
          <Stack gap={2} alignItems="center">
            <Typography align="center" variant="h5">
              Choose your Voice
            </Typography>
            <Stack
              direction={"row"}
              gap={2}
              alignItems="center"
              sx={{ overflowX: "auto" }}
              width={isMobileView ? "90vw" : 400}
              py={2}
              justifyContent={"flex-start"}
              px={isMobileView ? 2 : 0}
            >
              {selectedCoverDoc.voices.map((voice) => (
                <Badge
                  key={voice.id}
                  badgeContent={
                    selectedVoiceObj?.id === voice.id ? (
                      <StarRoundedIcon htmlColor="gold" />
                    ) : (
                      0
                    )
                  }
                  color="primary"
                >
                  <Avatar
                    key={voice.id}
                    src={getVoiceAvatarPath(voice.id)}
                    sx={{
                      width: isMobileView ? 50 : 60,
                      height: isMobileView ? 50 : 60,
                      borderRadius: "50%",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={() =>
                      setSelectedVoiceObj({
                        id: voice.id,
                        name: voice.name,
                      })
                    }
                  />{" "}
                </Badge>
              ))}
            </Stack>
          </Stack>
          <Divider />
          <Box maxWidth={isMobileView ? "100%" : 380}>
            <SelectRacetracks
              selectedTracksList={selectedTracksList}
              setSelectedTracksList={setSelectedTracksList}
            />
          </Box>
          <Stack gap={2}>
            <Typography align="center" variant="h6">
              Choose your Trail
            </Typography>
            <Stack
              direction={"row"}
              gap={1}
              alignItems="center"
              justifyContent={"center"}
            >
              {["stars_01.png", "snow.png"].map((name) => (
                <Avatar
                  key={name}
                  src={getTrailPath(name)}
                  sx={{
                    // width: 50,
                    // height: 50,
                    // borderRadius: "50%",
                    objectFit: "cover",
                    cursor: "pointer",
                    outline:
                      name === selectedTrail ? "1px solid white" : "unset",
                  }}
                  onClick={() => setSelectedTrail(name)}
                />
              ))}
            </Stack>
          </Stack>
          <Box my={4} position="relative">
            <Box position={"absolute"} top={0} left={-45}>
              <IconButton
                onClick={() => {
                  router.push("/", undefined, { shallow: true });
                  setActiveStep(0);
                  setSelectedCoverDoc(null);
                  setSelectedVoiceObj(null);
                }}
              >
                <ArrowBackRoundedIcon />
              </IconButton>
            </Box>
            <Box display={"flex"} gap={2}>
              <Button
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(43deg, rgb(65, 88, 208) 0%, rgb(200, 80, 192) 46%, rgb(255, 204, 112) 100%)",
                }}
                onClick={() => {
                  setShowPlayMode(true);
                  const otherVoices = selectedCoverDoc.voices.filter(
                    (v) => v.id !== selectedVoiceObj?.id
                  );
                  const selectRandomSecondaryVoice =
                    otherVoices[Math.floor(Math.random() * otherVoices.length)];
                  setSecondaryVoiceObj({
                    id: selectRandomSecondaryVoice.id,
                    name: selectRandomSecondaryVoice.name,
                  });
                }}
              >
                Play
              </Button>
              <Divider orientation="vertical" flexItem />
              <LoadingButton
                loading={isCreateChallengeLoading}
                variant="outlined"
                color="info"
                // sx={{
                //   background:
                //     "linear-gradient(43deg, rgb(65, 88, 208) 0%, rgb(200, 80, 192) 46%, rgb(255, 204, 112) 100%)",
                // }}
                size="large"
                onClick={async () => {
                  if (selectedVoiceObj && user) {
                    setIsCreateChallengeLoading(true);
                    const challengeId = await createChallenge({
                      bgId: bgNo.toString(),
                      skinId: selectedSkin,
                      title: selectedCoverDoc.title,
                      coverId: selectedCoverDoc.id,
                      trailpath: selectedTrail,
                      creatorUserObj: {
                        id: user.uid,
                        email: user.email,
                      },
                      voices: [{ ...selectedVoiceObj }],
                      tracksList: selectedTracksList,
                      creatorUid: user.uid,
                      invites: {},
                    });
                    logFirebaseEvent("challenge_created", {
                      coverId: selectedCoverDoc.id,
                      coverTitle: selectedCoverDoc.title,
                      voiceId: selectedVoiceObj.id,
                      voiceName: selectedVoiceObj.name,
                      bgNo: bgNo,
                      skinId: selectedSkin,
                      trailpath: selectedTrail,
                      challengeId,
                      email: user.email,
                    });
                    // setNewChallengeId(challengeId);
                    // TODO: Route
                    // setActiveStep(2);
                    router.push(`/challenges/${challengeId}`);
                  } else alert("Signin and try again");
                }}
              >
                Challenge Friend
              </LoadingButton>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SelectedCover;
