import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import camelcaseKeys from 'camelcase-keys'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import axios from '../../../utils/axios'
import { DB_API_URL } from '../../../config/constants'
import formatDate from '../../../utils/formatDate'
import formatCurrency from '../../../utils/formatCurrency'

import { getAddressString, getCountry } from '../../../utils/AddressHelper'

import useStyles from './CompanyDetails.styles'

import {
	Box,
	Breadcrumbs,
	Card,
	CardHeader,
	Divider,
	Grid,
	LinearProgress,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography
} from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

import InvoicingAddressSingleInfo from '../../../components/invoicing-address/InvoicingAddressSingleInfo'
import Error from '../../../layouts/Main/components/Error'
import DecisionApiTable from '../../../components/decision-api/DecisionApiTable'

const ResultDetail = () => {
	const { t } = useTranslation()

	const history = useHistory()
	const params = useParams()

	const [result, setResult] = useState(null)
	const [decisionApis, setDecisionApis] = useState(null)

	const [persons, setPersons] = useState([])

	const [error, setError] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true)

				let res = await axios.get(`${DB_API_URL}/companies/${params.id}`)
				setResult(camelcaseKeys(res.data, { deep: true }))

				const uuid = res.data.uuid
				const personParams = { company_id: uuid }

				res = await axios.get(`${DB_API_URL}/decisions`, { params: personParams })
				setDecisionApis(camelcaseKeys(res.data, { deep: true }))

				res = await axios.get(`${DB_API_URL}/persons`, { params: personParams })

				const personsData = camelcaseKeys(res.data, { deep: true })
				setPersons(personsData)

				setLoading(false)
			} catch (error) {
				setError(true)
			}
		}

		load()
	}, [params.id])

	const classes = useStyles()

	const gotoPersonTable = (id) => {
		history.push(`/companies/${params.id}/${id}`)
	}

	const Persons = () => {
		return (
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Email</TableCell>
						<TableCell>Phone</TableCell>
						<TableCell>Role</TableCell>
						<TableCell>Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{persons.map((person, i) => {
						return (
							<TableRow
								className={classes.tableRow}
								key={'person-' + i}
								onClick={() => gotoPersonTable(person.uuid)}
							>
								<TableCell>
									{person.data.firstName} {person.data.lastName}
								</TableCell>
								<TableCell>{person.data.email}</TableCell>
								<TableCell>{person.data.phoneNumber}</TableCell>
								<TableCell>{person.roles.join(', ')}</TableCell>
								<TableCell>{person.data.status}</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		)
	}

	const CompanyRating = (props) => {
		const { data } = props

		return (
			<Table>
				<TableBody>
					<TableRow>
						<TableCell variant="head" width="40%">
							Limit Amount
						</TableCell>
						<TableCell>{data.limit ? formatCurrency(data.limit.amount) : ''}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell variant="head">NR Of Credit Defaults</TableCell>
						<TableCell>{data.nrOfCreditDefaults}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell variant="head">Payment Behavior</TableCell>
						<TableCell>{data.paymentBehavior}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell variant="head">Rating</TableCell>
						<TableCell>{data.rating}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell variant="head">Rating Base</TableCell>
						<TableCell>{data.ratingBase}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell variant="head">Rating Economy</TableCell>
						<TableCell>{data.ratingEconomy}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		)
	}

	return (
		<>
			<Box display="flex" justifyContent="space-between">
				<Typography variant="h3" component="h3" gutterBottom={true}>
					{result && result.data.name}
				</Typography>
			</Box>

			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				<Link color="inherit" variant={'subtitle2'} href="/">
					Dashboard
				</Link>
				<Link color="inherit" variant={'subtitle2'} href="/companies">
					Companies
				</Link>
				<Typography variant={'subtitle2'} color="textPrimary">
					Company
				</Typography>
			</Breadcrumbs>

			<Box mt={4}>
				{error ? (
					<Error />
				) : loading ? (
					<LinearProgress />
				) : (
					<Box px={2} mb={6}>
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
												<TableCell>{result.data.name}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell variant={'head'}>
													{t('business_id')}
												</TableCell>
												<TableCell>{result.primaryBusinessId}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell variant={'head'}>{t('phone')}</TableCell>
												<TableCell>{result.data.phoneNumber}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell variant={'head'}>{t('email')}</TableCell>
												<TableCell>{result.data.primaryEmail}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell variant={'head'}>
													{t('street_address')}
												</TableCell>
												<TableCell>{getAddressString('nov', result.data.addresses)}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell variant={'head'}>
													{t('postal_address')}
												</TableCell>
												<TableCell>{getAddressString('nop', result.data.addresses)}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell variant={'head'}>
													{t('country')}
												</TableCell>
												<TableCell>
													{getCountry('nov', result.data.addresses)}
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell variant={'head'}>
													{t('created')}
												</TableCell>
												<TableCell>
													{formatDate(result.createdAt)}
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell variant={'head'}>
													{t('modified')}
												</TableCell>
												<TableCell>
													{result.modifiedAt
														? formatDate(result.modifiedAt)
														: ''}
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

									{result.data.invoicingAddress && (
										<InvoicingAddressSingleInfo
											data={result.data.invoicingAddress}
										/>
									)}
								</Card>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Card component={Paper}>
									<CardHeader title={t('representatives')} />

									<Divider />

									<Persons />
								</Card>
							</Grid>

							<Grid item xs={12} sm={6}>
								{decisionApis && (
									<Card component={Paper}>
										<CardHeader title={t('background_checks')} />

										<Divider />

										<DecisionApiTable tableData={decisionApis} />
									</Card>
								)}
							</Grid>

							<Grid item xs={12} sm={6}>
								<Card component={Paper}>
									<CardHeader title={t('rating_data')} />

									<Divider />

									{result.data.companyRating && (
										<CompanyRating data={result.data.companyRating} />
									)}
								</Card>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Card component={Paper}>
									<CardHeader title={t('company_background')} />

									<Divider />

									<Table>
										<TableBody>
											<TableRow>
												<TableCell variant={'head'} width="40%">
													{t('company_sector')}
												</TableCell>
												<TableCell>{result.data.companySector}</TableCell>
											</TableRow>
											<TableRow>
												<TableCell variant={'head'}>
													{t('tol_code')}
												</TableCell>
												<TableCell />
											</TableRow>
											{result.data.registers?.map((register, i) => {
												return (
													<TableRow key={`registers-${i}`}>
														<TableCell variant={'head'}>
															{' '}
															{register.registerName}{' '}
														</TableCell>
														<TableCell>
															{' '}
															{formatDate(
																register.startDate,
																false
															)}{' '}
														</TableCell>
													</TableRow>
												)
											})}
										</TableBody>
									</Table>
								</Card>
							</Grid>
						</Grid>
					</Box>
				)}
			</Box>
		</>
	)
}

export default ResultDetail
