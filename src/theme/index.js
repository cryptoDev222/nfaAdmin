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
			contrastText: 'white',
			dark: colors.teal[900],
			main: '#00b291',
			light: '#78ffc0',
		},
		secondary: {
			contrastText: 'white',
			dark: colors.purple[900],
			main: colors.purple['A400'],
			light: '#f47af4',
		},
		third: {
			contrastText: 'white',
			dark: colors.orange[900],
			main: colors.orange['A200'],
			light: '#f4b964',
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
