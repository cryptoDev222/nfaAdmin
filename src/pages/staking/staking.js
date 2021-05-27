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

import useStyles from "./staking.style";

const Staking = () => {
  const classes = useStyles();

  const [stakedList, setStakedList] = useState([]);

  useEffect(() => {
    const params = { chainId: CHAIN_ID };

    axios.get(API_URL + "/stakedList", { params }).then(({ data }) => {
      setStakedList(data);
    });
  }, []);

  return (
    <Container>
      <Paper elevation={0} className={classes.root}>
        <Grid container>
          <Typography variant="h3">On Staking</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Account</TableCell>
                <TableCell align="left">Token</TableCell>
                <TableCell align="left">Gender</TableCell>
                <TableCell align="center">Baby Count</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stakedList.map((data) => (
                <TableRow key={data.id}>
                  <TableCell align="left" className={classes.accountName}>
                    {data["account_id"]}
                  </TableCell>
                  <TableCell align="left" className={classes.accountName}>
                    {data["token_id"]}
                  </TableCell>
                  <TableCell align="left" className={classes.accountName}>
                    {data["gender"] === 1
                      ? "Female"
                      : data["gender"] === 2
                      ? "Male"
                      : "Baby"}
                  </TableCell>
                  <TableCell align="center" className={classes.accountName}>
                    {data["gender"] === 1 ? data["baby_count"] : ""}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                    >
                      Initiate Baby
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>
                  <Grid container justify="center">
                    <Button variant="outlined" color="primary">
                      Auto Initiate
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

export default Staking;
