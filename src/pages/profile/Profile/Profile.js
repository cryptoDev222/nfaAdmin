import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Auth } from 'aws-amplify'
import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography
} from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import PasswordRequirements from '../../../components/shared/PasswordRequirements'

const Profile = () => {
	const { t } = useTranslation()

	const [user, setUser] = useState(null)
	const [passwords, setPassowrds] = useState({
		current: '',
		new: '',
		confirm: '',
		showCurrent: false,
		showNew: false
	})
	const [passwordStatus, setPasswordStatus] = useState(null)

	useEffect(() => {
		async function loadUserInfo() {
			Auth.currentUserInfo()
				.then((userInfo) => {
					setUser({
						username: userInfo.username,
						email: userInfo.attributes.email
					})
				})
				.catch(() => {})
		}
		loadUserInfo()
	}, [])

	const handleInputChange = (prop) => (event) => {
		setPassowrds({ ...passwords, [prop]: event.target.value })
	}

	const handleChangePassword = (e) => {
		e.preventDefault()
		setPasswordStatus(null)

		if (passwords.confirm !== passwords.new) {
			setPasswordStatus(t('passwords_mismatch'))
			return
		}

		const form = e.target

		Auth.currentAuthenticatedUser()
			.then((user) => {
				return Auth.changePassword(user, passwords.current, passwords.new)
			})
			.then((data) => {
				setPasswordStatus('Success!')
				form.reset()
			})
			.catch((err) => {
				setPasswordStatus(err.message)
			})
	}

	return (
		<>
			<Box display="flex" justifyContent="space-between">
				<Typography variant="h3" component="h3" gutterBottom={true}>
					Profile
				</Typography>
			</Box>

			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				<Link color="inherit" variant={'subtitle2'} href="/">
					Dashboard
				</Link>
				<Typography variant={'subtitle2'} color="textPrimary">
					Profile
				</Typography>
			</Breadcrumbs>

			<Box mt={4}>
				{user && (
					<>
						<Box mb={6}>
							<TableContainer component={Paper}>
								<Table aria-label="<Card>">
									<TableHead>
										<TableRow>
											<TableCell>{t('email')}</TableCell>
											<TableCell>{t('username')}</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell>{user.email}</TableCell>
											<TableCell>{user.username}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</Box>
						<Box mb={6}>
							<Card component={Paper}>
								<CardHeader title={t('password')} />

								<Divider />

								<form noValidate autoComplete="off" onSubmit={handleChangePassword}>
									<CardContent>
										<Box mb={3}>
											<PasswordRequirements />
										</Box>

										<Grid container spacing={2} alignItems="center">
											<Grid item xs={12} sm={4}>
												<TextField
													type={'password'}
													label="Current password"
													variant="outlined"
													required
													fullWidth={true}
													onChange={handleInputChange('current')}
												/>
											</Grid>
											<Grid item xs={12} sm={4}>
												<TextField
													type={'password'}
													label="New password"
													variant="outlined"
													required
													fullWidth={true}
													onChange={handleInputChange('new')}
												/>
											</Grid>
											<Grid item xs={12} sm={4}>
												<TextField
													type={'password'}
													label="Confirm password"
													variant="outlined"
													required
													fullWidth={true}
													onChange={handleInputChange('confirm')}
												/>
											</Grid>
										</Grid>

										{passwordStatus && (
											<Box mt={3} width="75%">
												<Typography variant="subtitle1" gutterBottom={true}>
													{passwordStatus}
												</Typography>
											</Box>
										)}
									</CardContent>

									<Divider />

									<CardContent>
										<Button type={'submit'} variant="contained" color="primary">
											{t('change_password')}
										</Button>
									</CardContent>
								</form>
							</Card>
						</Box>
					</>
				)}
			</Box>
		</>
	)
}

export default Profile
