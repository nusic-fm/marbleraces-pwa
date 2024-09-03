import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import createEmotionCache from "../src/createEmotionCache";
import { EmotionCache, CacheProvider } from "@emotion/react";
import {
  // BottomNavigation,
  // BottomNavigationAction,
  CssBaseline,
  // Paper,
} from "@mui/material";
// import { Head } from "next/document";
import theme from "../src/theme";
// import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
// import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
// import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
// // import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
// import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps: { session, ...pageProps },
  } = props;
  // const router = useRouter();

  // const [value, setValue] = useState<number>();

  // useEffect(() => {
  //   if (!router.isReady) return;
  //   if (router.pathname === "/") {
  //     setValue(0);
  //   } else if (router.pathname === "/library") {
  //     setValue(1);
  //   } else if (router.pathname === "/discover") {
  //     setValue(2);
  //   } else if (router.pathname.startsWith("/market")) {
  //     setValue(3);
  //   } else if (router.pathname.startsWith("/profile")) {
  //     setValue(4);
  //   }
  // }, [router.isReady, router.pathname]);

  return (
    <CacheProvider value={emotionCache}>
      {/* <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>NUSIC</title>
      </Head> */}
      <ThemeProvider theme={theme}>
        {/* <SessionProvider session={session}> */}
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {/* <Header /> */}
        <Component {...pageProps} />
        {/* {value && (
              <Paper
                sx={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.2)",
                }}
                elevation={3}
              >
                <Player songs={[]} songIndexProps={[0, () => {}]} />
              </Paper>
            )} */}

        {/* </SessionProvider> */}
      </ThemeProvider>
    </CacheProvider>
  );
}
{
  /* <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(0,0,0,0.2)",
            zIndex: 4,
          }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            sx={{ background: "rgb(0,0,0)" }}
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction
              onClick={() => router.push(`/`)}
              label="Play"
              icon={
                <PlayCircleOutlineRoundedIcon
                  fontSize="small"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                />
              }
            ></BottomNavigationAction>
            <BottomNavigationAction
              onClick={() => router.push(`/challenges`)}
              label="My Races"
              icon={
                <FavoriteBorderRoundedIcon
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                />
              }
            ></BottomNavigationAction>
            <BottomNavigationAction
              onClick={() => router.push(`/discover`)}
              label="Discover"
              icon={
                <ExploreRoundedIcon
                  fontSize="small"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                />
              }
            ></BottomNavigationAction>
            <BottomNavigationAction
              onClick={() => router.push(`/test-market`)}
              label="Market"
              icon={
                <StorefrontOutlinedIcon
                  fontSize="small"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                />
              }
            ></BottomNavigationAction>
            <BottomNavigationAction
              onClick={() => router.push(`/profile`)}
              label="Profile"
              icon={
                // <MenuRoundedIcon
                //   sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                // />
                <AccountCircleRoundedIcon
                  fontSize="small"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                />
              }
            ></BottomNavigationAction>
          </BottomNavigation>
        </Paper> */
}
