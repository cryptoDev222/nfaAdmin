import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	Paper,
	TextField,
	Typography
} from '@material-ui/core'
import { useState } from 'react'
import axios from '../../../utils/axios'
import { AUTH_API_URL } from '../../../config/constants'
import { useTranslation } from 'react-i18next'
import PasswordRequirements from '../../shared/PasswordRequirements'

const OrganisationForm = () => {
	const { t } = useTranslation()
	const [status, setStatus] = useState('')
	const [organisation, setOrganisation] = useState({
		name: '',
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	})

	const handleInputChange = (prop) => (event) => {
		setOrganisation({ ...organisation, [prop]: event.target.value })
	}

	const handleAddOrganisation = (e) => {
		e.preventDefault()

		const form = e.target

		setStatus(null)

		if (organisation.password !== organisation.confirmPassword) {
			setStatus(t('passwords_mismatch'))
			return
		}

		axios
			.post(`${AUTH_API_URL}/org`, organisation)
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
	}

	return (
		<Card component={Paper}>
			<CardHeader title={t('add_organisation')} />

			<Divider />

			<form noValidate autoComplete="off" onSubmit={handleAddOrganisation}>
				<CardContent>
					<Box mb={3}>
						<PasswordRequirements />
					</Box>

					<Grid container spacing={2} alignItems="center">
						<Grid item xs={12} sm={4}>
							<TextField
								type={'text'}
								label="Name"
								variant="outlined"
								required
								fullWidth={true}
								onChange={handleInputChange('name')}
							/>
						</Grid>

						<Grid item xs={12} sm={4}>
							<TextField
								type={'text'}
								label="Username"
								variant="outlined"
								required
								fullWidth={true}
								onChange={handleInputChange('username')}
							/>
						</Grid>

						<Grid item xs={12} sm={4}>
							<TextField
								type={'email'}
								label="Email"
								variant="outlined"
								required
								fullWidth={true}
								onChange={handleInputChange('email')}
							/>
						</Grid>

						<Grid item xs={12} sm={4}>
							<TextField
								type={'password'}
								label="New password"
								variant="outlined"
								required
								fullWidth={true}
								onChange={handleInputChange('password')}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								type={'password'}
								label="Confirm password"
								variant="outlined"
								required
								fullWidth={true}
								onChange={handleInputChange('confirmPassword')}
							/>
						</Grid>
					</Grid>

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
					<Button type={'submit'} variant="contained" color="primary">
						{t('add_organisation')}
					</Button>
				</CardContent>
			</form>
		</Card>
	)
}

export default OrganisationForm
