import { LoadingButton } from "@mui/lab";
import { Stack, TextField, Box } from "@mui/material";
import axios from "axios";
import { useState } from "react";
// import { useSendSignInLinkToEmail } from "react-firebase-hooks/auth";
import { validateEmail } from "../../helpers";
import { createWaitlist } from "../../services/db/waitlist.service";

type Props = {
  url: string;
  successCallback?: () => void;
  isWaitingList?: boolean;
};

const EmailLink = ({ url, successCallback, isWaitingList }: Props) => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  // const [password, setPassword] = useState<string>("");

  // const [sendSignInLinkToEmail, sending, emailLinkError] =
  //   useSendSignInLinkToEmail(auth);

  const onEmailLinkSignIn = async () => {
    if (!email || !validateEmail(email)) {
      alert("Enter a valid email");
      return;
    }
    setIsLoading(true);
    try {
      // const isSuccess = await sendSignInLinkToEmail(email, {
      //   url,
      //   handleCodeInApp: true,
      // });
      await axios.post(
        `${process.env.NEXT_PUBLIC_VOX_COVER_SERVER}/send-signin-link`,
        {
          redirectUrl: url,
          email: email,
        }
      );
      // if (isSuccess) {
      window.localStorage.setItem("emailForSignIn", email);
      alert(`Invitation Code Sent to ${email}`);
      if (successCallback) successCallback();
      // }
    } catch (e) {
      console.log(e);
      alert("Errer occurred, try again");
    } finally {
      setIsLoading(false);
    }
  };

  // const onEmailSignIn = async () => {
  //   if (!email.length || !password.length) {
  //     alert("Please fill both email and password.");
  //     return;
  //   }
  //   const userRef = await signInWithEmailAndPassword(email, password);
  //   if (userRef && userRef.user.emailVerified === false) {
  //     const emailSent = await sendEmailVerification();
  //     if (emailSent) {
  //       alert("Verification email has been sent to your email address");
  //     }
  //   }
  // };

  if (isWaitingList)
    return (
      <Stack gap={2} alignContent="center" justifyContent={"center"} py={1}>
        <TextField
          // placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          // error={!!emailLinkError}
          autoComplete="off"
          label="email"
          color="info"
        ></TextField>
        <Box display={"flex"} justifyContent="center" gap={1}>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            onClick={async () => {
              if (validateEmail(email)) {
                setIsLoading(true);
                await createWaitlist(email);
                alert("Joined! You will be notified with an Invitation soon.");
                setEmail("");
                setIsLoading(false);
              }
            }}
            size="medium"
            sx={{ textTransform: "capitalize" }}
          >
            Join Waitlist
          </LoadingButton>
        </Box>
      </Stack>
    );

  return (
    <Stack gap={2} alignContent="center" justifyContent={"center"} py={1}>
      <TextField
        // placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        // error={!!emailLinkError}
        autoComplete="off"
        label="email"
        color="info"
      ></TextField>
      <Box display={"flex"} justifyContent="center" gap={1}>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          onClick={onEmailLinkSignIn}
          size="medium"
        >
          Request
        </LoadingButton>
      </Box>
    </Stack>
  );
};

export default EmailLink;
