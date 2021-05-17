import { useTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
import axios from '../../../utils/axios'
import { DB_API_URL, AUTH_API_URL } from '../../../config/constants'
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Checkbox,
	Divider,
	FormControl,
	FormControlLabel,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	TextField,
	Typography
} from '@material-ui/core'
import snakecaseKeys from 'snakecase-keys'

const SmartFormCreateForm = () => {
	const { t } = useTranslation()

	const [status, setStatus] = useState('')
	const [organisations, setOrganisations] = useState([])

	const [saving, setSaving] = useState(false)

	const [smartForm, setSmartForm] = useState({
		organizationId: '',
		name: ''
	})

	const [userNotifications, setUserNotification] = useState({
		enabled: true,
		template: 'form-submitted-notification'
	})

	const [supportNotifications, setSupportNotifications] = useState({
		enabled: true,
		template: 'form-submitted-notification'
	})

	const [recipients, setRecipients] = useState([])

	useEffect(() => {
		axios
			.get(`${AUTH_API_URL}/orgs`)
			.then(({ data }) => {
				setOrganisations(
					data.data.map(({ id, name }) => ({
						id,
						name
					}))
				)
			})
			.catch((e) => {})
	}, [])

	const handleSmartFormInputChange = (prop) => (event) => {
		setSmartForm({ ...smartForm, [prop]: event.target.value })
	}

	const handleUserNotificationsInputChange = (prop, isCheckbox) => (event) => {
		const value = isCheckbox ? event.target.checked : event.target.value
		setUserNotification({ ...userNotifications, [prop]: value })
	}

	const handleSupportNotificationsInputChange = (prop, isCheckbox) => (event) => {
		const value = isCheckbox ? event.target.checked : event.target.value
		setSupportNotifications({ ...supportNotifications, [prop]: value })
	}

	const handleRecipientInputChange = (prop, index) => (event) => {
		const temp = [...recipients]
		temp[index] = { ...temp[index], [prop]: event.target.value }
		setRecipients(temp)
	}

	const handleAddSmartForm = (e) => {
		e.preventDefault()

		setSaving(true)
		setStatus(null)

		const form = e.target

		const data = {
			...smartForm,
			settings: {
				supportNotifications: {
					...supportNotifications,
					recipients: { ...recipients }
				},
				userNotifications: { ...userNotifications }
			}
		}

		axios
			.post(`${DB_API_URL}/smart-forms`, snakecaseKeys(data, { deep: true }))
			.then(({ data }) => {
				console.log(data)
				setStatus('Success!')
				form.reset()
			})
			.catch((e) => {
				console.log(e)
				if (e.response) {
					const data = e.response.data
					setStatus(data.error.message)
				} else {
					setStatus(e.message)
				}
			})
			.finally(() => {
				setSaving(false)
			})
	}

	const addRecipient = (e) => {
		setRecipients([
			...recipients,
			{
				name: '',
				email: ''
			}
		])
	}

	const removeRecipient = (index) => {
		let temp = [...recipients]
		temp.splice(index, 1)
		setRecipients(temp)
	}

	return (
		<Card component={Paper}>
			<CardHeader title={t('add_smart_form')} />

			<Divider />

			<form noValidate autoComplete="off" onSubmit={handleAddSmartForm}>
				<CardContent>
					<Grid container spacing={2} alignItems="center">
						<Grid item xs={12} sm={4}>
							<TextField
								type={'text'}
								label="Name"
								variant="outlined"
								required
								fullWidth={true}
								onChange={handleSmartFormInputChange('name')}
							/>
						</Grid>

						<Grid item xs={12} sm={4}>
							<FormControl variant="outlined" required fullWidth={true}>
								<InputLabel htmlFor="org-select">Organisation</InputLabel>
								<Select
									labelId="org-select-label"
									label="Organisation "
									id="org-select"
									onChange={handleSmartFormInputChange('organizationId')}
								>
									{organisations.map((org, index) => {
										return (
											<MenuItem key={index} value={org.id}>
												{org.name}
											</MenuItem>
										)
									})}
								</Select>
							</FormControl>
						</Grid>
					</Grid>

					<Box mt={6}>
						<Typography gutterBottom={true}>Support notifications</Typography>

						<FormControlLabel
							control={
								<Checkbox
									checked={supportNotifications.enabled}
									onChange={handleSupportNotificationsInputChange(
										'enabled',
										true
									)}
									name="supportNotificationsEnabled"
									color="primary"
								/>
							}
							label="Enabled"
						/>

						<Box mt={2}>
							<Grid container spacing={2} alignItems="center">
								<Grid item xs={12} sm={4}>
									<TextField
										type={'text'}
										label="Template"
										variant="outlined"
										required
										fullWidth={true}
										defaultValue={supportNotifications.template}
										onChange={handleSupportNotificationsInputChange(
											'template',
											false
										)}
									/>
								</Grid>
							</Grid>
						</Box>

						<Box mt={4}>
							<Box mb={2}>
								<Typography gutterBottom={true}>Recipients</Typography>
							</Box>

							{recipients.map((recipient, index) => {
								return (
									<Box key={`repeatable-item-${index}`} mb={3}>
										<Grid container spacing={2} alignItems="center">
											<Grid item xs={12} sm={4}>
												<TextField
													type={'text'}
													label="Recipient name"
													variant="outlined"
													required
													fullWidth={true}
													value={recipient.name}
													onChange={handleRecipientInputChange(
														'name',
														index
													)}
												/>
											</Grid>
											<Grid item xs={12} sm={4}>
												<TextField
													type={'email'}
													label="Recipient email"
													variant="outlined"
													required
													fullWidth={true}
													value={recipient.email}
													onChange={handleRecipientInputChange(
														'email',
														index
													)}
												/>
											</Grid>

											<div>
												<Button
													variant="contained"
													onClick={() => {
														removeRecipient(index)
													}}
												>
													Remove
												</Button>
											</div>
										</Grid>
									</Box>
								)
							})}

							<div>
								<Button variant="contained" onClick={addRecipient}>
									Add recipient
								</Button>
							</div>
						</Box>
					</Box>

					<Box mt={6}>
						<Typography gutterBottom={true}>User notifications</Typography>

						<FormControlLabel
							control={
								<Checkbox
									checked={userNotifications.enabled}
									onChange={handleUserNotificationsInputChange('enabled', true)}
									name="userNotificationsEnabled"
									color="primary"
								/>
							}
							label="Enabled"
						/>

						<Box mt={2}>
							<Grid container spacing={2} alignItems="center">
								<Grid item xs={12} sm={4}>
									<TextField
										type={'text'}
										label="Template"
										variant="outlined"
										required
										fullWidth={true}
										defaultValue={userNotifications.template}
										onChange={handleUserNotificationsInputChange(
											'template',
											false
										)}
									/>
								</Grid>
							</Grid>
						</Box>
					</Box>

					{status && (
						<Box mt={3} width="75%">
							<Typography variant="subtitle1" gutterBottom={true}>
								{status}
							</Typography>
						</Box>
					)}
				</CardContent>

				<Divider />

				<CardContent>
					<Button type={'submit'} variant="contained" color="primary" disabled={saving}>
						{t('add_smart_form')}
					</Button>
				</CardContent>
			</form>
		</Card>
	)
}

export default SmartFormCreateForm
