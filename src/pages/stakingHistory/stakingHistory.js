import { useEffect, useState } from "react";
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

import useStyles from "./stakingHistory.style";

const StakingHistory = () => {
  const classes = useStyles();

  const [stakeHistory, setStakeHistory] = useState([]);

  useEffect(() => {
    const params = { chainId: CHAIN_ID };

    axios.get(API_URL + "/stakeHistory", { params }).then(({ data }) => {
      data = data.filter(oneData => oneData['account_id'] !== "0x81d03bF5e59F42B6088bDeAbEF82096578168fbd")
      setStakeHistory(data);
    });
  }, []);

  return (
    <Container>
      <Paper elevation={0} className={classes.root}>
        <Grid container>
          <Typography variant="h3">Staking History</Typography>
          <Grid className={classes.tableContainer}>
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
                {stakeHistory.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell align="left" className={classes.accountName}>
                      {data["account_id"]}
                    </TableCell>
                    <TableCell align="left" className={classes.accountName}>
                      {data["token_id"]}
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
            </Table>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default StakingHistory;
