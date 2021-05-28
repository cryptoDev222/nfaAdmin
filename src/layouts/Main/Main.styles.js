import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.default,
		display: 'flex',
		height: '100%',
		overflow: 'hidden',
		width: '100%'
	},
	wrapper: {
		display: 'flex',
		flex: '1 1 auto',
		overflow: 'hidden',
		paddingTop: theme.spacing(4),
		paddingLeft: theme.spacing(3),
		paddingRight: theme.spacing(3)
	},
	container: {
		display: 'flex',
		flex: '1 1 auto',
		width: '100%',
		position: 'relative',
	},
	rootBox: {
		paddingTop: theme.spacing(8),
		minHeight: '100vh',
		display: 'flex',
		flexDirection: 'column'
	},
	content: {
		flex: '1 1 auto',
		minHeight: '100%',
		width: '100%',
	},
	drawer: {
		flexShrink: 0
	},
	sidebarTrigger: {
		color: theme.palette.text.primary
	}
}))

export default useStyles
