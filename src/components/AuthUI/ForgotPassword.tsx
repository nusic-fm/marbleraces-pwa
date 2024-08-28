import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../services/firebase.service";

type Props = { open: boolean; onClose: () => void; url: string };

const ForgotPassword = ({ open, onClose, url }: Props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    await sendPasswordResetEmail(auth, email, { url });
    setLoading(false);
    alert("Reset mail has been sent");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <TextField
            placeholder="email"
            value={email}
            type="email"
            autoComplete={"off"}
            onChange={(e) => setEmail(e.target.value)}
          ></TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={loading}
          disabled={!email}
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

export default ForgotPassword;
