import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { doc } from "firebase/firestore";
import { useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { updateRemainingInvites } from "../../services/db/config.service";
import { db } from "../../services/firebase.service";
import EmailLink from "../AuthUI/EmailLink";

type Props = { show: boolean; redirectUrl: string };

function RequestInvitation({ show, redirectUrl }: Props) {
  const [docData, loading, error] = useDocumentData(
    doc(db, "marblerace_config", "wqAmu88xZ8VuFUQDQDFb")
  );
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <Dialog open={show}>
      <DialogTitle>
        {showSignIn ? "Login to Marble Races" : "Request a Free Invitation"}
      </DialogTitle>
      <DialogContent>
        {!showSignIn && (
          <Stack
            direction={"row"}
            gap={1}
            alignItems="center"
            justifyContent={"center"}
          >
            <Typography variant="caption" align="center">
              Invitations Remaining Today:
            </Typography>
            <Typography component={"span"} variant="h5">
              {docData?.remainingInvites}
            </Typography>
          </Stack>
        )}
        <EmailLink
          url={redirectUrl}
          successCallback={() => {
            // updateRemainingInvites();
          }}
          isWaitingList={
            !(docData?.remainingInvites && docData?.remainingInvites > 0)
          }
          showSignIn={showSignIn}
        />
        <Stack
          direction="row"
          justifyContent="center"
          gap={1}
          alignItems="center"
        >
          <Typography variant="caption" align="center">
            {showSignIn ? "Don't have an Account?" : "Already have an Account?"}
          </Typography>
          <Button
            variant="text"
            color="info"
            onClick={() => setShowSignIn(!showSignIn)}
            size="small"
          >
            {showSignIn ? "Request Invitation" : "Login"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default RequestInvitation;
