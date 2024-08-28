import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { GameVoiceInfo } from "../../src/game/scenes/Preloader";
import { Challenge } from "../../src/models/Challenge";
import { getChallenge } from "../../src/services/db/challenge.service";
import LinearProgressWithLabel from "../../src/components/LinearProgressWithLabel";
import { downloadAudioFiles } from "../../src/hooks/useTonejs";
import { getBackgroundPath, getSkinPath } from "../../src/helpers";
import dynamic from "next/dynamic";
import { IRefPhaserGame } from "../../src/models/Phaser";
import { getCover } from "../../src/services/db/cover.service";
import { CoverV1 } from "../../src/models/Cover";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../src/services/firebase.service";
import EmailLink from "../../src/components/AuthUI/EmailLink";
import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";
import Header from "../../src/components/Header";

type Props = {};

const AppWithoutSSR = dynamic(
  () => import("../../src/components/GameComponent"),
  {
    ssr: false,
  }
);

const Challenge = (props: Props) => {
  const router = useRouter();
  const { challengeId } = router.query;
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [cover, setCover] = useState<CoverV1 | null>(null);
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [selectedVoices, setSelectedVoices] = useState<GameVoiceInfo[]>([]);
  const [ready, setReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [user, authLoading, authError] = useAuthState(auth);
  const [enteredEmail, setEnteredEmail] = useState("");

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
      setSelectedVoices(voices);
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
      setReady(true);
    }
  };
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
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
      if (email)
        (async () => {
          try {
            // The client SDK will parse the code from the link for you.
            await signInWithEmailLink(auth, email, window.location.href);
            // window.localStorage.removeItem("emailForSignIn");
            router.push(
              typeof window !== "undefined" ? window.location.pathname : "",
              undefined,
              {
                shallow: true,
              }
            );
          } catch (e) {
            alert("Invalid Login, Please try again.");
            router.push(
              typeof window !== "undefined" ? window.location.pathname : "",
              undefined,
              {
                shallow: true,
              }
            );
          }
        })();
    }
  }, []);

  useEffect(() => {
    if (challengeId) {
      (async () => {
        const challengeDoc = await getChallenge(challengeId as string);
        setChallenge(challengeDoc);
        if (challengeDoc) {
          const _cover = await getCover(challengeDoc.coverId);
          setCover(_cover);
        }
      })();
    }
  }, [challengeId]);

  return (
    <>
      <Head>
        <title>Challenge | Marble Race</title>
        <meta
          property="og:title"
          content={"You have been Challenged"}
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
      >
        <Header user={user} />
        <Typography
          variant="h5"
          align="center"
          sx={
            {
              // background:
              //   "linear-gradient(43deg, rgb(65, 88, 208) 0%, rgb(200, 80, 192) 46%, rgb(255, 204, 112) 100%) text",
              // WebkitTextFillColor: "transparent",
            }
          }
        >
          <Typography
            variant="h5"
            textTransform={"capitalize"}
            component="span"
          >
            {challenge?.userObj.email?.split("@")[0]}
          </Typography>{" "}
          has Challenged you to Marble Race against {challenge?.voices[0].name}
        </Typography>
        {!ready &&
          (challenge?.userObj.id === user?.uid ? (
            <Stack alignItems={"center"} gap={1}>
              <Typography variant="subtitle1">
                Invite your Friends to the Challenge
              </Typography>
              <Stack direction={"row"} gap={1}>
                <TextField
                  label="email"
                  size="small"
                  type={"email"}
                  value={enteredEmail}
                  onChange={(e) => setEnteredEmail(e.target.value)}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    if (enteredEmail) {
                      (async () => {
                        // continueUrl=http://localhost:3000/challenges/m9lhvxube2QBPriHgBPk?loginEnteredEmail%3Dlogesh.r24@gmail.com&lang=en
                        await sendSignInLinkToEmail(auth, enteredEmail, {
                          url:
                            typeof window !== "undefined"
                              ? window.location.origin +
                                `/challenges/${challengeId}?loginEnteredEmail=${enteredEmail}`
                              : `https://marblerace.ai/challenges/${challengeId}?loginEnteredEmail=${enteredEmail}`,
                          handleCodeInApp: true,
                        });

                        alert("Successfully Invited to Play the challenge");
                        setEnteredEmail("");
                      })();
                    }
                  }}
                >
                  Send
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Stack
              direction={"row"}
              gap={2}
              justifyContent="center"
              alignItems={"center"}
            >
              <Typography>Choose your Voice: </Typography>
              <Stack direction={"row"} justifyContent="center">
                {cover?.voices
                  .filter(
                    (v) => !challenge?.voices.map((v) => v.id).includes(v.id)
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
                          newChallenge.voices.push({ id: v.id, name: v.name });
                          setChallenge(newChallenge);
                        } else if (challenge && challenge.voices.length === 2) {
                          const newChallenge = { ...challenge };
                          newChallenge.voices[1] = { id: v.id, name: v.name };
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
          alignItems={"center"}
          width={"100%"}
        >
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
            {ready && challenge ? (
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
                    {user?.uid !== challenge?.userObj.id && (
                      <Button
                        onClick={() => {
                          if (challenge && challenge.voices.length > 1 && user)
                            downloadAndPlay();
                          else if (user)
                            alert("Choose a Voice to Play the Race");
                          else alert("Sign In to play the Challenge");
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
        </Box>
        <Dialog open={!user}>
          <DialogTitle>
            Sign In with your Email to Play the Challenge
          </DialogTitle>
          <DialogContent>
            {authLoading ? (
              <Skeleton variant="rectangular" animation="wave" />
            ) : (
              <EmailLink
                url={
                  typeof window !== "undefined"
                    ? window.location.origin + `/challenges/${challengeId}`
                    : `https://marblerace.ai/challenges/${challengeId}`
                }
              />
            )}
          </DialogContent>
        </Dialog>
      </Stack>
    </>
  );
};

export default Challenge;
