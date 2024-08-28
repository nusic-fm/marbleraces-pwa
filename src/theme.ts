import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#573FC8",
      light: "#000000",
    },
    secondary: {
      main: "#ffffff",
      dark: "rgba(159, 159, 159, 0.4)",
    },
    info: {
      main: "#A794FF",
    },
    warning: {
      main: "#ffcc00",
    },
    background: { paper: "#16162A" },
  },
  typography: {
    button: {
      fontFamily: '"Space Mono" , sans-serif',
    },
    // h4: {
    //   fontFamily: '"BenchNine"',
    // },
    allVariants: {
      color: "#ffffff",
    },
    fontFamily: `"Space Mono" , sans-serif`,
  },
});

export default theme;
