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
import { makeStyles, useTheme } from "@material-ui/core/styles";
import axios from "axios";
import { CHAIN_ID, API_URL } from "../../config/constants";

import { ContractContext } from "../../context";

const BabyModal = ({ isOpen, handleClose, title, motherID }) => {
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

  const [babies, setBabies] = useState([]);

  const { initiateBaby } = useContext(ContractContext);

  useEffect(() => {
    const params = { chainId: CHAIN_ID };
    axios
      .get(API_URL + "/getBabiesForInitiate", { params })
      .then(({ data }) => {
        setBabies(data);
        setDescValue(data[0]?.token_id);
      });
    setInterval(() => {
      axios
        .get(API_URL + "/getBabiesForInitiate", { params })
        .then(({ data }) => {
          setBabies(data);
          setDescValue(data[0]?.token_id);
        });
    }, 60000);
  }, []);

  const handleChange = (e) => {
    setDescValue(e.target.value);
  };

  const handleConfirm = () => {
    setBabies((babies) => {
      return babies.filter((baby) => baby.token_id != descValue);
    });
    setDescValue("");
    initiateBaby(motherID, descValue);
    handleClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose} className={classes.modal}>
      <Paper className={classes.modalBox}>
        <Typography variant="h4">{title}</Typography>
        <Grid
          container
          alignItems="center"
          direction="column"
          className={classes.modalContainer}
        >
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Baby ID</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={descValue}
              onChange={handleChange}
            >
              {babies.map((baby, index) => (
                <MenuItem key={index} value={baby["token_id"]}>
                  {baby["token_id"]}
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

export default BabyModal;
