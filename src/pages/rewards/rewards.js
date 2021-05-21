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
} from "@material-ui/core"

import useStyles from './rewards.style'

const Rewards = () => {
  const classes = useStyles()

  return (
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
          <TableRow>
            <TableCell align="left" className={classes.accountName}>
              0xff45938223238435de9993434223442
            </TableCell>
            <TableCell align="center">2</TableCell>
            <TableCell align="center">
              0.4ETH
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>
              <Grid container justify="center">
                <Button className={classes.mR12} variant="outlined" color="primary">
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
  );
};

export default Rewards;