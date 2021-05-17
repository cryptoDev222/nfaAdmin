import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
	title: {
		flexGrow: 1
	},
	avatarButton: {
		fontWeight: 'normal',
		textTransform: 'none'
	},
	avatarIcon: {
		color: theme.palette.text.primary
	},
	subTitle: {
		color: theme.palette.text.secondary
	},
	menu: {
		minWidth: '240px'
	}
}))

export default useStyles
