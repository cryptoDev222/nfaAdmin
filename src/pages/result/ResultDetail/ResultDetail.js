import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import camelcaseKeys from 'camelcase-keys'

import axios from '../../../utils/axios'
import { DB_API_URL } from '../../../config/constants'

import formatDate from '../../../utils/formatDate'
import formatCurrency from '../../../utils/formatCurrency'

import useStyles from './Results.styles'

import DecisionApiTable from '../../../components/decision-api/DecisionApiTable'
import InvoicingAddress from '../../../components/invoicing-address/InvoicingAddress'
import Error from '../../../layouts/Main/components/Error'

import {
	Card,
	LinearProgress,
	Link,
	Paper,
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	Typography,
	Box,
	Button,
	Breadcrumbs,
	CardHeader,
	Divider,
	Grid
} from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

const ResultDetail = () => {
	const { t } = useTranslation()

	const params = useParams()

	const [result, setResult] = useState(null)
	const [error, setError] = useState(false)
	const [formRequest, setFormRequest] = useState(null)

	const [loading, setLoading] = useState(true)
	const [decisionApis, setDecisionApis] = useState(null)

	const resultApiUrl = `${DB_API_URL}/results`

	const [statusUpdating, setStatusUpdating] = useState(false)

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true)

				let res = await axios.get(`${resultApiUrl}/${params.id}`)
				setResult(camelcaseKeys(res.data, { deep: true }))

				if (res.data.form_data && Object.keys(res.data.form_data).length > 0) {
					setFormRequest(camelcaseKeys(res.data.form_data, { deep: true }))
				}

				if (res.data) {
					res = await axios.get(`${DB_API_URL}/decisions?result_id=${res.data.uuid}`)
					setDecisionApis(camelcaseKeys(res.data, { deep: true }))
				}

				setLoading(false)
			} catch (error) {
				setError(true)
			}
		}

		load()
	}, [resultApiUrl, params.id])

	const classes = useStyles()

	const updateStatus = async () => {
		setStatusUpdating(true)
		let res = await axios.put(`${resultApiUrl}/${result.uuid}/update-status`, {
			status: 'DONE'
		})

		result.status = res.data.status

		setResult(result)
		setStatusUpdating(false)
	}

	const People = (props) => {
		return (
			<Table>
				<TableHead>
					<TableRow>
						<TableCell width="30%"> Name </TableCell>
						<TableCell>Email</TableCell>
						<TableCell>Phone</TableCell>
						<TableCell>Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.keys(props.data).map((person, i) => {
						const data = props.data[person]
						return (
							<TableRow key={`result-row-${i}`}>
								<TableCell>
									{data.firstName} {data.lastName}
								</TableCell>
								<TableCell>{data.email}</TableCell>
								<TableCell>{data.phoneNumber}</TableCell>
								<TableCell>{data.status}</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		)
	}

	const parseComponentDate = (label, value) => {
		if (
			label.toLowerCase() === 'toivottu toimitusajankohta' &&
			isNaN(Date.parse(value)) === false
		) {
			return new Date(value).toLocaleString('en-GB')
		}
		return value
	}

	const Components = (props) => {
		return (
			<>
				{props.data.map((component, i) => {
					return (
						<div key={`result-row-${i}`}>
							<Box p={2}>
								<Typography
									classes={{ subtitle2: classes.formLabel }}
									variant="subtitle2"
								>
									{component.name}:{' '}
								</Typography>
							</Box>
							<Divider />
							<Table>
								<TableBody>
									{component.inputs.map((input, inputIndex) => {
										return (
											<TableRow key={`input-row-${inputIndex}`}>
												<TableCell width="40%" variant={'head'}>
													{input.label}
												</TableCell>
												<TableCell>
													{parseComponentDate(input.label, input.value)}
												</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</div>
					)
				})}
			</>
		)
	}

	return (
		<>
			<Box display="flex" justifyContent="space-between">
				<Typography variant="h3" component="h3" gutterBottom={true}>
					Result
				</Typography>

				{result &&
					(!result.status ||
						(result.status && result.status.toLowerCase() !== 'done' && (
							<Box my="auto">
								<Button
									variant="contained"
									color="primary"
									onClick={updateStatus}
									disabled={statusUpdating}
								>
									Done
								</Button>
							</Box>
						)))}
			</Box>

			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				<Link color="inherit" variant={'subtitle2'} href="/">
					Dashboard
				</Link>
				<Link color="inherit" variant={'subtitle2'} href="/results">
					Results
				</Link>
				<Typography variant={'subtitle2'} color="textPrimary">
					Result
				</Typography>
			</Breadcrumbs>

			<Box mt={4}>
				{error ? (
					<Error />
				) : loading ? (
					<LinearProgress />
				) : (
					<Box px={2}>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6}>
								<Card component={Paper}>
									<CardHeader title={t('result')} />

									<Divider />

									<Table>
										<TableBody>
											<TableRow>
												<TableCell width="40%" variant={'head'}>
													{t('company_name')}
												</TableCell>
												<TableCell>
													{formRequest && formRequest.company
														? formRequest.company.name
														: ''}
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell variant={'head'}>
													{t('suggested_payment_method')}
												</TableCell>
												<TableCell>
													{result.result
														? result.result.suggestedPaymentMethod
														: ''}
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell variant={'head'}>
													{t('decision_reason')}
												</TableCell>
												<TableCell>
													{result.result
														? result.result.decisionReason
														: ''}
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell variant={'head'}>
													{t('company_rating')}
												</TableCell>
												<TableCell>
													{result.result
														? result.result.companyRating
														: ''}
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell variant={'head'}>
													{t('suggested_credit_limit')}
												</TableCell>
												<TableCell>
													{result.result
														? formatCurrency(
																result.result.suggestedCreditLimit
														  )
														: ''}
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell variant={'head'}>
													{t('status')}
												</TableCell>
												<TableCell>{result.status}</TableCell>
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
													{formatDate(result.modifiedAt)}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</Card>
							</Grid>

							<Grid item xs={12} sm={6}>
								<InvoicingAddress data={formRequest.invoicingAddresses} />
							</Grid>

							<Grid item xs={12} sm={6}>
								<Card component={Paper}>
									<CardHeader title={t('components')} />

									<Divider />

									{formRequest.components ? (
										<Components data={formRequest.components} />
									) : (
										''
									)}
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
									<CardHeader title={t('form_contact_persons')} />

									<Divider />

									{formRequest.persons ? (
										<People data={formRequest.persons} />
									) : (
										''
									)}
								</Card>
							</Grid>
						</Grid>

						<Box mt={6} mb={3}>
							{!formRequest && (
								<Card className={classes.primaryDataCard}>
									Final decision was not completed due to technical error.
								</Card>
							)}

							<Link href={'/forms/' + result.formId}>View entire form content</Link>
						</Box>

						<Box mb={6}>
							<Link href={'/companies/' + result.companyId}>View company </Link>
						</Box>
					</Box>
				)}
			</Box>
		</>
	)
}

export default ResultDetail
