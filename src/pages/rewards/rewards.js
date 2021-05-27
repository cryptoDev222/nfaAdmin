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

import useStyles from "./rewards.style";

const Rewards = () => {
  const classes = useStyles();

  const [rewardsList, setRewardsList] = useState([]);

  useEffect(() => {
    const params = { chainId: CHAIN_ID };

    axios.get(API_URL + "/rewardsList", { params }).then(({ data }) => {
      setRewardsList(data);
    });
  }, []);

  return (
    <Container>
      <Paper elevation={0} className={classes.root}>
        <Grid container>
          <Typography variant="h3">Rewards</Typography>
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
                    {data["eth_amount"] / Math.pow(10, 18)} ETH
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
                    >
                      Deposit
                    </Button>
                    <Button variant="outlined" color="primary">
                      Activate
                    </Button>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Rewards;
