import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  button: {
    fontWeight: 700,
    borderRadius: "14px",
    fontSize: "16px",
    whiteSpace: "nowrap",
  },
  accountName: {
    fontWeight: "700",
    fontSize: "14px",
    width: "fit-content",
    maxWidth: "120px",
    marginRight: "0px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  tableContainer: {
    width: "100%",
    position: "relative",
    overflow: "auto",
    padding: theme.spacing(1),
  },
}));

export default useStyles;
