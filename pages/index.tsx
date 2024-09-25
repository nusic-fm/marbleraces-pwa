import {
  Avatar,
  AvatarGroup,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  query,
  collection,
  orderBy,
  where,
  limit,
  DocumentData,
  documentId,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, db, logFirebaseEvent } from "../src/services/firebase.service";
import { useCollection } from "react-firebase-hooks/firestore";
import { CoverV1, CoverV1Doc } from "../src/models/Cover";
import { motion, Variants } from "framer-motion";

import { useRouter } from "next/router";
import {
  getAdditionalUserInfo,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { getCover } from "../src/services/db/cover.service";
import Head from "next/head";
import Header from "../src/components/Header";
import RequestInvitation from "../src/components/ Modals/RequestInvitation";
import { createUser, getUserDoc } from "../src/services/db/user.service";
import { UserDoc } from "../src/models/User";
import OpenChallenges from "../src/components/OpenChallenges";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import SelectedCover from "../src/components/SelectedCover";
import Leaderboard from "../src/components/Leaderboard";
import Footer from "../src/components/Footer";
import { GAEventNames } from "../src/models/GAEventNames";

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
export const cardVariants: Variants = {
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
  const [user, authLoading, authError] = useAuthState(auth);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [recordsLimit, setRecordsLimit] = useState(5);
  const [isLatest, setIsLatest] = useState(false);
  const [coversCollectionSnapshot, coversLoading, error] = useCollection(
    getRowsQuery(recordsLimit, isLatest)
  );
  const [coversSnapshotDocs, setCoversSnapshotDocs] = useState<
    QueryDocumentSnapshot<DocumentData>[] | undefined
  >();
  const [songsLoading, setSongsLoading] = useState(true);
  const [bgNo, setBgNo] = useState(15); // TODO
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCoverDoc, setSelectedCoverDoc] = useState<CoverV1Doc | null>(
    null
  );
  const [selectedVoiceObj, setSelectedVoiceObj] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [selectedSkin, setSelectedSkin] = useState("smoke01.png");
  const [selectedTrail, setSelectedTrail] = useState("snow.png");
  const [selectedTracksList, setSelectedTracksList] = useState<string[]>([
    "01",
    "03",
    "06",
    "07",
    "16",
  ]);
  const router = useRouter();
  const { coverId, qBgNo } = router.query;
  const [isCreateChallengeLoading, setIsCreateChallengeLoading] =
    useState(false);
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down("md"));
  const coversScrollRef = useRef<HTMLDivElement>(null);
  const [sortedBgNo] = useState<number[]>(() => {
    const bgNos = [];
    for (let i = 23; i <= 40; i++) {
      bgNos.push(i);
    }
    return bgNos.sort(() => 0.5 - Math.random());
  });
  const [showLeaderboardDrawer, setShowLeaderboardDrawer] = useState(false);
  const [showChallengesDrawer, setShowChallengesDrawer] = useState(false);

  useEffect(() => {
    if (coversCollectionSnapshot?.size) {
      setCoversSnapshotDocs(
        coversCollectionSnapshot.docs.sort(() => 0.5 - Math.random())
      );
      setSongsLoading(false);
    }
  }, [coversCollectionSnapshot]);

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      setCheckingAuth(true);
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
      if (email) {
        (async () => {
          try {
            // The client SDK will parse the code from the link for you.
            const creds = await signInWithEmailLink(
              auth,
              email,
              window.location.href
            );
            const additionalInfo = getAdditionalUserInfo(creds);
            if (additionalInfo?.isNewUser && creds.user.email) {
              const newUserObj = await createUser(
                creds.user.uid,
                creds.user.email
              );
              setUserDoc(newUserObj);
            } else {
              logFirebaseEvent(GAEventNames.USER_SIGN_IN, {
                email: email.split("@")[0],
                domain: email.split("@")[1],
                uid: creds.user.uid,
              });
            }
            window.localStorage.removeItem("emailForSignIn");
            router.push("/", undefined, { shallow: true });
          } catch (e) {
            console.log({ e });
            // alert("Invalid Login, Please try again.");
            router.push("/", undefined, { shallow: true });
          } finally {
            setCheckingAuth(false);
          }
        })();
      } else setCheckingAuth(false);
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
        if (qBgNo) setBgNo(Number(qBgNo));
      })();
    }
  }, [coverId]);

  useEffect(() => {
    if (user) {
      (async () => {
        const doc = await getUserDoc(user.uid, (latestDoc) => {
          if (latestDoc) setUserDoc(latestDoc);
        });
        if (doc) setUserDoc(doc);
      })();
    }
  }, [user]);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Marble Race</title>
      </Head>
      <Stack
        minHeight={"100vh"}
        sx={{
          backgroundImage: `url(/bg_pattern.png)`,
          backgroundSize: "120% 120%",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          backgroundColor: "black",
          // transform: "scale(1.1)",
        }}
      >
        <Header user={userDoc} />
        <Stack direction={"row"}>
          {!isMobileView && activeStep === 0 && (
            <Stack
              direction={"row"}
              width={"30%"}
              px={2}
              height={"calc(100vh - 100px)"}
              sx={{
                boxShadow: "0 0 10px 0 rgba(0,0,0,1)",
                borderRadius: 10,
              }}
            >
              <Leaderboard />
            </Stack>
          )}
          <Stack
            width={isMobileView || activeStep !== 0 ? "100%" : "40%"}
            alignItems={"center"}
            justifyContent="center"
            gap={1}
            height="100%"
          >
            {activeStep === 0 && (
              <>
                <Typography
                  align="center"
                  variant="h4"
                  lineHeight={1.6}
                  // sx={{ background: "black" }}
                  // px={2}
                >
                  AI Marble Races <br /> Are Taking Over
                </Typography>
                <Box
                  // width="100%"
                  height={700}
                  position={"relative"}
                >
                  <Box
                    position={"absolute"}
                    top={0}
                    left={"50%"}
                    display={"flex"}
                    justifyContent={"center"}
                    gap={2}
                    zIndex={9}
                    sx={{
                      transform: "translateX(-50%)",
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        coversScrollRef.current?.scrollTo({
                          top: coversScrollRef.current?.scrollTop - 400,
                          behavior: "smooth",
                        });
                      }}
                    >
                      <ArrowUpwardRoundedIcon htmlColor="#c3c3c3" />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        coversScrollRef.current?.scrollTo({
                          top: coversScrollRef.current?.scrollTop + 400,
                          behavior: "smooth",
                        });
                      }}
                    >
                      <ArrowDownwardRoundedIcon htmlColor="#c3c3c3" />
                    </IconButton>
                  </Box>
                  {coversSnapshotDocs?.length ? (
                    <Box
                      width={window.innerWidth > 500 ? 500 : "100%"} // Responsive
                      sx={{ overflowY: "auto" }}
                      pt={3}
                      mb={"-120px"}
                      height={isMobileView ? 500 : 600}
                      position="relative"
                      ref={coversScrollRef}
                    >
                      {coversSnapshotDocs.map((doc, i) => {
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
                            viewport={{ once: true, amount: 0.6 }}
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
                                width: window.innerWidth > 500 ? 300 : 260,
                                height: 430,
                                display: "flex",
                                alignItems: "start",
                                justifyContent: "center",
                                // background:
                                //   "linear-gradient(306deg, rgb(107, 46, 66), rgb(46, 87, 107))",
                                backgroundImage: `url(https://voxaudio.nusic.fm/marble_race%2Fbackgrounds%2FBG${sortedBgNo[i]}.png?alt=media)`,
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
                                  width={"100%"}
                                >
                                  {coverDoc.title}
                                </Typography>
                                <AvatarGroup
                                  max={6}
                                  sx={{
                                    mt: 2,
                                    ".MuiAvatar-colorDefault": {
                                      backgroundColor: "transparent",
                                      width: isMobileView ? 45 : 50,
                                      height: isMobileView ? 45 : 50,
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
                                        width: isMobileView ? 45 : 50,
                                        height: isMobileView ? 45 : 50,
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
                                      logFirebaseEvent(
                                        GAEventNames.COVER_SELECTED,
                                        {
                                          coverId: id,
                                          title: coverDoc.title,
                                        }
                                      );
                                      setSelectedCoverDoc({ ...coverDoc, id });
                                      setSelectedVoiceObj({
                                        id: coverDoc.voices[0].id,
                                        name: coverDoc.voices[0].name,
                                      });
                                      setBgNo(sortedBgNo[i]);
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

                  <Typography
                    align="center"
                    variant="h4"
                    lineHeight={1.8}
                    mt={"150px"}
                  >
                    Play Test Now!
                  </Typography>
                </Box>
              </>
            )}
            {activeStep === 1 && selectedCoverDoc && (
              <SelectedCover
                selectedCoverDoc={selectedCoverDoc}
                selectedVoiceObj={selectedVoiceObj}
                setSelectedCoverDoc={setSelectedCoverDoc}
                setSelectedVoiceObj={setSelectedVoiceObj}
                selectedTracksList={selectedTracksList}
                setSelectedTracksList={setSelectedTracksList}
                selectedTrail={selectedTrail}
                setSelectedTrail={setSelectedTrail}
                isMobileView={isMobileView}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                isCreateChallengeLoading={isCreateChallengeLoading}
                setIsCreateChallengeLoading={setIsCreateChallengeLoading}
                user={user}
                userDoc={userDoc}
                bgNo={bgNo}
                selectedSkin={selectedSkin}
              />
            )}
          </Stack>
          {!isMobileView && activeStep === 0 && (
            <Stack
              width={"30%"}
              alignItems={"center"}
              px={2}
              height={"calc(100vh - 100px)"}
              sx={{
                boxShadow: "0 0 10px 0 rgba(0,0,0,1)",
                borderRadius: 10,
              }}
            >
              {activeStep === 0 && (
                <OpenChallenges userUid={user?.uid} email={userDoc?.email} />
              )}
            </Stack>
          )}
        </Stack>
        <RequestInvitation
          show={activeStep === 1 && !user && !authLoading && !checkingAuth}
          redirectUrl={
            typeof window !== "undefined"
              ? window.location.origin +
                `?coverId=${selectedCoverDoc?.id}&qBgNo=${bgNo}`
              : `https://marblerace.ai?coverId=${selectedCoverDoc?.id}&qBgNo=${bgNo}`
          }
        />
      </Stack>
      <Drawer
        open={showLeaderboardDrawer}
        anchor="bottom"
        onClose={() => setShowLeaderboardDrawer(false)}
      >
        <Leaderboard />
      </Drawer>
      <Drawer
        open={showChallengesDrawer}
        anchor="bottom"
        onClose={() => setShowChallengesDrawer(false)}
      >
        <OpenChallenges userUid={user?.uid} email={userDoc?.email} />
      </Drawer>
      {isMobileView && (
        <Footer
          onHomeClick={() => {
            router.push("/");
            setActiveStep(0);
            setShowLeaderboardDrawer(false);
            setShowChallengesDrawer(false);
          }}
          onLeaderboardClick={() => {
            setShowLeaderboardDrawer(true);
            setShowChallengesDrawer(false);
          }}
          onChallengesClick={() => {
            setShowChallengesDrawer(true);
            setShowLeaderboardDrawer(false);
          }}
        />
      )}
    </>
  );
};

export default Index;
