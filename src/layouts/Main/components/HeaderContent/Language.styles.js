import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
	title: {
		flexGrow: 1
	},
	languageButton: {
		fontWeight: 'normal',
		textTransform: 'none'
	},
	languageIcon: {
		color: theme.palette.text.secondary
	},
	btnFlag: {
		height: '100%',
		width: '20px'
	},
	flag: {
		width: '22px',
		marginRight: theme.spacing(1)
	},
	menu: {
		minWidth: '240px'
	}
}))

export default useStyles
