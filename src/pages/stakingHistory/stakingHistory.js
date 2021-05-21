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

  return (
    <Container>
      <Paper elevation={0} className={classes.root}>
        <Grid container>
          <Typography variant="h3">Staking History</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Account</TableCell>
                <TableCell align="left">Token</TableCell>
                <TableCell align="left">Gender</TableCell>
                <TableCell align="center">Traits</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="left" className={classes.accountName}>
                  0xff45938223238435de9993434223442
                </TableCell>
                <TableCell align="left" className={classes.accountName}>
                  0xff45938223238435de9993434223442
                </TableCell>
                <TableCell align="left">Female</TableCell>
                <TableCell align="center">6</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>
                  <Grid container justify="center">
                    <Button variant="outlined" color="primary">
                      View All
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

export default StakingHistory;
