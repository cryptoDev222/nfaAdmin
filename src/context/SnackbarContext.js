import { createContext, useState } from 'react'

export const SnackbarContext = createContext({
	showMessage: () => {},
	snackbar: {}
})

export const SnackbarProvider = ({ children }) => {
	const [snackbar, setSnackbar] = useState({
		message: '',
		type: 'success',
		open: false
	})

	const showMessage = (message, type = 'success') => {
		setSnackbar({
			message,
			type,
			open: !!message
		})
	}

	const contextValue = {
		showMessage,
		snackbar
	}

	return <SnackbarContext.Provider value={contextValue}>{children}</SnackbarContext.Provider>
}
