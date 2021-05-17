import React from 'react'
import { useTranslation } from 'react-i18next'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Grow,
	Button
} from '@material-ui/core'

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Grow in={true} ref={ref} {...props} />
})

const BackgroundCheckConfirmDialog = ({ open, setOpen, onConfirm }) => {
	const handleClose = () => {
		setOpen(false)
	}

	const handleConfirm = () => {
		onConfirm && onConfirm()

		setOpen(false)
	}

	const { t } = useTranslation()

	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			keepMounted
			onClose={handleClose}
			aria-labelledby={t('company.add.dialog.title.background_check_confirm')}
			aria-describedby={t('company.add.dialog.title.background_check_confirm')}
		>
			<DialogTitle>{t('company.add.dialog.title.background_check_confirm')}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{t('company.add.dialog.text.background_check_confirm')}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="secondary">
					No
				</Button>
				<Button onClick={handleConfirm} color="primary">
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default BackgroundCheckConfirmDialog
