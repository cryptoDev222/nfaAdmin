import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import camelcaseKeys from 'camelcase-keys'

import { Auth } from '@aws-amplify/auth'

import { Box, Button, LinearProgress, Typography, Link, Breadcrumbs } from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

import axios from '../../../utils/axios'
import { AUTH_API_URL } from '../../../config/constants'

import { OrganisationTable, UserForm } from '../../../components/organisation'
import Error from '../../../layouts/Main/components/Error'

const Organisation = () => {
	const { t } = useTranslation()

	const [results, setResults] = useState([])
	const [error, setError] = useState(false)

	const [loading, setLoading] = useState(false)
	const [loaded, setLoaded] = useState(false)

	const [userModalOpen, setUserModalOpen] = useState(false)
	const [userEdit, setUserEdit] = useState(null)

	const [organisation, setOrganisation] = useState({})

	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		Auth.currentAuthenticatedUser().then((authData) => {
			const payload = authData.signInUserSession.idToken.payload

			let admin = false
			if (payload && payload['cognito:groups']) {
				admin = payload['cognito:groups'].indexOf('admin') > -1
				setIsAdmin(admin)
			}
		})
	}, [])

	useEffect(() => {
		if (!isAdmin || loaded) return

		const loadUsers = () => {
			setLoading(true)
			axios
				.get(`${AUTH_API_URL}/users`)
				.then(({ data }) => {
					setResults(camelcaseKeys(data.data, { deep: true }))
					setLoading(false)
					setLoaded(true)
				})
				.catch((e) => {
					setError(true)
				})
		}

		loadUsers()
	}, [isAdmin, loaded])

	useEffect(() => {
		axios.get(`${AUTH_API_URL}/org`).then(({ data }) => {
			setOrganisation(camelcaseKeys(data.data, { deep: true }))
		})
	}, [])

	const handleUserFormModal = (user = null) => {
		setUserEdit(user)
		setUserModalOpen(true)
	}

	const loadUsers = () => {
		setLoaded(false)
	}

	const handleClose = (e, reloadUsers = false) => {
		setUserEdit(null)
		setUserModalOpen(false)

		reloadUsers && loadUsers()
	}

	return (
		<>
			<Box mt={2}>
				<Typography variant="h4" component="h2" gutterBottom>
					{t('my_organisation')}
				</Typography>
			</Box>

			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				<Link color="inherit" variant={'subtitle2'} href="/">
					{t('dashboard')}
				</Link>
				<Typography variant={'subtitle2'} color="textPrimary">
					{t('my_organisation')}
				</Typography>
				{organisation && (
					<Typography variant={'subtitle2'} color="textPrimary">
						{organisation.name}
					</Typography>
				)}
			</Breadcrumbs>

			{isAdmin && (
				<>
					<Box mt={4} display="flex" justifyContent="space-between">
						<Typography variant="h3" component="h3" gutterBottom={true}>
							User List
						</Typography>

						{isAdmin && (
							<Box my="auto">
								<Button
									variant="contained"
									color="primary"
									onClick={() => {
										handleUserFormModal(null)
									}}
								>
									Add user
								</Button>
							</Box>
						)}
					</Box>

					{userModalOpen ? (
						<UserForm user={userEdit} onModalClose={handleClose} />
					) : (
						<></>
					)}

					<Box mt={4}>
						{error ? (
							<Error />
						) : loading ? (
							<LinearProgress />
						) : (
							<OrganisationTable results={results} />
						)}
					</Box>
				</>
			)}
		</>
	)
}

export default Organisation
