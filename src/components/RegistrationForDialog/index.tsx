import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
} from "react-firebase-hooks/auth";
import { auth } from "../../services/firebase.service";

type Props = { open: boolean; onClose: () => void };

const RegistrationForDialog = ({ open, onClose }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification, sendingVerification, verificationError] =
    useSendEmailVerification(auth);

  const onSubmit = async () => {
    if (email && password) {
      try {
        const user = await createUserWithEmailAndPassword(email, password);
        if (user) {
          if (user.user.emailVerified === false) {
            const emailSent = await sendEmailVerification();
            if (emailSent) {
              alert("Verification email has been sent to your email address");
            }
          }
        }
      } catch (e: any) {
        if (e.code === 400) {
          alert(
            "This email is already available, Sign in or Register with a different email address"
          );
        }
      }
    } else {
      // TODO
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Register</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <TextField
            placeholder="email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          ></TextField>
          <TextField
            placeholder="password"
            type={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={loading}
          variant="outlined"
          color="info"
          onClick={onSubmit}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default RegistrationForDialog;
