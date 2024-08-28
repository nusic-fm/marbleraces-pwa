import { Slider } from "@mui/material";
import React from "react";
import theme from "../../theme";

type Props = {
  value: number;
  max: number;
  onChange: (e: Event, value: number | number[], activeThumb: number) => void;
  onChangeCommitted: (
    e: Event | React.SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => void;
};

const SeekBar = ({ value, max, onChange, onChangeCommitted }: Props) => {
  return (
    <Slider
      value={value}
      max={max}
      color="secondary"
      size="small"
      onChange={onChange}
      onChangeCommitted={onChangeCommitted}
      min={0}
      // step={1}
      sx={{
        ml: 0.5,
        width: "100%",
        color: theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
        height: 4,
        "& .MuiSlider-thumb": {
          width: 8,
          height: 8,
          transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
          "&:before": {
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
          },
          "&:hover, &.Mui-focusVisible": {
            boxShadow: `0px 0px 0px 8px ${
              theme.palette.mode === "dark"
                ? "rgb(255 255 255 / 16%)"
                : "rgb(0 0 0 / 16%)"
            }`,
          },
          "&.Mui-active": {
            width: 20,
            height: 20,
          },
        },
        "& .MuiSlider-rail": {
          opacity: 0.28,
        },
      }}
    />
  );
};

export default SeekBar;
