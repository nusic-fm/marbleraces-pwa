import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { isSignInWithEmailLink, signInAnonymously } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  useAuthState,
  useSendEmailVerification,
  useSignInWithEmailLink,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";

import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import EmailLink from "./EmailLink";
import { auth } from "../../services/firebase.service";

type Props = {
  url: string;
};

const AuthUI = ({ url }: Props) => {
  const [user, loading, error] = useAuthState(auth);
  // const [signInWithEmailAndPassword, , emailLoading, emailError] =
  //   useSignInWithEmailAndPassword(auth);
  // const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  // const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [signInWithGoogle, , googleLoading, googleError] =
    useSignInWithGoogle(auth);
  const [signInWithEmailLink] = useSignInWithEmailLink(auth);
  const [sendEmailVerification, sendingVerification, verificationError] =
    useSendEmailVerification(auth);
  const router = useRouter();
  const { mode } = router.query;

  const {
    activate,
    deactivate,
    account,
    error: walletConnectError,
  } = useWeb3React();
  const [showWallets, setShowWallets] = useState(false);

  const checkForEmailAuth = async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("email");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      if (email) {
        await signInWithEmailLink(email, window.location.href);
        router.push("/profile", undefined, { shallow: true });
        window.localStorage.removeItem("email");
      }
    }
  };

  const onConnectWallet = async () => {
    setShowWallets(true);
  };

  const onSignInUsingWallet = async (
    connector: WalletConnectConnector | WalletLinkConnector | InjectedConnector
  ) => {
    await activate(connector, (e) => {});
    await signInAnonymously(auth);
    setShowWallets(false);
  };

  useEffect(() => {
    if (!user) {
      checkForEmailAuth();
    }
  }, [user]);

  return (
    <Box>
      <Stack p={2} gap={2}>
        <EmailLink url={url} />
        <Box my={1}>
          <Typography align="center">OR</Typography>
        </Box>
        <Box display={"flex"} justifyContent="center">
          <IconButton onClick={() => signInWithGoogle()}>
            <Image
              src="/signin/google_signin.png"
              alt="google"
              width={191}
              height={46}
            />
          </IconButton>
        </Box>
        <Divider />
        <Box display={"flex"} justifyContent="center">
          <Button onClick={onConnectWallet} variant="outlined" color="info">
            Connect Wallet
          </Button>
        </Box>
      </Stack>
      {/* <WalletConnectors
        open={showWallets}
        onSignInUsingWallet={onSignInUsingWallet}
      /> */}

      {/* <RegistrationForDialog
        open={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
      />
      <ForgotPassword
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        url={url}
      /> */}
    </Box>
  );
};

export default AuthUI;
