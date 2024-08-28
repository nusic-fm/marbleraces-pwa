/* eslint-disable @next/next/no-img-element */
import EditRounded from "@mui/icons-material/EditRounded";
import {
  Typography,
  Button,
  Drawer,
  Skeleton,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogContentText,
  DialogContent,
  DialogActions,
  DialogTitle,
  Tooltip,
  Badge,
} from "@mui/material";
import { Box } from "@mui/system";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthUI from "../src/components/AuthUI";
import EditProfile from "../src/components/EditProfile";
import { UserDoc } from "../src/models/User";
import { getUserDoc, updateUserProfile } from "../src/services/db/user.service";
import { auth } from "../src/services/firebase.service";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import LinkAccounts from "../src/components/AuthUI/LinkAccounts";

type Props = {};

const Profile = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [user, authLoading] = useAuthState(auth);
  const [showEditForm, setShowEditForm] = useState(false);
  const [userDoc, setUserDoc] = useState<UserDoc>();
  const [showWelcome, setShowWelcome] = useState(false);

  const fetchUserDoc = async (id: string) => {
    setLoading(true);
    const doc = await getUserDoc(id);
    if (!doc.name) {
      setShowWelcome(true);
      return;
    }
    setUserDoc(doc);
    setLoading(false);
  };

  useEffect(() => {
    if (user && user.isAnonymous === false) {
      fetchUserDoc(user.uid);
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  // const onEditFormSave = async (profileObj: any) => {
  // if (user) {
  //   await updateUserProfile(user.uid, profileObj);
  //   await fetchUserDoc(user.uid);
  //   setShowEditForm(false);
  // }
  // };

  if (user?.isAnonymous && !loading) {
    return <LinkAccounts user={user} />;
  }

  if (!user && !loading) {
    return (
      <Box sx={{ bgcolor: "black", minHeight: "100vh" }}>
        <Drawer anchor="bottom" open>
          <AuthUI
            url={
              typeof window === "undefined"
                ? ""
                : `${window.location.origin}/profile`
            }
          />
        </Drawer>
      </Box>
    );
  }

  // if (user.emailVerified === false) {
  //   return (
  //     <Stack p={2} gap={1}>
  //       <Typography textAlign={"center"}>
  //         Hi, a verificaion Email has been sent to this {user.email} account,
  //         Kindly verify to continue
  //       </Typography>

  //       <Chip
  //         label={
  //           !user.emailVerified
  //             ? "Email Verified"
  //             : "Email Verification Pending"
  //         }
  //         color={!user.emailVerified ? "success" : "warning"}
  //       />
  //     </Stack>
  //   );
  // }

  return (
    <Box p={2} sx={{ bgcolor: "black", minHeight: "100vh" }}>
      <Box display={"flex"} gap={2} alignItems="center">
        <Typography variant="h6">Profile</Typography>
        <IconButton onClick={() => setShowEditForm(true)}>
          <EditRounded fontSize="small" />
        </IconButton>
      </Box>
      {loading && (
        <Stack gap={2} mt={2}>
          <Skeleton variant="rectangular" />
          <Skeleton variant="text" />
          <Skeleton variant="rounded" />
        </Stack>
      )}
      {userDoc && user && (
        <Stack mt={2} gap={2}>
          <Box display={"flex"} gap={2} alignItems="center">
            {userDoc.avatarUrl && (
              <img
                src={userDoc.avatarUrl}
                alt=""
                width={64}
                height={64}
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
            )}
            <Typography variant="h6">{userDoc.name}</Typography>
          </Box>
          {/* <Typography>Email: {user.email}</Typography> */}
          <Typography>{userDoc?.bio}</Typography>
          <Box
            display={"flex"}
            gap={2}
            alignItems="center"
            justifyContent={"center"}
          >
            {userDoc.discordUrl && (
              <IconButton
                onClick={() => {
                  window.open(userDoc.discordUrl, "_blank");
                }}
              >
                <Image
                  src="/social/discord-icon.png"
                  alt=""
                  width={32}
                  height={32}
                />
              </IconButton>
            )}
            {userDoc.twitterUrl && (
              <IconButton
                onClick={() => {
                  window.open(userDoc.twitterUrl, "_blank");
                }}
              >
                <Image
                  src="/social/twitter.png"
                  alt=""
                  width={32}
                  height={32}
                />
              </IconButton>
            )}
            {userDoc.spotifyUrl && (
              <IconButton>
                <IconButton
                  onClick={() => {
                    window.open(userDoc.spotifyUrl, "_blank");
                  }}
                >
                  <Image
                    src="/social/spotify.png"
                    alt=""
                    width={32}
                    height={32}
                  />
                </IconButton>
              </IconButton>
            )}
            {userDoc.instagramUrl && (
              <IconButton>
                <IconButton
                  onClick={() => {
                    window.open(userDoc.instagramUrl, "_blank");
                  }}
                >
                  <Image
                    src="/social/instagram.png"
                    alt=""
                    width={32}
                    height={32}
                  />
                </IconButton>
              </IconButton>
            )}
            {userDoc.tiktokUrl && (
              <IconButton>
                <IconButton
                  onClick={() => {
                    window.open(userDoc.tiktokUrl, "_blank");
                  }}
                >
                  <Image
                    src="/social/tiktok.png"
                    alt=""
                    width={32}
                    height={32}
                  />
                </IconButton>
              </IconButton>
            )}
            {userDoc.websiteUrl && (
              <IconButton>
                <IconButton
                  onClick={() => {
                    window.open(userDoc.websiteUrl, "_blank");
                  }}
                >
                  <LanguageOutlinedIcon />
                </IconButton>
              </IconButton>
            )}
          </Box>
          <Box display={"flex"} justifyContent="center" mt={2}>
            <Button onClick={() => signOut(auth)} variant="contained">
              Sign Out
            </Button>
          </Box>
        </Stack>
      )}
      {user && (
        <EditProfile
          open={showEditForm}
          onClose={(refreshUserDoc: boolean = false) => {
            if (refreshUserDoc) fetchUserDoc(user.uid);
            setShowEditForm(false);
          }}
          userDoc={userDoc}
          uid={user.uid}
        />
      )}
      <Dialog open={showWelcome} fullScreen>
        <DialogTitle>Welcome</DialogTitle>
        <DialogContent>
          <Stack
            gap={4}
            alignItems="center"
            justifyContent={"center"}
            height="100%"
          >
            <Image src="/favicon.ico" alt="" width={100} height={100} />
            <Typography variant="h5" align="center">
              Tell creators and collectors who you are
            </Typography>
            <Button
              variant="outlined"
              color="info"
              fullWidth
              onClick={() => {
                setShowWelcome(false);
                setShowEditForm(true);
              }}
            >
              Complete Profile
            </Button>
            {/* </Badge> */}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Profile;
