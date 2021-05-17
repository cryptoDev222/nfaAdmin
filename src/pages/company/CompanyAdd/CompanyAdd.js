import React, { useContext, useEffect, useState } from 'react'
import { Auth } from '@aws-amplify/auth'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SnackbarContext } from '../../../context/SnackbarContext'

// import axiosBase from 'axios'
import axios from '../../../utils/axios'
import { KONTAKTO_API_URL, GENERIC_API_URL, DB_API_URL } from '../../../config/constants'
import snakecaseKeys from 'snakecase-keys'

import BackgroundCheckConfirmDialog from './BackgroundCheckConfirmDialog'

import useStyles from './CompanyAdd.styles'

import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardHeader,
	Checkbox,
	CircularProgress,
	Divider,
	FormControlLabel,
	Grid,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableRow,
	TextField,
	Typography
} from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

import InvoicingAddressSingleInfo from '../../../components/invoicing-address/InvoicingAddressSingleInfo'
import Error from '../../../layouts/Main/components/Error'
import { Autocomplete } from '@material-ui/lab'

import { getAddressString, getCountry } from '../../../utils/AddressHelper'

const CompanyAdd = () => {
	const { t } = useTranslation()

	const { showMessage } = useContext(SnackbarContext)

	const history = useHistory()

	const [error, setError] = useState(false)

	const [searching, setSearching] = useState(false)
	const [searchStartingReady, setSearchStartingReady] = useState(false)
	// const [companyName, setCompanyName] = useState('')
	const [companies, setCompanies] = useState([])
	const [company, setCompany] = useState(null)

	const [existingCompanyId, setExistingCompanyId] = useState(null)

	const [loading, setLoading] = useState(false)
	const [companyData, setCompanyData] = useState(null)
	const [saving, setSaving] = useState(false)

	const [organizationId, setOrganizationId] = useState(null)

	const [shouldCheckEligibility, setShouldCheckEligibility] = useState(false)
	const [shouldCheckCredit, setShouldCheckCredit] = useState(false)
	const [shouldCheckAdditionalDocuments, setShouldCheckAdditionalDocuments] = useState(false)

	const [backgroundChecking, setBackgroundChecking] = useState(false)

	const backgroundCheckEnabled =
		shouldCheckEligibility || shouldCheckCredit || shouldCheckAdditionalDocuments

	const COMPANY_SEARCH_DEBOUNCE_TIMEOUT = 200
	const [companySearchDebounceHandler, setCompanySearchDebounceHandler] = useState(null)
	const [companySearchRequestSource, setCompanySearchRequestSource] = useState(null)

	const [openBackgroundCheckConfirmDialog, setOpenBackgroundCheckConfirmDialog] = useState(false)

	useEffect(() => {
		Auth.currentAuthenticatedUser().then((authData) => {
			setOrganizationId(authData.attributes['custom:org'])
		})
	}, [])

	const searchCompanies = (companyName) => {
		setSearching(true)

		const source = axios.CancelToken.source()
		setCompanySearchRequestSource(source)

		axios
			.get(`${KONTAKTO_API_URL}/search/${companyName}`, { cancelToken: source.token })
			.then(({ data }) => {
				setCompanies(
					data.map(({ businessName, businessId }) => ({
						name: businessName,
						primaryBusinessId: businessId
					}))
				)
				finishCompanySearching()
			})
			.catch((e) => {
				if (!axios.isCancel(e)) {
					finishCompanySearching()
					setCompanies([])
				}
			})
	}

	const cancelCompanySearching = () => {
		if (companySearchRequestSource) {
			companySearchRequestSource.cancel(
				'The request has been cancelled due to another new request'
			)
		}
		if (companySearchDebounceHandler) {
			clearTimeout(companySearchDebounceHandler)
			setCompanySearchDebounceHandler(null)
		}

		finishCompanySearching()
	}

	const finishCompanySearching = () => {
		setCompanySearchRequestSource(null)
		setSearching(false)
	}

	const handleCompanyNameChange = (event, companyName) => {
		cancelCompanySearching()

		if (!companyName || companyName.length < 3) {
			setSearchStartingReady(false)
			finishCompanySearching()
			setCompanies([])
			return
		}

		setSearchStartingReady(true)

		setCompanySearchDebounceHandler(
			setTimeout(() => {
				searchCompanies(companyName)
			}, COMPANY_SEARCH_DEBOUNCE_TIMEOUT)
		)
	}

	useEffect(() => {
		setExistingCompanyId(null)

		if (!company) {
			return
		}

		const fetchCompanyData = async () => {
			setLoading(true)
			axios
				.get(`${KONTAKTO_API_URL}/companyInfo/${company.primaryBusinessId}`)
				.then(({ data }) => {
					if (data.finvoice) {
						data.invoicingAddress = data.finvoice
						delete data.finvoice
					}
					setCompanyData(data)
				})
				.catch(() => {
					setError(true)
				})
				.finally(() => {
					setLoading(false)
				})
		}

		fetchCompanyData()
	}, [company])

	const handleSaveCompany = async () => {
		setSaving(true)

		axios
			.post(`${DB_API_URL}/companies`, {
				...snakecaseKeys({ organizationId, ...company }, { deep: true }),
				data: companyData
			})
			.then(({ data }) => {
				showMessage(t('company.add.message.success', { name: data.data.name }), 'success')

				const companyId = data.uuid
				setExistingCompanyId(companyId)
				runBackgroundCheck(companyId).then(() => {
					openCompany(companyId)
				})
			})
			.catch((e) => {
				if (!e) {
					showMessage(t('company.add.message.error'), 'error')
					return
				}

				if (e.response?.status === 400) {
					setExistingCompanyId(e.response.data.uuid)

					if (backgroundCheckEnabled) setOpenBackgroundCheckConfirmDialog(true)
					else showMessage(t('company.add.message.error.duplicated'), 'error')
				} else if (e?.message) showMessage(e.message, 'error')
				else if (e.toJSON) {
					const data = e.toJSON
					showMessage(data.message || t('company.add.message.error'), 'error')
				} else {
					showMessage(t('company.add.message.error'), 'error')
				}
			})
			.finally(() => {
				setSaving(false)
			})
	}

	const runBackgroundCheck = (companyId = null) => {
		const params = {
			businessId: company.primaryBusinessId,
			companyId: companyId ?? existingCompanyId,
			organizationId: organizationId
		}

		setBackgroundChecking(true)
		const promises = []

		if (shouldCheckEligibility)
			promises.push(axios.get(`${GENERIC_API_URL}/business-eligibility`, { params }))

		if (shouldCheckCredit)
			promises.push(axios.get(`${GENERIC_API_URL}/credit-decision`, { params }))

		// if (shouldCheckAdditionalDocuments) {
		// }

		return (
			Promise.all(promises)
				.then(() => {
					showMessage(t('company.add.message.background_check.success'), 'success')
				})
				.catch((e) => {
					// console.log(e)
					showMessage(t('company.add.message.background_check.error'), 'error')
				})
				.finally(() => {
					setBackgroundChecking(false)
				})
		)
	}

	const openCompany = (companyId = null) => {
		history.push(`/companies/${companyId ?? existingCompanyId}`)
	}

	const classes = useStyles()

	return (
		<>
			<Box display="flex" justifyContent="space-between">
				<Typography variant="h3" component="h3" gutterBottom={true}>
					{t('company.add.title')}
				</Typography>
			</Box>

			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				<Link color="inherit" variant={'subtitle2'} href="/">
					{t('dashboard')}
				</Link>
				<Link color="inherit" variant={'subtitle2'} href="/companies">
					{t('companies')}
				</Link>
				<Typography variant={'subtitle2'} color="textPrimary">
					{t('company.add.title')}
				</Typography>
			</Breadcrumbs>

			<Box mt={4} px={3}>
				<Box>
					<Autocomplete
						id="company-search"
						className={classes.searchBox}
						fullWidth
						value={company}
						options={companies}
						getOptionLabel={(company) => company.name}
						onChange={(event, selectedCompany) => setCompany(selectedCompany)}
						onInputChange={handleCompanyNameChange}
						loading={searching}
						noOptionsText={
							searchStartingReady
								? t('company.add.search.no_companies_found')
								: t('company.add.search.not_ready')
						}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder={t('company.add.search.placeholder')}
								variant="outlined"
								InputProps={{
									...params.InputProps,
									endAdornment: (
										<React.Fragment>
											{searching ? (
												<CircularProgress color="inherit" size={20} />
											) : null}
											{params.InputProps.endAdornment}
										</React.Fragment>
									)
								}}
							/>
						)}
					/>
				</Box>
				<Box mt={4}>
					{error ? (
						<Error />
					) : loading || !companyData ? (
						<Box className={classes.empty}>{loading && <CircularProgress />}</Box>
					) : (
						<Box>
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<Card component={Paper}>
										<CardHeader title={t('general_info')} />

										<Divider />

										<Table>
											<TableBody>
												<TableRow>
													<TableCell variant={'head'} width="40%">
														{t('name')}
													</TableCell>
													<TableCell>{companyData.name}</TableCell>
												</TableRow>
												<TableRow>
													<TableCell variant={'head'}>
														{t('business_id')}
													</TableCell>
													<TableCell>
														{company && company.primaryBusinessId}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell variant={'head'}>
														{t('phone')}
													</TableCell>
													<TableCell>{companyData.phoneNumber}</TableCell>
												</TableRow>
												<TableRow>
													<TableCell variant={'head'}>
														{t('email')}
													</TableCell>
													<TableCell>
														{companyData.primaryEMail}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell variant={'head'}>
														{t('street_address')}
													</TableCell>
													<TableCell>
														{getAddressString(
															'nov',
															companyData.addresses
														)}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell variant={'head'}>
														{t('postal_address')}
													</TableCell>
													<TableCell>
														{getAddressString(
															'nop',
															companyData.addresses
														)}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell variant={'head'}>
														{t('country')}
													</TableCell>
													<TableCell>
														{getCountry('nov', companyData.addresses)}
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</Card>
								</Grid>

								<Grid item xs={12} sm={6}>
									<Card component={Paper}>
										<CardHeader title={t('invoicing_address')} />

										<Divider />

										{companyData.invoicingAddress ? (
											<InvoicingAddressSingleInfo
												data={companyData.invoicingAddress}
											/>
										) : (
											<Box p={2}>
												<Typography variant="body1">
													{t('company.add.no_invoice_info_found')}
												</Typography>
											</Box>
										)}
									</Card>
								</Grid>
							</Grid>
						</Box>
					)}
				</Box>
				<Box mt={3}>
					<Box>
						<FormControlLabel
							control={
								<Checkbox
									checked={shouldCheckEligibility}
									onChange={(event) => {
										setShouldCheckEligibility(event.target.checked)
									}}
									color="primary"
								/>
							}
							label={t('company.add.background_check.eligibility')}
						/>
					</Box>
					<Box>
						<FormControlLabel
							control={
								<Checkbox
									checked={shouldCheckCredit}
									onChange={(event) => {
										setShouldCheckCredit(event.target.checked)
									}}
									color="primary"
								/>
							}
							label={t('company.add.background_check.credit')}
						/>
					</Box>
					<Box>
						<FormControlLabel
							control={
								<Checkbox
									checked={shouldCheckAdditionalDocuments}
									onChange={(event) => {
										setShouldCheckAdditionalDocuments(event.target.checked)
									}}
									color="primary"
								/>
							}
							label={t('company.add.background_check.additional_documents')}
						/>
					</Box>
				</Box>
				<Box mt={2} className={classes.actions}>
					<Button
						color="primary"
						variant="contained"
						disabled={!company || !companyData || saving || existingCompanyId}
						onClick={handleSaveCompany}
					>
						{t('company.add.button.title.save')}
					</Button>
					{saving && (
						<Box ml={2}>
							<CircularProgress size={30} />
						</Box>
					)}
					{existingCompanyId && (
						<Box ml={2}>
							<Button
								color="secondary"
								variant="contained"
								disabled={backgroundChecking}
								onClick={() => openCompany()}
							>
								{t('company.add.button.title.open')}
							</Button>
						</Box>
					)}
					{backgroundCheckEnabled && existingCompanyId && (
						<Box ml={2}>
							<Button
								color="secondary"
								variant="contained"
								disabled={backgroundChecking}
								onClick={() => runBackgroundCheck()}
							>
								{t('company.add.button.title.perform_background_checks_again')}
							</Button>
						</Box>
					)}
					{backgroundChecking && (
						<>
							<Box ml={2}>
								<CircularProgress size={30} color="secondary" />
							</Box>
							<Box ml={2}>
								<Typography variant="subtitle1" color="secondary">
									{t('company.add.message.background_check_in_progress')}
								</Typography>
							</Box>
						</>
					)}
				</Box>
			</Box>
			<BackgroundCheckConfirmDialog
				open={openBackgroundCheckConfirmDialog}
				setOpen={setOpenBackgroundCheckConfirmDialog}
				onConfirm={runBackgroundCheck}
			/>
		</>
	)
}

export default CompanyAdd
