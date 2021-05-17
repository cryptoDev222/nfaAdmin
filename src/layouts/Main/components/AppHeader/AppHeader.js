import React from 'react'

import useStyles from './AppHeader.styles'

import { AppBar } from '@material-ui/core'

const AppHeader = (props) => {
	const classes = useStyles()

	return (
		<AppBar position="fixed" elevation={0} className={classes.appBar}>
			{props.children}
		</AppBar>
	)
}

export default AppHeader
