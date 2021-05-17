import { createMuiTheme, colors } from '@material-ui/core'
import shadows from './shadows'
import typography from './typography'

const theme = createMuiTheme({
	palette: {
		background: {
			default: '#F4F6F8',
			paper: colors.common.white,
			neutral: '#f4f5f7'
		},
		primary: {
			contrastText: '#ffffff',
			main: '#5664d2'
		},
		text: {
			primary: '#172b4d',
			secondary: '#6b778c'
		}
	},
	shape: {
		borderRadius: '16px'
	},
	shadows,
	typography,
	overrides: {
		MuiCssBaseline: {
			'@global': {
				'*': {
					boxSizing: 'border-box',
					margin: 0,
					padding: 0
				},
				html: {
					'-webkit-font-smoothing': 'antialiased',
					'-moz-osx-font-smoothing': 'grayscale',
					height: '100%',
					width: '100%'
				},
				body: {
					backgroundColor: '#F4F6F8',
					height: '100%',
					width: '100%'
				},
				a: {
					textDecoration: 'none'
				},
				'#root': {
					height: '100%',
					width: '100%'
				}
			}
		}
	}
})

export default theme
