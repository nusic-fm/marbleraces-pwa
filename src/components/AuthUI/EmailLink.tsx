import { LoadingButton } from "@mui/lab";
import { Stack, TextField, Typography, Box, Button } from "@mui/material";
import { useState } from "react";
import { useSendSignInLinkToEmail } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebase.service";

type Props = { url: string };

const EmailLink = ({ url }: Props) => {
  const [email, setEmail] = useState<string>("");
  // const [password, setPassword] = useState<string>("");

  const [sendSignInLinkToEmail, sending, emailLinkError] =
    useSendSignInLinkToEmail(auth);

  const onEmailLinkSignIn = async () => {
    if (!email) {
      alert("Enter the email");
      return;
    }
    const isSuccess = await sendSignInLinkToEmail(email, {
      url,
      handleCodeInApp: true,
    });
    if (isSuccess) {
      window.localStorage.setItem("emailForSignIn", email);
      alert("Email has been sent");
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

  return (
    <Stack gap={2} alignContent="center" justifyContent={"center"} py={1}>
      <TextField
        // placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        error={!!emailLinkError}
        autoComplete="off"
        label="email"
        color="info"
      ></TextField>
      {/* <TextField
            placeholder="password"
            type={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!emailError}
          ></TextField> */}
      {emailLinkError?.message && (
        <Typography color={"error"} align="center">
          {emailLinkError?.message}
        </Typography>
      )}
      {/* <Box display="flex" justifyContent={"start"} gap={1}>
            <Link
              variant="body2"
              color={"rgb(155,155,164)"}
              sx={{ cursor: "pointer" }}
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </Link>
          </Box> */}
      {/* <Box display={"flex"} justifyContent="center">
            <LoadingButton
              loading={sending}
              variant="contained"
              onClick={onEmailSignIn}
            >
              Login
            </LoadingButton>
          </Box> */}
      <Box display={"flex"} justifyContent="center" gap={1}>
        <LoadingButton
          loading={sending}
          variant="contained"
          onClick={onEmailLinkSignIn}
          size="medium"
        >
          Verify
        </LoadingButton>
        {/* <Button size="small" color="secondary">
          Skip
        </Button> */}
      </Box>
      {/* <Box display="flex" justifyContent={"center"} gap={1}>
            <Typography variant="body2" color={"rgb(155,155,164)"}>
              Create a Password
            </Typography>
            <Link
              variant="body2"
              color={"#A794FF"}
              onClick={() => setShowRegistrationForm(true)}
            >
              here
            </Link>
          </Box> */}
    </Stack>
  );
};

export default EmailLink;
