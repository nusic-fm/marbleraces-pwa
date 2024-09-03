import { Chip, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useMotionValue, useTransform, animate, motion } from "framer-motion";
import { useEffect } from "react";

type Props = { currentXp: number };

const Xp = ({ currentXp }: Props) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, currentXp);

    return () => controls.stop();
  }, [currentXp]);

  return (
    <Stack direction={"row"} alignItems="center">
      <Chip
        size="medium"
        variant="outlined"
        label={
          <Typography variant="body2">
            <motion.div
              style={{
                color: "greenyellow",
              }}
            >
              {rounded}
            </motion.div>
          </Typography>
        }
        deleteIcon={<img src="/xp.png" width={35} />}
        onDelete={() => {}}
      />
      {/* <Typography variant="h6">{currentXp}</Typography> */}
    </Stack>
  );
};

export default Xp;
