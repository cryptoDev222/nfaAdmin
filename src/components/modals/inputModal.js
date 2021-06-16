import { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Modal,
  TextField,
  useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const InputModal = ({ isOpen, handleClose, confirmAction, title, desc }) => {
  const responsiveTheme = useTheme();

  const isMobile = useMediaQuery(responsiveTheme.breakpoints.down("sm"), {
    defaultMatches: true,
  });

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: `${isMobile ? "16px" : "64px"}`,
      maxWidth: "1440px",
    },
    button: {
      fontWeight: 700,
      borderRadius: "14px",
      fontSize: "16px",
    },
    requestBtn: {
      width: "fit-content",
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalBox: {
      width: "100%",
      padding: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      maxWidth: "600px",
      margin: theme.spacing(1),
    },
    modalContainer: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    mR12: {
      marginRight: "12px",
    },
    requestBtn: {
      width: "fit-content",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      width: "calc(100% - 16px)",
    },
  }));

  const classes = useStyles();

  const [descValue, setDescValue] = useState("");

  const handleChange = (e) => {
    setDescValue(e.target.value);
  };

  const handleConfirm = () => {
    confirmAction(descValue, setDescValue);
  };

  return (
    <Modal open={isOpen} onClose={handleClose} className={classes.modal}>
      <Paper className={classes.modalBox}>
        <Typography variant="h4">{title}</Typography>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.modalContainer}
        >
          <TextField
            onChange={handleChange}
            value={descValue}
            label={desc}
            className={classes.formControl}
          />
          <Grid item>
            <Button
              variant="contained"
              className={`${classes.button} ${classes.requestBtn}`}
              color="primary"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

export default InputModal;
