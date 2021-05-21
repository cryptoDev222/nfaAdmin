import { makeStyles } from '@material-ui/styles'

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
}));

export default useStyles;
