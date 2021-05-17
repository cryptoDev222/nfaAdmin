import React from 'react'

import useStyles from './Login.styles'

import { Box, Toolbar } from '@material-ui/core'
import AppHeader from './layouts/Main/components/AppHeader'
import Logo from './layouts/Main/components/HeaderContent/Logo'

const Login = () => {
	const classes = useStyles()

	return (
		<>
			<AppHeader>
				<Toolbar>
					<Logo />
				</Toolbar>
			</AppHeader>
			<Box className={classes.wrapper}>
			</Box>
		</>
	)
}

export default Login
