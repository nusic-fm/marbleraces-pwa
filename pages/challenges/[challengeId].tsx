import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import type { Challenge, ChallengeDoc } from "../../src/models/Challenge";
import {
  getChallenge,
  updateChallengeInvites,
} from "../../src/services/db/challenge.service";
import LinearProgressWithLabel from "../../src/components/LinearProgressWithLabel";
import {
  downloadAudioFiles,
  stopAndDestroyPlayers,
} from "../../src/hooks/useTonejs";
import {
  getBackgroundPath,
  // getSkinPath,
  validateEmail,
} from "../../src/helpers";
import dynamic from "next/dynamic";
import { IRefPhaserGame } from "../../src/models/Phaser";
import { getCover } from "../../src/services/db/cover.service";
import { CoverV1 } from "../../src/models/Cover";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logFirebaseEvent } from "../../src/services/firebase.service";
import EmailLink from "../../src/components/AuthUI/EmailLink";
import {
  getAdditionalUserInfo,
  isSignInWithEmailLink,
  // sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";
import Header from "../../src/components/Header";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import {
  createUser,
  getUserDoc,
  updateUserProfile,
} from "../../src/services/db/user.service";
import { UserDoc } from "../../src/models/User";
import RequestInvitation from "../../src/components/ Modals/RequestInvitation";
import { increment, serverTimestamp } from "firebase/firestore";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

type Props = {};

const AppWithoutSSR = dynamic(
  () => import("../../src/components/GameComponent"),
  {
    ssr: false,
  }
);

const Challenge = (props: Props) => {
  const router = useRouter();
  const { challengeId } = router.query as { challengeId: string };
  const [challenge, setChallenge] = useState<ChallengeDoc | null>(null);
  const [cover, setCover] = useState<CoverV1 | null>(null);
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [ready, setReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [user, authLoading, authError] = useAuthState(auth);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);

  const canvasElemWidth = 414;

  const downloadAndPlay = async () => {
    if (isDownloading) return;
    if (challenge) {
      const voices = challenge.voices.map((v) => ({
        id: v.id,
        name: v.name,
        avatar: `https://voxaudio.nusic.fm/${encodeURIComponent(
          "voice_models/avatars/"
        )}${v.id}?alt=media`,
      }));
      setIsDownloading(true);
      await downloadAudioFiles(
        [
          `https://voxaudio.nusic.fm/covers/${challenge.coverId}/instrumental.mp3`,
          ...voices.map(
            (v) =>
              `https://voxaudio.nusic.fm/covers/${challenge.coverId}/${v.id}.mp3`
          ),
        ],
        (progress: number) => {
          console.log("progress", progress);
          setDownloadProgress(progress);
        }
      );
      setIsDownloading(false);
      logFirebaseEvent("challenge_play_started", {
        challengeId,
        coverId: challenge?.coverId,
        voiceId: challenge?.voices[0].id,
        voiceName: challenge?.voices[0].name,
        email: user?.email,
        chosenVoiceId: challenge?.voices[0].id,
        chosenVoiceName: challenge?.voices[0].name,
      });
      setReady(true);
    }
  };

  const onGameComplete = async (win: boolean, videoUrl: string) => {
    console.log("onGameComplete", win, videoUrl);
    phaserRef.current?.game?.destroy(true);
    stopAndDestroyPlayers();
    if (userDoc && challenge) {
      // alert(win ? "You Won the Challenge" : "You Lost!");
      if (win) {
        // const newChallenge = {...challenge};
        // if (newChallenge.invites) {
        //   newChallenge.invites[userDoc.email].result = {}
        // }
        // setChallenge({...challenge, invites})
        // TODO: update challenge
        await updateUserProfile(userDoc.uid, { xp: increment(500) });
      } else {
        await updateUserProfile(challenge.creatorUid, { xp: increment(500) });
      }
      await updateChallengeInvites(
        {
          isCompleted: true,
          email: userDoc.email,
          result: {
            winnerId: win ? userDoc.uid : challenge.creatorUid,
            videoUrl,
            updatedAt: serverTimestamp(),
          },
        },
        userDoc.email,
        challengeId
      );
      logFirebaseEvent("challenge_completed", {
        challengeId,
        coverId: challenge?.coverId,
        voiceId: challenge?.voices[0].id,
        voiceName: challenge?.voices[0].name,
        email: user?.email,
        chosenVoiceId: challenge?.voices[0].id,
        chosenVoiceName: challenge?.voices[0].name,
        win,
      });
    }
  };

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      setCheckingAuth(true);
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.

      const loginEnteredEmail = new URLSearchParams(window.location.search).get(
        "loginEnteredEmail"
      );
      const email =
        loginEnteredEmail ||
        window.prompt("Please provide your email for confirmation");
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
            }
            // window.localStorage.removeItem("emailForSignIn");
            router.push(
              typeof window !== "undefined" ? window.location.pathname : "",
              undefined,
              {
                shallow: true,
              }
            );
          } catch (e) {
            // alert("Invalid Login, Please try again.");
            router.push(
              typeof window !== "undefined" ? window.location.pathname : "",
              undefined,
              {
                shallow: true,
              }
            );
          } finally {
            setCheckingAuth(false);
          }
        })();
      } else setCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    if (challengeId) {
      (async () => {
        const challengeDoc = await getChallenge(challengeId, (latestDoc) => {
          latestDoc && setChallenge({ ...latestDoc, id: challengeId });
        });
        if (challengeDoc) {
          setChallenge({ ...challengeDoc, id: challengeId });
          const _cover = await getCover(challengeDoc.coverId);
          setCover(_cover);
          logFirebaseEvent("challenge_viewed", {
            challengeId,
            coverId: challengeDoc?.coverId,
            coverTitle: _cover?.title,
            voiceId: challengeDoc?.voices[0].id,
            voiceName: challengeDoc?.voices[0].name,
            email: user?.email,
          });
        }
        // else {
        //   alert("Challenge doesn't exists");
        // }
        setIsPageLoading(false);
      })();
    }
  }, [challengeId]);

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
        <title>Challenge | AI Marble Race</title>
        <meta
          property="og:title"
          content={"You have been Challenged to AI Marble Race"}
          key="title"
        />
      </Head>
      <Stack
        gap={4}
        sx={{
          backgroundImage: `url(/bg_pattern.png)`,
          backgroundSize: "120% 120%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          // transform: "scale(1.1)",
        }}
        height="100vh"
      >
        <Header user={userDoc} />
        {isPageLoading ? (
          <Stack gap={4} alignItems="center">
            <Box width={"80%"} height={80}>
              <Skeleton
                variant="rectangular"
                height={"100%"}
                width="100%"
                animation="wave"
              ></Skeleton>
            </Box>
            <Box width={"50%"} height={40}>
              <Skeleton
                variant="rectangular"
                height={"100%"}
                animation="wave"
              ></Skeleton>
            </Box>
            <Box width={"414px"} height={700}>
              <Skeleton
                variant="rectangular"
                height={"100%"}
                animation="wave"
              ></Skeleton>
            </Box>
          </Stack>
        ) : challenge ? (
          <Stack gap={2}>
            <Typography
              variant="h5"
              align="center"
              sx={{
                background:
                  "linear-gradient(45deg, #8BFBFF 0%, #C8A4FF 50%, #FFB3D9 100%) text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              {challenge.invites[userDoc?.email || ""]?.isCompleted
                ? `${challenge.creatorUserObj.email?.split("@")[0]} (${
                    challenge.voices[0]?.name
                  }) Vs ${userDoc?.email.split("@")[0]} is Completed!`
                : challenge?.creatorUid === user?.uid
                ? `Your Challenge Has Been Created`
                : `${
                    challenge?.creatorUserObj.email?.split("@")[0]
                  } has Challenged you to Marble Race against ${
                    challenge?.voices[0].name
                  }`}
            </Typography>
            {!challenge.invites[userDoc?.email || ""]?.isCompleted &&
              !ready &&
              (challenge?.creatorUid === user?.uid ? (
                <Stack alignItems={"center"} gap={1}>
                  <Typography variant="subtitle1" align="center">
                    Invite a Friend to join this Challenge
                  </Typography>
                  <Stack
                    direction={"row"}
                    gap={1}
                    justifyContent={"center"}
                    flexWrap={"wrap"}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        const shareData = {
                          title: "AI Marble Race",
                          text: "I challenge you to a Marble Race on AI Marble Race! Check it out here: ",
                          url: `https://marblerace.ai/challenges/${challengeId}`,
                        };
                        if (navigator.share && navigator.canShare(shareData)) {
                          navigator.share(shareData);
                        } else {
                          window.open(
                            `https://wa.me/?text=${encodeURIComponent(
                              `I challenge you to a Marble Race on AI Marble Race! Check it out here: https://marblerace.ai/challenges/${challengeId}`
                            )}`,
                            "_blank"
                          );
                        }
                        logFirebaseEvent("challenge_share_clicked", {
                          challengeId,
                          coverId: challenge?.coverId,
                          voiceId: challenge?.voices[0].id,
                          email: user?.email,
                        });
                      }}
                    >
                      Share Challenge 🔗
                    </Button>
                    <Divider orientation="vertical" flexItem />
                    <TextField
                      // label="email"
                      size="small"
                      type={"email"}
                      color="info"
                      value={enteredEmail}
                      placeholder="enter email here"
                      focused
                      onChange={(e) => setEnteredEmail(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            disabled={sendingEmail}
                            size="small"
                            onClick={async () => {
                              if (sendingEmail) return;
                              if (enteredEmail) {
                                if (!validateEmail(enteredEmail))
                                  return alert("Enter valid Email");
                                else if (enteredEmail === user.email)
                                  return alert("You cannot enter your email");
                                else if (challenge.invites[enteredEmail]) {
                                  return alert(
                                    `You have already invited ${enteredEmail}`
                                  );
                                }
                                setSendingEmail(true);
                                // continueUrl=http://localhost:3000/challenges/m9lhvxube2QBPriHgBPk?loginEnteredEmail%3Dlogesh.r24@gmail.com&lang=en
                                // await sendSignInLinkToEmail(auth, enteredEmail, {
                                //   url:
                                //     typeof window !== "undefined"
                                //       ? window.location.origin +
                                //         `/challenges/${challengeId}?loginEnteredEmail=${enteredEmail}`
                                //       : `https://marblerace.ai/challenges/${challengeId}?loginEnteredEmail=${enteredEmail}`,
                                //   handleCodeInApp: true,
                                // });
                                await axios.post(
                                  `${process.env.NEXT_PUBLIC_VOX_COVER_SERVER}/send-challenge-invitation`,
                                  {
                                    email: enteredEmail,
                                    redirectUrl:
                                      typeof window !== "undefined"
                                        ? window.location.origin +
                                          `/challenges/${challengeId}?loginEnteredEmail=${enteredEmail}`
                                        : `https://marblerace.ai/challenges/${challengeId}?loginEnteredEmail=${enteredEmail}`,
                                    name:
                                      user.email?.split("@")[0] ||
                                      "Marble Race",
                                    voiceName: challenge?.voices[0].name,
                                  }
                                );
                                await updateChallengeInvites(
                                  { email: enteredEmail, isCompleted: false },
                                  enteredEmail,
                                  challengeId
                                );
                                logFirebaseEvent("challenge_invite_sent", {
                                  challengeId,
                                  coverId: challenge?.coverId,
                                  voiceId: challenge?.voices[0].id,
                                  voiceName: challenge?.voices[0].name,
                                  email: user?.email,
                                  invitedEmail: enteredEmail,
                                });
                                setSendingEmail(false);

                                alert(
                                  `Your Challenge has been sent to ${enteredEmail}`
                                );
                                setEnteredEmail("");
                              }
                            }}
                          >
                            {sendingEmail ? (
                              <CircularProgress size={15} />
                            ) : (
                              <SendRoundedIcon fontSize="small" />
                            )}
                          </IconButton>
                          // <LoadingButton
                          //   loading={sendingEmail}
                          //   variant="contained"
                          //   size="small"
                          //   onClick={() => {
                          //     if (sendingEmail) return;
                          //     if (enteredEmail) {
                          //       if (!validateEmail(enteredEmail))
                          //         return alert("Enter valid Email");
                          //       else if (enteredEmail === user.email)
                          //         return alert("You cannot enter your email");
                          //       else if (challenge.invites[enteredEmail]) {
                          //         return alert(
                          //           `You have already invited ${enteredEmail}`
                          //         );
                          //       }
                          //       (async () => {
                          //         setSendingEmail(true);
                          //         // continueUrl=http://localhost:3000/challenges/m9lhvxube2QBPriHgBPk?loginEnteredEmail%3Dlogesh.r24@gmail.com&lang=en
                          //         // await sendSignInLinkToEmail(auth, enteredEmail, {
                          //         //   url:
                          //         //     typeof window !== "undefined"
                          //         //       ? window.location.origin +
                          //         //         `/challenges/${challengeId}?loginEnteredEmail=${enteredEmail}`
                          //         //       : `https://marblerace.ai/challenges/${challengeId}?loginEnteredEmail=${enteredEmail}`,
                          //         //   handleCodeInApp: true,
                          //         // });
                          //         await axios.post(
                          //           `${process.env.NEXT_PUBLIC_VOX_COVER_SERVER}/send-challenge-invitation`,
                          //           {
                          //             email: enteredEmail,
                          //             redirectUrl:
                          //               typeof window !== "undefined"
                          //                 ? window.location.origin +
                          //                   `/challenges/${challengeId}?loginEnteredEmail=${enteredEmail}`
                          //                 : `https://marblerace.ai/challenges/${challengeId}?loginEnteredEmail=${enteredEmail}`,
                          //             name:
                          //               user.email?.split("@")[0] ||
                          //               "Marble Race",
                          //             voiceName: challenge?.voices[0].name,
                          //           }
                          //         );
                          //         await updateChallengeInvites(
                          //           { email: enteredEmail, isCompleted: false },
                          //           enteredEmail,
                          //           challengeId
                          //         );
                          //         logFirebaseEvent("challenge_invite_sent", {
                          //           challengeId,
                          //           coverId: challenge?.coverId,
                          //           voiceId: challenge?.voices[0].id,
                          //           voiceName: challenge?.voices[0].name,
                          //           email: user?.email,
                          //           invitedEmail: enteredEmail,
                          //         });
                          //         setSendingEmail(false);

                          //         alert(
                          //           `Your Challenge has been sent to ${enteredEmail}`
                          //         );
                          //         setEnteredEmail("");
                          //       })();
                          //     }
                          //   }}
                          // >
                          //   Send
                          // </LoadingButton>
                        ),
                      }}
                    />
                  </Stack>
                </Stack>
              ) : (
                <Stack
                  direction={"row"}
                  gap={2}
                  justifyContent="center"
                  alignItems={"center"}
                  flexWrap="wrap"
                >
                  <Typography>Choose your Voice: </Typography>
                  <Stack
                    direction={"row"}
                    justifyContent="start"
                    sx={{ overflowX: "auto" }}
                    width={{ xs: "80%", md: "400px" }}
                  >
                    {cover?.voices
                      .filter(
                        (v) =>
                          !challenge?.voices.map((v) => v.id).includes(v.id)
                      )
                      .map((v) => (
                        <Avatar
                          src={`https://voxaudio.nusic.fm/${encodeURIComponent(
                            "voice_models/avatars/thumbs/"
                          )}${v.id}_200x200?alt=media`}
                          key={v.id}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (challenge && challenge.voices.length < 2) {
                              const newChallenge = { ...challenge };
                              newChallenge.voices.push({
                                id: v.id,
                                name: v.name,
                              });
                              setChallenge(newChallenge);
                            } else if (
                              challenge &&
                              challenge.voices.length === 2
                            ) {
                              const newChallenge = { ...challenge };
                              newChallenge.voices[1] = {
                                id: v.id,
                                name: v.name,
                              };
                              setChallenge(newChallenge);
                            }
                          }}
                        />
                      ))}
                  </Stack>
                </Stack>
              ))}
            <Box
              display={"flex"}
              justifyContent="center"
              alignItems={"start"}
              width={"100%"}
              gap={2}
              flexWrap={"wrap-reverse"}
            >
              {challenge.invites[userDoc?.email || ""]?.isCompleted ? (
                <video
                  src={
                    challenge.invites[userDoc?.email || ""]?.result?.videoUrl
                  }
                  controls
                  width={canvasElemWidth}
                  height={(canvasElemWidth * 16) / 9}
                  autoPlay
                  muted
                />
              ) : (
                <Box
                  width={canvasElemWidth}
                  height={(canvasElemWidth * 16) / 9}
                  sx={{
                    background: ready
                      ? "unset"
                      : challenge
                      ? `url(${getBackgroundPath(challenge.bgId)})`
                      : "unset", // TODO
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    // borderRadius: 8,
                  }}
                  display="flex"
                  alignItems={"start"}
                  justifyContent={"center"}
                >
                  {ready && challenge && userDoc ? (
                    //     <PhaserGame
                    //       ref={phaserRef}
                    //       voices={selectedVoices}
                    //       coverDocId={challenge?.coverId}
                    //       musicStartOffset={30}
                    //       skinPath={getSkinPath(challenge.skinId)}
                    //       backgroundPath={getBackgroundPath(challenge.bgId)}
                    //       selectedTracks={challenge.tracksList.slice(0, 4)}
                    //       noOfRaceTracks={4}
                    //       gravityY={0.5}
                    //       width={canvasElemWidth}
                    //       enableMotion={false}
                    //       trailPath={challenge.trailpath}
                    //       trailsLifeSpace={300}
                    //       trailEndSize={0.5}
                    //       trailsOpacity={0.5}
                    //       recordDuration={60000}
                    //       isRecord={false} // TODO
                    //     />
                    //   );
                    <AppWithoutSSR
                      ref={phaserRef}
                      challenge={challenge}
                      // musicStartOffset={30}
                      // skinPath={getSkinPath(challenge.skinId)}
                      // backgroundPath={getBackgroundPath(challenge.bgId)}
                      // selectedTracks={challenge.tracksList.slice(0, 4)}
                      // noOfRaceTracks={4}
                      // gravityY={0.5}
                      canvasElemWidth={canvasElemWidth}
                      onGameComplete={onGameComplete}
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
                        {challenge?.title}
                      </Typography>
                      {challenge && isDownloading ? (
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
                            <Avatar
                              src={`https://voxaudio.nusic.fm/${encodeURIComponent(
                                "voice_models/avatars/thumbs/"
                              )}${challenge?.voices[0].id}_200x200?alt=media`}
                              key={challenge?.voices[0].id}
                              sx={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                cursor: "pointer",
                              }}
                              onClick={() => {}}
                            />
                            VS
                            <Avatar
                              src={`https://voxaudio.nusic.fm/${encodeURIComponent(
                                "voice_models/avatars/thumbs/"
                              )}${challenge?.voices[1]?.id}_200x200?alt=media`}
                              key={challenge?.voices[1]?.id}
                              sx={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                cursor: "pointer",
                              }}
                              onClick={() => {}}
                            />
                          </Stack>
                          {user?.uid !== challenge?.creatorUserObj.id && (
                            <Button
                              onClick={() => {
                                if (
                                  challenge &&
                                  challenge.voices.length > 1 &&
                                  user
                                )
                                  downloadAndPlay();
                                else if (user) {
                                  logFirebaseEvent("challenge_play_clicked", {
                                    challengeId,
                                    coverId: challenge?.coverId,
                                    voiceId: challenge?.voices[0].id,
                                    voiceName: challenge?.voices[0].name,
                                    email: user?.email,
                                    error: "Choose a Voice to Play the Race",
                                  });
                                  alert("Choose a Voice to Play the Race");
                                } else {
                                  logFirebaseEvent("challenge_play_clicked", {
                                    challengeId,
                                    coverId: challenge?.coverId,
                                    voiceId: challenge?.voices[0].id,
                                    voiceName: challenge?.voices[0].name,
                                    error: "Sign In to play the Challenge",
                                  });
                                  alert("Sign In to play the Challenge");
                                }
                              }}
                              variant="contained"
                              color="primary"
                            >
                              Play
                            </Button>
                          )}
                        </Stack>
                      )}
                    </Stack>
                  )}
                </Box>
              )}
              {challenge.creatorUid === userDoc?.uid && (
                <Stack alignItems={"center"} justifyContent={"start"}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Invites
                  </Typography>
                  {Object.entries(challenge.invites).length > 0 ? (
                    <Stack spacing={1}>
                      {Object.entries(challenge.invites).map(
                        ([email, { isCompleted, result }]) => (
                          <Box
                            key={email}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                            gap={2}
                          >
                            <Tooltip title={email}>
                              <Typography>{email.split("@")[0]}</Typography>
                            </Tooltip>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Chip
                                label={
                                  isCompleted
                                    ? result?.winnerId === challenge.creatorUid
                                      ? "+500 XP"
                                      : "+0 XP"
                                    : "Waiting"
                                }
                                color={
                                  isCompleted
                                    ? result?.winnerId === challenge.creatorUid
                                      ? "success"
                                      : "error"
                                    : "warning"
                                }
                                size="small"
                                sx={{ mr: 1 }}
                              />
                              {isCompleted && result?.videoUrl && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="info"
                                  href={result.videoUrl}
                                  target="_blank"
                                >
                                  Watch It
                                </Button>
                              )}
                              {/* {!isCompleted && (
                                <Tooltip title="Resend Invite">
                                  <IconButton onClick={() => {}} size="small">
                                    <SendRoundedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )} */}
                            </Box>
                          </Box>
                        )
                      )}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No invites sent yet.
                    </Typography>
                  )}
                </Stack>
              )}
            </Box>
          </Stack>
        ) : (
          <Stack gap={4}>
            <Typography
              height={"100%"}
              width={"100%"}
              variant="h5"
              align="center"
            >
              Challenge doesn&apos;t exists anymore. Create a new challenge{" "}
              <Typography
                component="a"
                variant="h5"
                sx={{
                  color: "#A794FF",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => router.push("/")}
              >
                here
              </Typography>
            </Typography>
          </Stack>
        )}
        <RequestInvitation
          show={!user && !authLoading && !checkingAuth}
          redirectUrl={
            typeof window !== "undefined"
              ? window.location.origin + `/challenges/${challengeId}`
              : `https://marblerace.ai/challenges/${challengeId}`
          }
        />
      </Stack>
    </>
  );
};

export default Challenge;
