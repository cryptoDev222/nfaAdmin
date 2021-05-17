import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
	header: {
		display: 'flex',
		justifyContent: 'between'
	},
	companyAddButton: {
		marginLeft: 'auto'
	},
	tableRow: {
		cursor: 'pointer'
	},
	progress: {
		margin: theme.spacing(2),
		width: 'calc(100% - 32px)',
	},
	root: {
		margin: `${theme.spacing(2)}px 0px`,
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		height: '48px',
		'&>div': {
			paddingInlineStart: '12px',
			paddingInlineEnd: '60px',
			flexGrow: '1'
		},
		'&>.iconButton': {
			position: 'absolute',
			right: '12px'
		}
	}
}))

export default useStyles
