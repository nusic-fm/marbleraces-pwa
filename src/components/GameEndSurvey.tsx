import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  // IconButton,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
// import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
// import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: (
    rating: number,
    likedFeatures: string[],
    tellUsMore: string
  ) => void;
};

function GameEndSurvey({ open, onClose }: Props) {
  const [rating, setRating] = useState<number>(0);
  const [likedFeatures, setLikedFeatures] = useState<string[]>([]);
  const [tellUsMore, setTellUsMore] = useState<string>("");

  return (
    <Dialog open={open}>
      <DialogTitle>Did you like your experience?</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <Stack gap={1} alignItems={"center"}>
            <Typography>Rate the game</Typography>
            <Rating onChange={(e, value) => value && setRating(value)} />
          </Stack>
          <Stack alignItems={"center"} gap={1}>
            <Typography>Things you liked</Typography>
            <Stack
              direction={"row"}
              gap={1}
              flexWrap={"wrap"}
              justifyContent={"center"}
            >
              {["Voices", "Obstacles", "Music", "Visuals"].map((feature) => (
                <Chip
                  key={feature}
                  label={feature}
                  clickable
                  onClick={() => {
                    if (likedFeatures.includes(feature)) {
                      setLikedFeatures(
                        likedFeatures.filter((f) => f !== feature)
                      );
                    } else {
                      setLikedFeatures([...likedFeatures, feature]);
                    }
                  }}
                  variant={
                    likedFeatures.includes(feature) ? "filled" : "outlined"
                  }
                />
              ))}
            </Stack>
          </Stack>
          <Stack gap={1}>
            <Typography>Tell us more</Typography>
            <TextField
              value={tellUsMore}
              onChange={(e) => setTellUsMore(e.target.value)}
              fullWidth
              multiline
              color="info"
            />
          </Stack>
          <Button
            color="info"
            variant="contained"
            onClick={() => onClose(rating, likedFeatures, tellUsMore)}
            disabled={!rating || !likedFeatures.length}
          >
            Close
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default GameEndSurvey;
