/* eslint-disable @next/next/no-img-element */
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { uploadFromFile } from "../../services/storage";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { updateUserProfile } from "../../services/db/user.service";
import { UserDoc } from "../../models/User";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";

type Props = {
  open: boolean;
  onClose: (refreshUserDoc?: boolean) => void;
  uid: string;
  userDoc?: UserDoc;
};
const EditProfile = ({ open, onClose, uid, userDoc }: Props) => {
  const [profileObj, setProfileObj] = useState<Partial<UserDoc>>();
  const [localFile, setLocalFile] = useState<string>();
  const [storageObj, setStorageObj] = useState<{
    file: File;
    type: string;
    fileName: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    if (userDoc) {
      setProfileObj(userDoc);
      if (userDoc.avatarUrl) setLocalFile(userDoc.avatarUrl);
    }
  }, [userDoc]);

  const onUpload = async (e: any) => {
    const files = (e.target as HTMLInputElement).files;
    if (files?.length) {
      const file = files[0];
      if (file.size > 4194304) {
        alert("File size is too large, choose less than 4MB");
        return;
      }
      setLocalFile(URL.createObjectURL(file));
      const ext = file.name.split(".")[1];
      const type = file.type;
      const fileName = `profile/${uid}/avatar.${ext}`;
      setStorageObj({ file, fileName, type });

      onChangeHandler(
        "avatarUrl",
        `https://storage.cloud.google.com/nusic-player/${fileName}`
      );
    }
  };

  const onProfileSave = async () => {
    if (!profileObj?.name) {
      setNameError(true);
      return;
    }
    setLoading(true);
    if (localFile && storageObj) {
      await uploadFromFile(
        storageObj.file,
        storageObj.fileName,
        storageObj.type
      );
    }
    await updateUserProfile(uid, profileObj);
    setLoading(false);
    onClose(true);
    // await onSave(profileObj);
  };

  const onChangeHandler = (
    prop:
      | "name"
      | "bio"
      | "avatarUrl"
      | "instagramUrl"
      | "tiktokUrl"
      | "twitterUrl"
      | "discordUrl"
      | "spotifyUrl"
      | "websiteUrl",
    value: string
  ) => {
    const newProfileObj = { ...profileObj } ?? {};
    newProfileObj[prop] = value;
    setProfileObj(newProfileObj);
  };

  return (
    <Dialog open={open} fullScreen>
      <DialogTitle>
        <Box
          display={"flex"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1">Edit</Typography>
          <IconButton onClick={() => onClose()}>
            <CloseIcon sx={{ color: "#c3c3c3" }} fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack gap={1}>
          <Box display={"flex"} gap={2} mt={1}>
            {localFile ? (
              <Box position={"relative"}>
                <img
                  src={localFile}
                  alt=""
                  style={{
                    borderRadius: "50%",
                    width: 64,
                    height: 64,
                    objectFit: "cover",
                  }}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  component={"label"}
                  sx={{
                    borderRadius: "50%",
                    width: 64,
                    height: 64,
                    textAlign: "center",
                    position: "absolute",
                    left: 0,
                    // background: "rgba(0,0,0,0.2)",
                    zIndex: 9,
                  }}
                  onChange={onUpload}
                >
                  {/* <FileUploadOutlinedIcon /> */}
                  <input hidden accept="image/*" type="file" />
                </Button>
              </Box>
            ) : (
              <Button
                variant="outlined"
                color="info"
                component={"label"}
                sx={{
                  borderRadius: "50%",
                  height: 64,
                  textAlign: "center",
                }}
                onChange={onUpload}
              >
                <FileUploadOutlinedIcon />
                <input hidden accept="image/*" type="file" />
              </Button>
            )}
            <TextField
              label="Name"
              fullWidth
              color="info"
              value={profileObj?.name}
              onChange={(e) => onChangeHandler("name", e.target.value)}
              error={nameError}
            ></TextField>
          </Box>
          <TextField
            label="Bio"
            multiline
            minRows={3}
            fullWidth
            color="info"
            value={profileObj?.bio}
            onChange={(e) => onChangeHandler("bio", e.target.value)}
          ></TextField>
          <Typography>Socials</Typography>
          <TextField
            placeholder="Instagram Url"
            value={profileObj?.instagramUrl}
            onChange={(e) => onChangeHandler("instagramUrl", e.target.value)}
            InputProps={{
              startAdornment: (
                <img src="/social/instagram.png" alt="" width={32} />
              ),
            }}
          />
          <TextField
            placeholder="Twitter Url"
            value={profileObj?.twitterUrl}
            onChange={(e) => onChangeHandler("twitterUrl", e.target.value)}
            InputProps={{
              startAdornment: (
                <img src="/social/twitter.png" alt="" width={32} />
              ),
            }}
          />
          <TextField
            placeholder="Discord Url"
            value={profileObj?.discordUrl}
            onChange={(e) => onChangeHandler("discordUrl", e.target.value)}
            InputProps={{
              startAdornment: (
                <img src="/social/discord-icon.png" alt="" width={32} />
              ),
            }}
          />
          <TextField
            placeholder="Tiktok Url"
            value={profileObj?.tiktokUrl}
            onChange={(e) => onChangeHandler("tiktokUrl", e.target.value)}
            InputProps={{
              startAdornment: (
                <img src="/social/tiktok.png" alt="" width={32} />
              ),
            }}
          />
          <TextField
            placeholder="Spotify Url"
            value={profileObj?.spotifyUrl}
            onChange={(e) => onChangeHandler("spotifyUrl", e.target.value)}
            InputProps={{
              startAdornment: (
                <img src="/social/spotify.png" alt="" width={32} />
              ),
            }}
          />
          <TextField
            placeholder="Website Url"
            value={profileObj?.websiteUrl}
            onChange={(e) => onChangeHandler("websiteUrl", e.target.value)}
            InputProps={{
              startAdornment: (
                <LanguageOutlinedIcon
                  sx={{ width: 32, height: 32, color: "#c4c4c4" }}
                />
              ),
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={loading}
          variant="outlined"
          color="info"
          onClick={onProfileSave}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfile;
