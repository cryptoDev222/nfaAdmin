import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
	link: {
		textDecoration: 'none',
		color: theme.palette.text.primary
	},
	list: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2)
	},
	listItemText: {
		color: 'inherit',
		fontWeight: 'inherit',
		justifyContent: 'flex-start',
		letterSpacing: 0,
		py: 1.25,
		fontSize: '14px'
	},
	icon: {
		minWidth: '36px',
		color: 'inherit'
	},
	root: {
		color: theme.palette.text.secondary,
		fontWeight: 'medium',
		borderRadius: '20px',
		'&$focusVisible': {
			backgroundColor: theme.palette.action.selected
		},
		'&$selected': {
			backgroundColor: 'transparent'
		},
		'&$selected:hover': {
			backgroundColor: theme.palette.action.selected
		},
		'&$disabled': {
			opacity: 0.5
		}
	},
	selected: {
		fontWeight: 'bold',
		color: theme.palette.primary.main
	}
}))

export default useStyles
