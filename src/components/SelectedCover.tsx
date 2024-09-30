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
  FormControlLabel,
  Checkbox,
  Switch,
} from "@mui/material";
import { motion } from "framer-motion";
import router from "next/router";
import {
  getBackgroundPath,
  getVoiceAvatarPath,
  getTrailPath,
  TRAILS_SELECTION,
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
import dynamic from "next/dynamic";
import { IRefPhaserGame } from "../models/Phaser";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import {
  downloadAudioFiles,
  mutePlayers,
  stopAndDestroyPlayers,
  unMutePlayers,
} from "../hooks/useTonejs";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  updateUserActivityTimestamp,
  updateUserProfile,
} from "../services/db/user.service";
import { increment } from "firebase/firestore";
import {
  createSinglePlay,
  updateSinglePlay,
} from "../services/db/singlePlays.service";
import { GAEventNames } from "../models/GAEventNames";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import GameEndSurvey from "./GameEndSurvey";

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
  const [muted, setMuted] = useState(false);
  const canvasElemWidth = window.innerWidth > 414 ? 414 : window.innerWidth;
  const [surveyPlayId, setSurveyPlayId] = useState<string>("");
  const [noOfRaceTracks, setNoOfRaceTracks] = useState(5);
  const [showObstacles, setShowObstacles] = useState<boolean>(() => {
    const showObstacles = localStorage.getItem("showObstacles");
    return showObstacles ? JSON.parse(showObstacles) : true;
  });

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
      logFirebaseEvent(GAEventNames.SINGLE_PLAY_STARTED, {
        coverId: selectedCoverDoc?.id,
        title: selectedCoverDoc?.title,
        voiceId: secondaryVoiceObj.id,
        email: userDoc?.email?.split("@")[0],
        uid: userDoc?.uid,
        chosenVoiceId: selectedVoiceObj.id,
        showObstacles,
        noOfRaceTracks,
        selectedTrail,
      });
      let decresableXp = 0;
      if (noOfRaceTracks === 8) decresableXp -= 25;
      if (noOfRaceTracks === 10) decresableXp -= 50;
      if (showObstacles === false) decresableXp -= 50;
      if (user?.uid)
        updateUserActivityTimestamp(user.uid, "played_single", decresableXp);
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
      <Stack mb={isMobileView ? 8 : 0}>
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
          ref={(r: HTMLDivElement | null) => {
            r?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {ready && (
            <>
              <Box
                position={"absolute"}
                top={isMobileView ? "92%" : "100%"}
                left={"50%"}
                sx={{ transform: "translate(-50%, -50%)" }}
              >
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
                  color={"error"}
                >
                  Stop Game
                </Button>
              </Box>
              <Box
                position={"absolute"}
                top={isMobileView ? "92%" : "100%"}
                right={0}
                sx={{ transform: "translate(-50%, -50%)" }}
              >
                <IconButton
                  onClick={() => {
                    if (muted) unMutePlayers();
                    else mutePlayers();
                    setMuted(!muted);
                    logFirebaseEvent(
                      muted
                        ? GAEventNames.SINGLE_PLAY_UNMUTED
                        : GAEventNames.SINGLE_PLAY_MUTED,
                      {
                        email: userDoc?.email.split("@")[0],
                        uid: userDoc?.uid,
                        title: selectedCoverDoc.title,
                        chosenVoice: selectedVoiceObj?.id,
                        secondaryVoice: secondaryVoiceObj?.id,
                      }
                    );
                  }}
                >
                  {muted ? <VolumeOffRoundedIcon /> : <VolumeUpRoundedIcon />}
                </IconButton>
              </Box>
            </>
          )}
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
                      name: secondaryVoiceObj?.name || "",
                      id: secondaryVoiceObj?.id || "",
                    },
                    {
                      name: selectedVoiceObj?.name || "",
                      id: selectedVoiceObj?.id || "",
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
                noOfRaceTracks={noOfRaceTracks}
                showObstacles={showObstacles}
                gravityY={isMobileView ? 3 * window.devicePixelRatio : 0.8}
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
                    const playId = await createSinglePlay({
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
                      showObstacles,
                      noOfRaceTracks,
                      selectedTrail,
                    });
                    logFirebaseEvent(GAEventNames.SINGLE_PLAY_COMPLETED, {
                      email: userDoc.email.split("@")[0],
                      uid: userDoc.uid,
                      win,
                      playId,
                      showObstacles,
                      noOfRaceTracks,
                      selectedTrail,
                    });
                    setResultLoading(false);
                    setTimeout(() => {
                      setSurveyPlayId(playId);
                    }, 600);
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
                py={isMobileView ? 4 : 8}
                width="100%"
                gap={4}
                sx={{
                  background: "rgba(0,0,0,0.8)",
                }}
              >
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
                      gap={1}
                      justifyContent="center"
                    >
                      <IconButton>
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
                      </IconButton>
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
                    <Stack direction={"row"} gap={1} alignItems={"center"}>
                      <IconButton onClick={() => goBack(false)} size="small">
                        <ArrowBackRoundedIcon fontSize="small" />
                      </IconButton>
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (ready) {
                            goBack();
                          } else {
                            if (user) downloadAndPlay();
                          }
                        }}
                        color={"success"}
                      >
                        Start Game
                      </Button>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            )}
          </Box>
        </Stack>
        <GameEndSurvey
          open={!!surveyPlayId}
          onClose={async (
            rating: number,
            likedFeatures: string[],
            tellUsMore: string
          ) => {
            updateSinglePlay(surveyPlayId, {
              survey: { id: 1, rating, likedFeatures, tellUsMore },
            });
            if (userDoc) {
              await updateUserProfile(userDoc.uid, {
                xp: increment(200),
              });
              setSurveyPlayId("");
            }
            goBack(true);
          }}
        />
      </Stack>
    );
  }
  return (
    <Stack
      direction={"row"}
      justifyContent={isMobileView ? "center" : "unset"}
      alignItems={"center"}
      width={isMobileView ? "100%" : 800}
      minHeight={700}
      flexWrap={"wrap"}
      gap={2}
      mb={isMobileView ? 8 : 0}
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
          variants={cardVariants(isMobileView)}
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
          {isMobileView && (
            <>
              <Typography
                variant="h6"
                align="center"
                sx={{
                  background: "rgba(0,0,0,0.3)",
                  // only show first two lines
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
                my={2}
                // height="4.2rem"
              >
                {selectedCoverDoc.title}
              </Typography>

              <Box display={"flex"} gap={2} mb={1.5}>
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
                      // setNewChallengeId(challengeId);
                      // TODO: Route
                      // setActiveStep(2);
                      router.push(`/challenges/${challengeId}`);
                    } else alert("Signin and try again");
                  }}
                >
                  Challenge Friend
                </LoadingButton>
                <Divider orientation="vertical" flexItem />
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
                      otherVoices[
                        Math.floor(Math.random() * otherVoices.length)
                      ];
                    setSecondaryVoiceObj({
                      id: selectRandomSecondaryVoice.id,
                      name: selectRandomSecondaryVoice.name,
                    });
                    logFirebaseEvent(GAEventNames.CHOOSE_SINGLE_PLAY, {
                      coverId: selectedCoverDoc.id,
                      title: selectedCoverDoc.title,
                      email: user?.email?.split("@")[0],
                    });
                  }}
                >
                  Play
                </Button>
              </Box>
            </>
          )}
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
          <Box maxWidth={isMobileView ? "100%" : 380}>
            <SelectRacetracks
              selectedTracksList={selectedTracksList}
              setSelectedTracksList={setSelectedTracksList}
              noOfRaceTracksState={[noOfRaceTracks, setNoOfRaceTracks]}
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
              {TRAILS_SELECTION.map((name) => (
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
          <Box
            maxWidth={isMobileView ? "100%" : 380}
            display={"flex"}
            gap={2}
            alignItems={"center"}
          >
            <Typography align="center" variant="h6">
              Obstacles
            </Typography>
            <Switch
              checked={showObstacles}
              color={showObstacles ? "success" : "error"}
              onChange={() => {
                setShowObstacles(!showObstacles);
                localStorage.setItem(
                  "showObstacles",
                  JSON.stringify(!showObstacles)
                );
              }}
            />
          </Box>
          <Box my={4} position="relative">
            {!isMobileView && (
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
            )}
            {!isMobileView && (
              <Box display={"flex"} gap={2} mb={1.5}>
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
                      // setNewChallengeId(challengeId);
                      // TODO: Route
                      // setActiveStep(2);
                      router.push(`/challenges/${challengeId}`);
                    } else alert("Signin and try again");
                  }}
                >
                  Challenge Friend
                </LoadingButton>
                <Divider orientation="vertical" flexItem />
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
                      otherVoices[
                        Math.floor(Math.random() * otherVoices.length)
                      ];
                    setSecondaryVoiceObj({
                      id: selectRandomSecondaryVoice.id,
                      name: selectRandomSecondaryVoice.name,
                    });
                    logFirebaseEvent(GAEventNames.CHOOSE_SINGLE_PLAY, {
                      coverId: selectedCoverDoc.id,
                      title: selectedCoverDoc.title,
                      email: user?.email?.split("@")[0],
                    });
                  }}
                >
                  Play
                </Button>
              </Box>
            )}
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SelectedCover;
