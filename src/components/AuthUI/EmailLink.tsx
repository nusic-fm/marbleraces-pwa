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
  showSignIn?: boolean;
};

const EmailLink = ({
  url,
  successCallback,
  isWaitingList,
  showSignIn,
}: Props) => {
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
        `${process.env.NEXT_PUBLIC_VOX_COVER_SERVER}/request-invitation-link`,
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
    } catch (e: any) {
      console.log(e);
      alert(e?.response?.data || "Error occurred, try again");
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

  const onEmailTextboxChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmail(e.target.value);
  };

  if (showSignIn) {
    return (
      <Stack gap={2} alignContent="center" justifyContent={"center"} py={1}>
        <TextField
          // placeholder="email"
          value={email}
          onChange={onEmailTextboxChange}
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
                try {
                  await axios.post(
                    `${process.env.NEXT_PUBLIC_VOX_COVER_SERVER}/send-login-link`,
                    {
                      redirectUrl: url,
                      email: email,
                    }
                  );
                  alert(`Login link sent to ${email}`);
                } catch (e: any) {
                  console.log(e);
                  if (e.response.data === "User not found") {
                    alert("Email not found, please request an Invitation");
                  } else alert("Errer occurred, try again");
                } finally {
                  setIsLoading(false);
                }
              }
            }}
            size="medium"
          >
            Login
          </LoadingButton>
        </Box>
      </Stack>
    );
  } else if (isWaitingList)
    return (
      <Stack gap={2} alignContent="center" justifyContent={"center"} py={1}>
        <TextField
          // placeholder="email"
          value={email}
          onChange={onEmailTextboxChange}
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
                const sendEmail = await createWaitlist(email);
                if (sendEmail) {
                  await axios.post(
                    `${process.env.NEXT_PUBLIC_VOX_COVER_SERVER}/send-waitlist-email`,
                    {
                      email: email,
                    }
                  );
                  alert(
                    "Joined the waitlist! You will be notified with an Invitation soon."
                  );
                  setEmail("");
                  setIsLoading(false);
                } else {
                  alert(
                    "Whoops, you've already on the waitlist! We'll let you know when new invites are available"
                  );
                }
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
        onChange={onEmailTextboxChange}
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
