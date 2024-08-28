import {
  Grid,
  Box,
  Tooltip,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import { LoginWithPaper, PaperSDKProvider } from "@paperxyz/react-client-sdk";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getEnsName } from "../../helpers";

type Props = {};

const fetchPaperUser = async (userToken: string) => {
  const res = await axios.post(
    "/api/paper-user-details",
    {
      userToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};
const fetchPaperToken = async (code: string) => {
  const res = await axios.post(
    "/api/paper-exchange-user-token",
    { code },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data.userToken;
};

const Header = (props: Props) => {
  const router = useRouter();
  const { account } = useWeb3React();
  const { login } = useAuth();
  const [userEnsName, setUserEnsName] = useState<string>();
  const [paperUserDetails, setPaperUserDetails] = useState<{
    email: string;
    walletAdderss: string;
  }>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchEnsName = async (address: string) =>
    getEnsName(address).then((userEns) => userEns && setUserEnsName(userEns));

  const onLoginSuccess = async (code: string) => {
    setIsLoading(true);
    const userToken = await fetchPaperToken(code);
    localStorage.setItem("paper-user-token", userToken);
    getUserDetails(userToken);
    setIsLoading(false);
  };

  const getUserDetails = async (userToken: string) => {
    setIsLoading(true);
    const userDetails = await fetchPaperUser(userToken);
    setPaperUserDetails(userDetails);
    setIsLoading(false);
  };

  useEffect(() => {
    if (account) {
      fetchEnsName(account);
    }
  }, [account]);

  useEffect(() => {
    const userToken = localStorage.getItem("paper-user-token");
    if (userToken) {
      getUserDetails(userToken);
    }
  }, []);

  return (
    <Box p={2}>
      <Grid container alignItems={"center"} rowSpacing={4}>
        <Grid item xs={12} md={5}>
          <Image
            src="/nusic-white.png"
            alt=""
            width={140}
            height={42}
            onClick={() => router.push("/")}
            style={{ cursor: "pointer" }}
          />
        </Grid>
        <Grid item xs={0} md={4}>
          {/* <TextField
              label="Search"
              fullWidth
              onChange={(e) => {
                const _new = songsDataSource.filter(
                  (s) =>
                    s.name
                      ?.toString()
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase()) ||
                    s.singer
                      ?.toString()
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                );
                setSongs(_new);
              }}
            ></TextField> */}
        </Grid>
        <Grid item xs={12} md={3}>
          <Box
            display={"flex"}
            justifyContent="end"
            alignItems={"center"}
            gap={2}
          >
            {account ? (
              <Tooltip title={account} placement={"bottom-start"}>
                <Chip
                  clickable
                  label={
                    userEnsName ||
                    `${account.slice(0, 6)}...${account.slice(
                      account.length - 4
                    )}`
                  }
                  // size="small"
                  color="info"
                  variant="outlined"
                  onClick={() => router.push("/dashboard")}
                />
              </Tooltip>
            ) : (
              <Button
                variant="outlined"
                color="info"
                onClick={(e) => {
                  e.stopPropagation();
                  login();
                }}
                size="small"
              >
                connect
              </Button>
            )}
            {paperUserDetails ? (
              <Chip
                clickable
                label={paperUserDetails.email}
                // size="small"
                color="info"
                variant="outlined"
                onClick={() => router.push("/dashboard")}
              />
            ) : isLoading ? (
              <CircularProgress size={"small"} />
            ) : (
              <PaperSDKProvider
                clientId="6e9df445-cd56-4cbc-b28f-262ab70e7710"
                chainName="Ethereum"
              >
                <LoginWithPaper onSuccess={onLoginSuccess} />
              </PaperSDKProvider>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Header;
