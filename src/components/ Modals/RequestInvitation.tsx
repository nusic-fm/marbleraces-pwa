import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { doc } from "firebase/firestore";
import React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { updateRemainingInvites } from "../../services/db/config.service";
import { db } from "../../services/firebase.service";
import EmailLink from "../AuthUI/EmailLink";

type Props = { show: boolean; redirectUrl: string };

function RequestInvitation({ show, redirectUrl }: Props) {
  const [docData, loading, error] = useDocumentData(
    doc(db, "marblerace_config", "wqAmu88xZ8VuFUQDQDFb")
  );

  return (
    <Dialog open={show}>
      <DialogTitle>Request a Free Invitation</DialogTitle>
      <DialogContent>
        {docData?.remainingInvites && docData?.remainingInvites > 0 ? (
          <>
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
            <EmailLink
              url={redirectUrl}
              successCallback={() => {
                updateRemainingInvites();
              }}
            />
          </>
        ) : (
          <>
            <Typography variant="caption" align="center">
              No Invitations Available for Today
            </Typography>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default RequestInvitation;
