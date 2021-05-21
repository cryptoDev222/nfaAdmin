import {
  Grid,
  Button,
  Typography,
} from "@material-ui/core";

import { useHistory } from "react-router";

import useStyles from "./NoPage.style"

const NoPage = () => {
  const history = useHistory();

  const classes = useStyles()

  return (
    <Grid className={classes.container} container justify="center" alignItems="center" direction="column">
      <Typography variant="h1">Error: 404</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => history.push("/")}
      >
        Go to Home
      </Button>
    </Grid>
  );
};

export default NoPage
