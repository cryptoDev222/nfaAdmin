import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
	tableRow: {
		cursor: 'pointer'
	},
	searchBox: {
		backgroundColor: theme.palette.primary.contrastText,
		borderRadius: theme.spacing(2)
	},
	empty: {
		height: '360px'
	},
	actions: {
		display: 'flex',
		alignItems: 'center'
	}
}))

export default useStyles
