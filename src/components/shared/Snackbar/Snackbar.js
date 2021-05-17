import React, { useContext } from 'react'
import { Snackbar, IconButton } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { Close as CloseIcon } from '@material-ui/icons'
import { SnackbarContext } from '../../../context/SnackbarContext'

import useStyles from './Snackbar.styles'

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

export default function SimpleSnackbar() {
	const classes = useStyles()
	const { snackbar, showMessage } = useContext(SnackbarContext)

	const { message, type, open } = snackbar

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}

		showMessage('', type)
	}

	return (
		<div>
			<Snackbar
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				open={open}
				autoHideDuration={5000}
				onClose={handleClose}
				// message={message ? <span>{message}</span> : null}
				action={[
					<IconButton
						key="close"
						color="inherit"
						className={classes.close}
						onClick={handleClose}
					>
						<CloseIcon />
					</IconButton>
				]}
			>
				<Alert onClose={handleClose} severity={type}>
					{message}
				</Alert>
			</Snackbar>
		</div>
	)
}
