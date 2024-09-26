import {
  Stack,
  Box,
  Popover,
  Typography,
  useMediaQuery,
  useTheme,
  Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  selectedTracksList: string[];
  setSelectedTracksList: React.Dispatch<React.SetStateAction<string[]>>;
};

export const tracks = [
  "01",
  // "02",
  "03",
  "06",
  "07",
  // "11", Not working on mobile
  // "14", Not working on mobile
  "16",
  // "21",
  // "22",
];
const SelectRacetracks = ({
  selectedTracksList,
  setSelectedTracksList,
}: Props) => {
  const [dialogRef, setDialogRef] = useState<HTMLButtonElement | null>(null);
  const [showRemove, setShowRemove] = useState(false);
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down("md"));

  const availableTracksToSelect = tracks
    .filter((t) => !Object.values(selectedTracksList).includes(t))
    .filter((t) => (isMobileView ? t !== "11" : true));

  useEffect(() => {
    if (selectedTracksList.length === 0) {
      setShowRemove(false);
    } else if (selectedTracksList) {
      // Save in local storage
      localStorage.setItem(
        "selectedTracks",
        JSON.stringify(selectedTracksList)
      );
      if (selectedTracksList.length === tracks.length) setDialogRef(null);
    }
  }, [selectedTracksList]);

  return (
    <Stack justifyContent="center" alignItems="center">
      <Box
        display={"flex"}
        gap={2}
        alignItems={"center"}
        justifyContent="center"
      >
        <Typography variant="h6">Choose Racetracks</Typography>
        {/* <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={() => setShowRemove(!showRemove)}
          disabled={selectedTracksList.length === 0}
        >
          {showRemove ? "Done" : "Remove"}
        </Button> */}
      </Box>
      <Stack
        direction="row"
        gap={2}
        px={1}
        width={isMobileView ? "90vw" : "90%"}
        height="160px"
        justifyContent="start"
        alignItems={"center"}
        sx={{ overflowX: "auto" }}
      >
        {tracks.map((trackPath) => (
          <Stack key={trackPath} alignItems={"center"}>
            <Box position="relative">
              <img
                src={`https://voxaudio.nusic.fm/marble_race%2Ftracks_preview%2F${trackPath}.png?alt=media`}
                style={{
                  cursor: "pointer",
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
                onClick={() => {
                  if (selectedTracksList.includes(trackPath)) {
                    setSelectedTracksList((prevTracks) =>
                      prevTracks.filter((t) => t !== trackPath)
                    );
                  } else {
                    setSelectedTracksList((prevTracks) => [
                      ...prevTracks,
                      trackPath,
                    ]);
                  }
                }}
              />
              {/* {showRemove && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.5)",
                }}
                width="100%"
                height={"100%"}
                display="flex"
                alignItems={"center"}
                justifyContent="center"
              >
                <IconButton
                  onClick={() =>
                    setSelectedTracksList((prevTracks) =>
                      prevTracks.filter((t) => t !== trackPath)
                    )
                  }
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
            )} */}
            </Box>
            <Checkbox
              checked={selectedTracksList.includes(trackPath)}
              color="default"
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedTracksList((prevTracks) => [
                    ...prevTracks,
                    trackPath,
                  ]);
                } else {
                  setSelectedTracksList((prevTracks) =>
                    prevTracks.filter((t) => t !== trackPath)
                  );
                }
              }}
            />
          </Stack>
        ))}
        {/* <Box minWidth={60} width={60} height={122}>
          <Box
            width={"100%"}
            height={"100%"}
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius={1}
            sx={{ outline: "2px solid #c3c3c3", cursor: "pointer" }}
          >
            <IconButton
              onClick={(e) => setDialogRef(e.currentTarget)}
              disabled={!availableTracksToSelect.length}
            >
              <AddIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box> */}
        <Popover
          open={Boolean(dialogRef)}
          anchorEl={dialogRef}
          onClose={() => setDialogRef(null)}
        >
          <Stack p={2} gap={1}>
            <Typography>Add Racetracks</Typography>
            <Stack
              direction={"row"}
              gap={1}
              maxWidth="100%"
              justifyContent={"start"}
              sx={{ overflowX: "auto" }}
            >
              {availableTracksToSelect.map((t) => (
                <img
                  key={t}
                  src={`https://voxaudio.nusic.fm/marble_race%2Ftracks_preview%2F${t}.png?alt=media`}
                  style={{
                    width: 80,
                    minWidth: 80,
                    height: 142,
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                  onClick={() => {
                    setSelectedTracksList((prevTracks) => [...prevTracks, t]);
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Popover>
      </Stack>
    </Stack>
  );
};

export default SelectRacetracks;
