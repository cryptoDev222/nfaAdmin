import { useState, useContext } from "react";
import BabyModal from "../../components/modals/babyModal";

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
} from "@material-ui/core";

import useStyles from "./staking.style";
import { ContractContext } from "../../context";

const Staking = () => {
  const classes = useStyles();

  const { stakedList, initiatedBabyCount } = useContext(ContractContext);

  // Initiate Baby Action part//
  const [isBabyModal, setBabyModal] = useState(false);
  const [motherID, setMotherID] = useState(null);

  const handleBabyModalOpen = (tokenId) => {
    setMotherID(tokenId);
    setBabyModal(true);
  };
  // ///////////////////////////

  return (
    <Container>
      <BabyModal
        title="Baby Modal"
        isOpen={isBabyModal}
        desc="Baby ID"
        handleClose={() => setBabyModal(false)}
        motherID={motherID}
      />
      <Paper elevation={0} className={classes.root}>
        <Grid container>
          <Typography variant="h3">On Staking</Typography>
          <Grid className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Account</TableCell>
                  <TableCell align="left">Token</TableCell>
                  <TableCell align="left">Gender</TableCell>
                  <TableCell align="center">Baby Count</TableCell>
                  <TableCell align="center">Initiated Baby Count</TableCell>
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
                    <TableCell align="center" className={classes.accountName}>
                      {initiatedBabyCount.hasOwnProperty(data["token_id"])
                        ? initiatedBabyCount[data["token_id"]]
                        : 0}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBabyModalOpen(data["token_id"])}
                        disabled={data["gender"] !== 1}
                        className={classes.button}
                      >
                        Initiate Baby
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {stakedList.length === 0 ? (
                  <TableCell colSpan={6} align="center">
                    There is no items on staking.
                  </TableCell>
                ) : (
                  ""
                )}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Staking;
