import { useState, useEffect, useContext } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Modal,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import axios from "axios";
import { CHAIN_ID, API_URL } from "../../config/constants";

import { ContractContext } from "../../context";

const TokenModal = ({ isOpen, handleClose, title, tokenID }) => {
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
    mT20: {
      marginTop: "20px",
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

  const [classValue, setClassValue] = useState(1);

  const [token, setToken] = useState(null);

  const { initiateToken } = useContext(ContractContext);

  useEffect(() => {
    const params = { chainId: CHAIN_ID };
    axios.get(API_URL + `/tokens/${tokenID}`, { params }).then(({ data }) => {
      setToken(data[0]);
    });
  }, [tokenID]);

  const handleChange = (e) => {
    setClassValue(e.target.value);
  };

  const handleConfirm = () => {
    initiateToken(tokenID, token["gender"], classValue);
    handleClose();
    setClassValue(1);
  };

  const classList = [
    { label: "Class #1", value: 1 },
    { label: "Class #2", value: 2 },
    { label: "Class #3", value: 3 },
  ];

  return (
    <Modal open={isOpen} onClose={handleClose} className={classes.modal}>
      <Paper className={classes.modalBox}>
        <Typography variant="h4">{title}</Typography>
        <Grid
          container
          direction="column"
          alignItems="center"
          className={classes.modalContainer}
        >
          <Typography variant="h5" className={classes.mT20}>
            Token Name:{" "}
            {token?.name && token?.name !== "null"
              ? token?.name
              : "NFA# " + tokenID}
          </Typography>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Select Class</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={classValue}
              onChange={handleChange}
            >
              {classList.map((classInfo, index) => (
                <MenuItem key={index} value={classInfo["value"]}>
                  {classInfo["label"]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default TokenModal;
