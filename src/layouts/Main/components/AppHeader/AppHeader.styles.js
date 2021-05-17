import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		background: theme.palette.background.paper,
		boxShadow: '2px 2px 4px rgba(0, 0, 0, .1)'
	}
}))

export default useStyles
