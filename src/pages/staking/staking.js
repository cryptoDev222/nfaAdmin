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

import useStyles from './staking.style'

const Staking = () => {
  const classes = useStyles()

  return (
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
          <TableRow>
            <TableCell align="left" className={classes.accountName}>
              0xff45938223238435de9993434223442
            </TableCell>
            <TableCell align="left" className={classes.accountName}>
              0xff45938223238435de9993434223442
            </TableCell>
            <TableCell align="left">Female</TableCell>
            <TableCell align="center">2</TableCell>
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
  );
};

export default Staking;
