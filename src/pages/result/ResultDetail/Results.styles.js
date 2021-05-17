import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: theme.spacing(2)
	},
	primaryDataCard: {
		padding: theme.spacing(2),
		marginBottom: theme.spacing(2)
	},
	formLabel: {
		fontWeight: 700
	}
}))

export default useStyles
