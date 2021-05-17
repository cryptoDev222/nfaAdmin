import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
	root: {
		transition: '0.3s'
	},
	avatar: {
		transition: '0.3s',
		margin: '0 auto',
		marginBottom: theme.spacing(2)
	},
	box: {
		borderRadius: theme.shape.borderRadius,
		backgroundColor: theme.palette.background.neutral
	}
}))

export default useStyles
