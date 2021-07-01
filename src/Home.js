import "./Home.css";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import NFAStaked from "./components/NFAStaked";
import {
  Grid,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Male from "./assets/male-gender.png";
import Female from "./assets/female-sign.png";
import BabyCyan from "./assets/toddler.png";
import Accounts from "./assets/accounts.png";
import theme from "./theme";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { ContractContext, SnackbarContext } from "./context";
import InputModal from "./components/modals/inputModal";
import BabyModal from "./components/modals/babyModal";
import TokenModal from "./components/modals/tokenModal";

const Home = () => {
  const history = useHistory();

  const {
    initiateToken,
    deposit,
    activateRewards,
    stakedList,
    rewardsList,
    stakeHistory,
    tokensForInitiate,
  } = useContext(ContractContext);
  const { showMessage } = useContext(SnackbarContext);

  const responsiveTheme = useTheme();
  const isMobile = useMediaQuery(responsiveTheme.breakpoints.down("sm"), {
    defaultMatches: true,
  });
  const useStyles = makeStyles((theme) => ({
    root: {
      // padding: `${isMobile ? "16px" : "64px"}`,
      maxWidth: "1440px",
    },
    logo: {
      "& >img": {
        width: "50%",
      },
      marginTop: `${isMobile ? "16px" : "-16px"}`,
      marginBottom: theme.spacing(2),
    },
    firstTitle: {
      margin: `36px 24px 18px 24px`,
      fontSize: "24px",
      fontWeight: "900",
    },
    title: {
      margin: theme.spacing(3),
      fontSize: "24px",
      fontWeight: "900",
    },
    button: {
      fontWeight: 700,
      borderRadius: "14px",
      fontSize: "16px",
      whiteSpace: "nowrap",
    },
    Btn: {
      cursor: "pointer",
    },
    padding6: {
      padding: "6px",
    },
    topText: {
      fontWeight: "700",
      fontSize: "14px",
      display: "inline-flex",
      width: "fit-content",
      marginRight: "12px",
    },
    accountName: {
      fontWeight: "700",
      fontSize: "14px",
      width: "fit-content",
      maxWidth: "120px",
      marginRight: "0px",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    accountLast: {
      fontWeight: "700",
      fontSize: "14px",
      width: "fit-content",
      marginRight: "12px",
      "@media(max-width: 600px)": {
        marginRight: "4px",
      },
    },
    testBlock: {
      marginTop: "42px",
    },
    mR12: {
      marginRight: "12px",
    },
    requestBtn: {
      width: "fit-content",
    },
    mT20: {
      marginTop: "20px",
    },
    tableContainer: {
      width: "100%",
      position: "relative",
      overflow: "auto",
      padding: theme.spacing(1),
    },
  }));

  const classes = useStyles();

  // Deposit Action part//
  const [isDepositModal, setDepositModal] = React.useState(false);

  const confirmDeposit = (amount, setAmount) => {
    if (isNaN(amount)) {
      showMessage("Please insert correct value!", "error");
      return;
    }
    deposit(amount);
    setDepositModal(false);
    setAmount("");
  };
  // /////////////////////

  // Activat Action part//
  const [isActivateModal, setActivateModal] = React.useState(false);

  const confirmActivate = (amount, setAmount) => {
    if (isNaN(amount)) {
      showMessage("Please insert correct value!", "error");
      return;
    }
    activateRewards(amount);
    setActivateModal(false);
    setAmount("");
  };
  // /////////////////////

  // Initiate Baby Action part//
  const [isBabyModal, setBabyModal] = React.useState(false);
  const [motherID, setMotherID] = React.useState(null);

  const handleBabyModalOpen = (tokenId) => {
    setMotherID(tokenId);
    setBabyModal(true);
  };
  // ///////////////////////////

  const [isTokenInitiateModal, setInitiateTokenModal] = React.useState(false);
  const [initiateTokenID, setInitiateTokenID] = React.useState(null);

  const handleTokenInitiateModalOpen = (tokenId) => {
    setInitiateTokenID(tokenId);
    setInitiateTokenModal(true);
  };

  // Initiate Token Action part//

  return (
    <Grid container justify="center">
      <InputModal
        title="Deposit Modal"
        isOpen={isDepositModal}
        desc="Deposit Amount"
        handleClose={() => setDepositModal(false)}
        confirmAction={confirmDeposit}
      />
      <InputModal
        title="Activate Modal"
        isOpen={isActivateModal}
        desc="Activate Amount"
        handleClose={() => setActivateModal(false)}
        confirmAction={confirmActivate}
      />
      <BabyModal
        title="Baby Modal"
        isOpen={isBabyModal}
        desc="Baby ID"
        handleClose={() => setBabyModal(false)}
        motherID={motherID}
      />
      <TokenModal
        title="Token Initiate Modal"
        isOpen={isTokenInitiateModal}
        desc="Class Name"
        handleClose={() => setInitiateTokenModal(false)}
        tokenID={initiateTokenID}
      />
      <Grid container className={classes.root}>
        <Grid container justify="center" spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <NFAStaked
              bgColor={theme.palette.secondary.light}
              imgSrc={Female}
              count={stakedList.length}
              text="Staking"
            />
          </Grid>
          <Grid className={classes.padding6} item xs={12} sm={6} md={3}>
            <NFAStaked
              bgColor={theme.palette.primary.main}
              imgSrc={Male}
              count={stakeHistory.length}
              text="Total Staking"
            />
          </Grid>
          <Grid className={classes.padding6} item xs={12} sm={6} md={3}>
            <NFAStaked
              bgColor={theme.palette.primary.light}
              imgSrc={BabyCyan}
              count={rewardsList.length}
              text="Rewards"
            />
          </Grid>
          <Grid className={classes.padding6} item xs={12} sm={6} md={3}>
            <NFAStaked
              bgColor={theme.palette.third.light}
              imgSrc={Accounts}
              count={tokensForInitiate.length}
              text="Tokens For Initiate"
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={6} sm={12} xs={12}>
            <Typography className={classes.mT20} variant="h3">
              On Staking
            </Typography>
            <Grid className={classes.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Account</TableCell>
                    <TableCell align="left">Token</TableCell>
                    <TableCell align="left">Gender</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stakedList.slice(0, 5).map((data) => (
                    <TableRow key={data.id}>
                      <TableCell align="left" className={classes.accountName}>
                        {data["account_id"]}
                      </TableCell>
                      <TableCell align="left" className={classes.accountName}>
                        {data["name"]
                          ? data["name"]
                          : "NFA #" + data["token_id"]}
                      </TableCell>
                      <TableCell align="left" className={classes.accountName}>
                        {data["gender"] === 1
                          ? "Female"
                          : data["gender"] === 2
                          ? "Male"
                          : "Baby"}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          disabled={data["gender"] !== 1}
                          onClick={() => handleBabyModalOpen(data["token_id"])}
                        >
                          Initiate Baby
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Grid container justify="center">
                        <Button
                          onClick={() => history.push("/staking")}
                          variant="outlined"
                          color="primary"
                        >
                          View All
                        </Button>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </Grid>
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <Typography className={classes.mT20} variant="h3">
              Rewards
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Account</TableCell>
                  <TableCell align="center">Baby</TableCell>
                  <TableCell align="center">Reward</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rewardsList.slice(0, 5).map((data) => (
                  <TableRow key={data.id}>
                    <TableCell align="left" className={classes.accountName}>
                      {data["account_id"]}
                    </TableCell>
                    <TableCell align="center" className={classes.accountName}>
                      {data["baby_count"]}
                    </TableCell>
                    <TableCell align="center" className={classes.accountName}>
                      {(data["eth_amount"] / Math.pow(10, 18) + "").slice(0, 6)}{" "}
                      ETH
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Grid container justify="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        className={classes.mR12}
                        onClick={() => setDepositModal(true)}
                      >
                        Deposit
                      </Button>
                      <Button
                        onClick={() => setActivateModal(true)}
                        variant="outlined"
                        color="primary"
                      >
                        Activate
                      </Button>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Grid>
          <Grid item md={12} sm={12} lg={12} xs={12}>
            <Typography variant="h3" className={classes.mT20}>
              Initiate
            </Typography>
          </Grid>
          <Grid className={classes.tableContainer} item md={12} sm={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Token</TableCell>
                  <TableCell align="center">Gender</TableCell>
                  <TableCell align="center">Traits</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tokensForInitiate.map((token, index) => (
                  <TableRow key={index}>
                    <TableCell align="left" className={classes.accountName}>
                      {token["name"] && token["name"] !== "null"
                        ? token["name"]
                        : "NFA# " + token["token_id"]}
                    </TableCell>
                    <TableCell align="center">
                      {token["gender"] === 1
                        ? "Female"
                        : token["gender"] === 2
                        ? "Male"
                        : "Baby"}
                    </TableCell>
                    <TableCell align="center">{token["traits"]}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={() =>
                          handleTokenInitiateModalOpen(token["token_id"])
                        }
                      >
                        Initiate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
          <Typography className={classes.mT20} variant="h3">
            Staking History
          </Typography>
          <Grid className={classes.tableContainer} item md={12} sm={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Account</TableCell>
                  <TableCell align="left">Token</TableCell>
                  <TableCell align="center">Gender</TableCell>
                  <TableCell align="center">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stakeHistory.slice(0, 5).map((data) => (
                  <TableRow key={data.id}>
                    <TableCell align="left" className={classes.accountName}>
                      {data["account_id"]}
                    </TableCell>
                    <TableCell align="left" className={classes.accountName}>
                      {data["name"] !== '' ? data["name"] : "NFA #" + data["token_id"]}
                    </TableCell>
                    <TableCell align="center" className={classes.accountName}>
                      {data["gender"] === 1
                        ? "Female"
                        : data["gender"] === 2
                        ? "Male"
                        : "Baby"}
                    </TableCell>
                    <TableCell align="center" className={classes.accountName}>
                      {data["stake_date"]?.slice(0, 10)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Grid container justify="center">
                      <Button
                        onClick={() => history.push("/history")}
                        variant="outlined"
                        color="primary"
                      >
                        View All
                      </Button>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
