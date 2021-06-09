import { useState, useContext } from "react";
import TokenModal from "../../components/modals/tokenModal";

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

import useStyles from "./token.style";
import { ContractContext } from "../../context";

const Tokens = () => {
  const classes = useStyles();

  const { tokens } = useContext(ContractContext);

  // ///////////////////////////

  const [isTokenInitiateModal, setInitiateTokenModal] = useState(false);
  const [initiateTokenID, setInitiateTokenID] = useState(null);

  const handleTokenInitiateModalOpen = (tokenId) => {
    setInitiateTokenID(tokenId);
    setInitiateTokenModal(true);
  };

  // Initiate Token Action part//

  return (
    <Container>
      <TokenModal
        title="Token Initiate Modal"
        isOpen={isTokenInitiateModal}
        desc="Class Name"
        handleClose={() => setInitiateTokenModal(false)}
        tokenID={initiateTokenID}
      />
      <Paper elevation={0} className={classes.root}>
        <Grid container>
          <Typography variant="h3">Tokens</Typography>
          <Grid className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Token</TableCell>
                  <TableCell align="left">Gender</TableCell>
                  <TableCell align="center">class</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tokens.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell align="left" className={classes.accountName}>
                      {data["name"] && data["name"] !== "null"
                        ? data["name"]
                        : "NFA# " + data["token_id"]}
                    </TableCell>
                    <TableCell align="left" className={classes.accountName}>
                      {data["gender"] === 1
                        ? "Female"
                        : data["gender"] === 2
                        ? "Male"
                        : "Baby"}
                    </TableCell>
                    <TableCell align="center" className={classes.accountName}>
                      {data["class"] === 0 ? "" : "Class#" + data["class"]}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleTokenInitiateModalOpen(data["token_id"])
                        }
                        disabled={data["class"] !== 0}
                        className={classes.button}
                      >
                        Initiate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {tokens.length === 0 ? (
                  <TableCell colSpan={4} align="center">
                    There is no tokens.
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

export default Tokens;
