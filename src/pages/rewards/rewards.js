import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { API_URL, CHAIN_ID } from "../../config/constants";

import {
  Container,
  Paper,
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

import useStyles from "./rewards.style";

import InputModal from "../../components/modals/inputModal";
import { ContractContext, SnackbarContext } from "../../context";

const Rewards = () => {
  const classes = useStyles();

  const { deposit, activateRewards, rewardsList } = useContext(ContractContext);
  const { showMessage } = useContext(SnackbarContext);

  // Deposit Action part//
  const [isDepositModal, setDepositModal] = useState(false);

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
  const [isActivateModal, setActivateModal] = useState(false);

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

  return (
    <Container>
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
      <Paper elevation={0} className={classes.root}>
        <Grid container>
          <Typography variant="h3">Rewards</Typography>
          <Grid className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Account</TableCell>
                  <TableCell align="center">Baby Count</TableCell>
                  <TableCell align="center">ETH</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rewardsList.map((data) => (
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
                  <TableCell colSpan={3}>
                    <Grid container justify="center">
                      <Button
                        className={classes.mR12}
                        variant="outlined"
                        color="primary"
                        onClick={() => setDepositModal(true)}
                      >
                        Deposit
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setActivateModal(true)}
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
        </Grid>
      </Paper>
    </Container>
  );
};

export default Rewards;
