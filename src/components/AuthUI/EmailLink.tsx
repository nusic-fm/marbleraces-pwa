import { LoadingButton } from "@mui/lab";
import { Stack, TextField, Box } from "@mui/material";
import axios from "axios";
import { useState } from "react";
// import { useSendSignInLinkToEmail } from "react-firebase-hooks/auth";
import { getClientTimeInCustomFormat, validateEmail } from "../../helpers";
import { waitlistExists } from "../../services/db/waitlist.service";
import { getUserDocByEmail } from "../../services/db/user.service";
import { getInviteDoc } from "../../services/db/invites.service";

type Props = {
  url: string;
  successCallback?: () => void;
  isWaitingList?: boolean;
  showSignIn?: boolean;
  setShowSignIn?: (showSignIn: boolean) => void;
};

const EmailLink = ({
  url,
  successCallback,
  isWaitingList,
  showSignIn,
  setShowSignIn,
}: Props) => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  // const [password, setPassword] = useState<string>("");

  // const [sendSignInLinkToEmail, sending, emailLinkError] =
  //   useSendSignInLinkToEmail(auth);

  const onEmailLinkSignIn = async () => {
    const previousEmail = window.localStorage.getItem("emailForSignIn");
    if (!email || !validateEmail(email)) {
      alert("Enter a valid email");
      return;
    } else if (previousEmail === email) {
      alert("You have already requested an Invitation for this email");
      return;
    }
    setIsLoading(true);
    try {
      // const isSuccess = await sendSignInLinkToEmail(email, {
      //   url,
      //   handleCodeInApp: true,
      // });
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_VOX_COVER_SERVER}/request-invitation-link`,
        {
          redirectUrl: url,
          email: email,
          requestedTime: getClientTimeInCustomFormat(),
        }
      );
      // if (isSuccess) {
      window.localStorage.setItem("emailForSignIn", email);
      alert(res.data || `Invitation Code Sent to ${email}`);
      setEmail("");
      if (successCallback) successCallback();
      // }
    } catch (e: any) {
      console.log(e);
      alert(e?.response?.data || "Error occurred, try again");
      // TODO: Re send the Login Link
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
                  const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_VOX_COVER_SERVER}/send-login-link`,
                    {
                      redirectUrl: url,
                      email: email,
                      requestedTime: getClientTimeInCustomFormat(),
                    }
                  );
                  alert(res.data || `Login link sent to ${email}`);
                  setEmail("");
                } catch (e: any) {
                  console.log(e);
                  if (e.response?.data === "User not found") {
                    alert("Email not found, please request an Invitation");
                  } else if (
                    e.response?.data ===
                    "Not Authorized for Login, Request an Invite"
                  ) {
                    alert("Not Authorized for Login, Request an Invite");
                    setShowSignIn && setShowSignIn(false);
                  } else alert(e.response?.data || "Errer occurred, try again");
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
                // Check if the email is in Users/invites List
                const userDoc = await getUserDocByEmail(email);
                if (userDoc) {
                  alert("You already have an account, please login");
                  setIsLoading(false);
                  setShowSignIn && setShowSignIn(true);
                  return;
                }
                const inviteDoc = await getInviteDoc(email);
                if (inviteDoc) {
                  alert(
                    "You have already been invited before! please login to continue"
                  );
                  setIsLoading(false);
                  setShowSignIn && setShowSignIn(true);
                  return;
                }

                const exists = await waitlistExists(email);
                if (!exists) {
                  // Check if the email is in Users/invites List
                  try {
                    const res = await axios.post(
                      `${process.env.NEXT_PUBLIC_VOX_COVER_SERVER}/send-waitlist-email`,
                      {
                        email: email,
                        requestedTime: getClientTimeInCustomFormat(),
                      }
                    );
                    alert(
                      res.data ||
                        "Joined the waitlist! You will be notified with an Invitation soon."
                    );
                    setEmail("");
                  } catch (e: any) {
                    alert(e.response?.data || "Error occurred, try again");
                  } finally {
                    setEmail("");
                    setIsLoading(false);
                  }
                } else {
                  alert(
                    "Whoops, you are already on the waitlist! We'll let you know when new invites are available"
                  );
                  setEmail("");
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
