import {
  Avatar,
  AvatarGroup,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  query,
  collection,
  orderBy,
  where,
  limit,
  QuerySnapshot,
  DocumentData,
  documentId,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../src/services/firebase.service";
import { useCollection } from "react-firebase-hooks/firestore";
import { CoverV1, CoverV1Doc } from "../src/models/Cover";
import { motion, Variants } from "framer-motion";
import SelectRacetracks from "../src/components/SelectRacetracks";
import { createChallenge } from "../src/services/db/challenge.service";
import {
  getBackgroundPath,
  getSkinPath,
  getVoiceAvatarPath,
} from "../src/helpers";
import { useRouter } from "next/router";
import EmailLink from "../src/components/AuthUI/EmailLink";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { getCover } from "../src/services/db/cover.service";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Head from "next/head";

const getRowsQuery = (recordsLimit: number, isLatest: boolean) => {
  if (isLatest) {
    return query(
      collection(db, "covers"),
      orderBy("audioUrl"),
      orderBy("createdAt", "desc"),
      where("audioUrl", "!=", ""),
      limit(recordsLimit)
    );
  } else {
    return query(
      collection(db, "covers"),
      where(documentId(), "in", [
        "PkOBGtGbdyMSEkG0BQ6O",
        "f0pmE4twBXnJmVrJzh18",
        // "ByE2N5MsLcSYpUR8s6a3",
        "YE7LMzWbCKgkLgSKVX9Q",
        "bkvtnO1D4fOUYvzwn0NJ",
        // "abRoiarmwTRMqWTyqSGn",
        "Sey1qVFqitYhnKkddMuQ",
        "RL2bdU5NJOukDwQzzW1s",
        "NAc4aENdcDHIh2k4K5oG",
        "8FbtvPhkC13vo3HnAirx",
        "lsUBEcaYfOidpvjUxpz1",
        "hoZTAYrVO5qYmHz9CZtV",
      ])
    );
  }
};
const cardVariants: Variants = {
  offscreen: {
    y: 300,
  },
  onscreen: {
    y: 50,
    rotate: -10,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};
const Index = () => {
  const [user, loading, authError] = useAuthState(auth);
  const [recordsLimit, setRecordsLimit] = useState(5);
  const [isLatest, setIsLatest] = useState(false);
  const [coversCollectionSnapshot, coversLoading, error] = useCollection(
    getRowsQuery(recordsLimit, isLatest)
  );
  const [coversSnapshot, setCoversSnapshot] = useState<
    QuerySnapshot<DocumentData> | undefined
  >();
  const [songsLoading, setSongsLoading] = useState(true);
  const [bgNo, setBgNo] = useState(-1);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCoverDoc, setSelectedCoverDoc] = useState<CoverV1Doc | null>(
    null
  );
  const [selectedVoiceObj, setSelectedVoiceObj] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [selectedSkin, setSelectedSkin] = useState("smoke01.png");
  const [selectedTracksList, setSelectedTracksList] = useState<string[]>([
    "01",
    "03",
    "06",
    "07",
    "16",
  ]);
  const router = useRouter();
  const { coverId } = router.query;

  useEffect(() => {
    if (coversCollectionSnapshot?.size) {
      setCoversSnapshot(coversCollectionSnapshot);
      setSongsLoading(false);
    }
  }, [coversCollectionSnapshot]);

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      if (email)
        (async () => {
          try {
            // The client SDK will parse the code from the link for you.
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem("emailForSignIn");
            router.push("/", undefined, { shallow: true });
            window.localStorage.removeItem("email");
          } catch (e) {
            alert("Invalid Login, Please try again.");
            router.push("/", undefined, { shallow: true });
          }
        })();
    }
  }, []);

  useEffect(() => {
    if (coverId) {
      setActiveStep(1);
      (async () => {
        const coverDoc = await getCover(coverId as string);
        setSelectedCoverDoc(coverDoc);
        setSelectedVoiceObj({
          id: coverDoc.voices[0].id,
          name: coverDoc.voices[0].name,
        });
      })();
    }
  }, [coverId]);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Marble Race</title>
      </Head>
      <Stack
        height={"100vh"}
        sx={{
          backgroundImage: `url('bg_pattern.png')`,
          backgroundSize: "120% 120%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          // transform: "scale(1.1)",
        }}
      >
        {user && (
          <Box display={"flex"} alignItems={"center"} width={"100%"} p={2}>
            <Stack direction={"row"} gap={2} alignItems="center">
              <img src="favicon.ico" alt="" style={{ width: 40 }} />
              <Typography variant="h5" textTransform={"uppercase"}>
                Marble Races
              </Typography>
            </Stack>
            <Chip label={user.email} sx={{ ml: "auto" }} />
          </Box>
        )}
        <Stack
          width={"100%"}
          alignItems={"center"}
          justifyContent="center"
          gap={1}
          height="100%"
        >
          <Typography align="center" variant="h4">
            Create a Challenge
          </Typography>
          {activeStep === 0 && (
            <Box
              // width="100%"
              height={700}
            >
              {coversSnapshot?.docs.length ? (
                <Box
                  width={500}
                  sx={{ overflowY: "auto" }}
                  pt={3}
                  mb={"-120px"}
                  height={600}
                  position="relative"
                >
                  {coversSnapshot.docs.map((doc, i) => {
                    const id = doc.id;
                    const coverDoc = doc.data() as CoverV1;
                    return (
                      <motion.div
                        key={id}
                        style={{
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          paddingTop: 20,
                          marginBottom: -40,
                        }}
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.8 }}
                      >
                        <Box
                          position={"absolute"}
                          bottom={0}
                          left={0}
                          right={0}
                          top={0}
                          style={{
                            backgroundImage: `url(${coverDoc.metadata.videoThumbnail})`,
                            clipPath:
                              'path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")',
                          }}
                        />
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
                            backgroundImage: `url(https://voxaudio.nusic.fm/marble_race%2Fbackgrounds%2FBG${
                              i + 11
                            }.png?alt=media)`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: 20,
                            boxShadow: `0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075),
                      0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075),
                      0 0 16px hsl(0deg 0% 0% / 0.075)`,
                            transformOrigin: "10% 60%",
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
                              {coverDoc.title}
                            </Typography>
                            <AvatarGroup
                              max={6}
                              sx={{
                                mt: 2,
                                ".MuiAvatar-colorDefault": {
                                  backgroundColor: "transparent",
                                  width: 50,
                                  height: 50,
                                  border: "1px solid white",
                                  color: "white",
                                },
                              }}
                            >
                              {coverDoc.voices.map((voice) => (
                                <Avatar
                                  key={voice.id}
                                  src={`https://voxaudio.nusic.fm/${encodeURIComponent(
                                    "voice_models/avatars/thumbs/"
                                  )}${voice.id}_200x200?alt=media`}
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                  }}
                                />
                              ))}
                            </AvatarGroup>
                            <Box mt={4}>
                              <Button
                                variant="contained"
                                sx={{
                                  background:
                                    "linear-gradient(43deg, rgb(65, 88, 208) 0%, rgb(200, 80, 192) 46%, rgb(255, 204, 112) 100%)",
                                }}
                                size="large"
                                onClick={() => {
                                  setSelectedCoverDoc({ ...coverDoc, id });
                                  setSelectedVoiceObj({
                                    id: coverDoc.voices[0].id,
                                    name: coverDoc.voices[0].name,
                                  });
                                  setBgNo(i + 11);
                                  setActiveStep(1);
                                  router.push(`?coverId=${id}`, undefined, {
                                    shallow: true,
                                  });
                                }}
                              >
                                Play
                              </Button>
                            </Box>
                          </Stack>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </Box>
              ) : (
                <Box
                  display={"flex"}
                  gap={5}
                  flexDirection="column"
                  alignItems={"center"}
                  justifyContent="center"
                  p={4}
                >
                  {/* <Skeleton variant="rounded" width={230} height={230} />
              <Skeleton variant="rounded" width="100%" height={30} />
              <Skeleton variant="rounded" width="100%" height={80} />
              <Skeleton variant="circular" width={80} height={80} />
              <Skeleton variant="rounded" width="80%" height={40} />
              <Skeleton
                variant="rounded"
                width={230}
                height={60}
                sx={{ mt: 4 }}
              /> */}
                </Box>
              )}
              {/* <Box
              display={"flex"}
              mt="130px"
              justifyContent={"center"}
              alignItems="center"
              p={1}
              gap={2}
            >
              <IconButton onClick={() => bgNo > 11 && setBgNo(bgNo - 1)}>
                <ArrowBackIosRoundedIcon />
              </IconButton>
              <Typography>Background</Typography>
              <IconButton onClick={() => bgNo < 41 && setBgNo(bgNo + 1)}>
                <ArrowForwardIosRoundedIcon />
              </IconButton>
            </Box> */}
            </Box>
          )}
          {activeStep === 1 && selectedCoverDoc && (
            <Stack
              direction={"row"}
              // justifyContent="space-between"
              alignItems={"center"}
              width={800}
              height={700}
              pt={3}
            >
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
              <Stack direction={"row"} alignItems={"center"} gap={2} mx="auto">
                <Stack gap={2} alignItems="center">
                  <Stack gap={2}>
                    <Typography align="center" variant="h5">
                      Choose your Voice
                    </Typography>
                    <Stack direction={"row"} gap={1} alignItems="center">
                      {selectedCoverDoc.voices.map((voice) => (
                        <Avatar
                          key={voice.id}
                          src={getVoiceAvatarPath(voice.id)}
                          sx={{
                            width: 70,
                            height: 70,
                            borderRadius: "50%",
                            cursor: "pointer",
                            outline:
                              voice.id === selectedVoiceObj?.id
                                ? "3px solid white"
                                : "unset",
                          }}
                          onClick={() =>
                            setSelectedVoiceObj({
                              id: voice.id,
                              name: voice.name,
                            })
                          }
                        />
                      ))}
                    </Stack>
                  </Stack>
                  <Divider />
                  <Box maxWidth={380}>
                    <SelectRacetracks
                      selectedTracksList={selectedTracksList}
                      setSelectedTracksList={setSelectedTracksList}
                    />
                  </Box>
                  <Stack gap={2}>
                    <Typography align="center" variant="h6">
                      Choose your Skin
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
                          src={getSkinPath(name)}
                          sx={{
                            // width: 50,
                            // height: 50,
                            // borderRadius: "50%",
                            objectFit: "cover",
                            cursor: "pointer",
                            outline:
                              name === selectedSkin
                                ? "1px solid white"
                                : "unset",
                          }}
                          onClick={() => setSelectedSkin(name)}
                        />
                      ))}
                    </Stack>
                  </Stack>
                  <Box mt={4} position="relative">
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
                    <Button
                      variant="contained"
                      sx={{
                        background:
                          "linear-gradient(43deg, rgb(65, 88, 208) 0%, rgb(200, 80, 192) 46%, rgb(255, 204, 112) 100%)",
                      }}
                      size="large"
                      onClick={async () => {
                        if (selectedVoiceObj && user) {
                          const challengeId = await createChallenge({
                            bgId: bgNo.toString(),
                            skinId: selectedSkin,
                            title: selectedCoverDoc.title,
                            coverId: selectedCoverDoc.id,
                            trailpath: "stars_01.png", // TODO
                            userObj: { id: user.uid, email: user.email },
                            voices: [{ ...selectedVoiceObj }],
                            tracksList: selectedTracksList,
                          });
                          // setNewChallengeId(challengeId);
                          // TODO: Route
                          // setActiveStep(2);
                          router.push(`/challenges/${challengeId}`);
                        } else alert("Signin and try again");
                      }}
                    >
                      Create Challenge
                    </Button>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          )}
          {/* {activeStep === 2 && selectedCoverDoc && selectedVoiceObj && (
          <Stack
            direction={"row"}
            justifyContent="center"
            alignItems={"center"}
            width={800}
            height={700}
            pt={3}
          >
            <motion.div
              style={{
                fontSize: 164,
                width: 350,
                height: 600,
                display: "flex",
                alignItems: "start",
                justifyContent: "center",
                // background:
                //   "linear-gradient(306deg, rgb(107, 46, 66), rgb(46, 87, 107))",
                backgroundImage: `url(https://voxaudio.nusic.fm/marble_race%2Fbackgrounds%2FBG${bgNo}.png?alt=media)`,
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
                <Stack
                  gap={1}
                  direction="row"
                  alignItems={"center"}
                  justifyContent="center"
                  height={100}
                  mt={4}
                >
                  <Avatar
                    src={`https://voxaudio.nusic.fm/${encodeURIComponent(
                      "voice_models/avatars/thumbs/"
                    )}${selectedVoiceObj.id}_200x200?alt=media`}
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  />
                  <Typography variant="h4">VS</Typography>
                  <Avatar
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                    }}
                  />
                </Stack>
                <Box mt={6}>
                  <Typography
                    component={"a"}
                    href={`${location.origin}/challenges/${newChallengeId}`}
                  >
                    {newChallengeId}
                  </Typography>
                </Box>
              </Stack>
            </motion.div>
          </Stack>
        )} */}
        </Stack>
        <Dialog open={activeStep === 1 && !user}>
          <DialogTitle>Provide your Email to Create a Challenge</DialogTitle>
          <DialogContent>
            <EmailLink
              url={`https://marblerace.ai?coverId=${selectedCoverDoc?.id}`}
            />
          </DialogContent>
        </Dialog>
      </Stack>
    </>
  );
};

export default Index;
