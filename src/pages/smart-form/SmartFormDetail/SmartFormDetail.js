import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useParams } from 'react-router-dom'
import camelcaseKeys from 'camelcase-keys'
import axios from '../../../utils/axios'
import { DB_API_URL } from '../../../config/constants'

import { Box, Card, Grid, LinearProgress, Paper, Tab, Tabs, Typography } from '@material-ui/core'
import useStyles from './SmartFormDetail.styles'

import ApprovalRequestTable from '../../../components/approval-request/ApprovalRequestTable'
import DecisionApiTable from '../../../components/decision-api/DecisionApiTable'

const SmartFormDetail = (props) => {
	const params = useParams()
	const [smartFormLoading, setSmartFormLoading] = useState(false)
	const [smartForm, setSmartForm] = useState(null)
	const [approvalRequests, setApprovalRequests] = useState(null)
	const [decisionApis, setDecisionApis] = useState(null)

	const smartFormApiUrl = `${DB_API_URL}/smart-forms/${params.id}`
	useEffect(() => {
		const loadSmartForm = async () => {
			setSmartFormLoading(true)

			let res = await axios.get(smartFormApiUrl)
			setSmartForm(camelcaseKeys(res.data, { deep: true }))

			res = await axios.get(`${smartFormApiUrl}/approval-requests`)
			setApprovalRequests(camelcaseKeys(res.data, { deep: true }))

			res = await axios.get(`${smartFormApiUrl}/decision-apis`)
			setDecisionApis(camelcaseKeys(res.data, { deep: true }))

			setSmartFormLoading(false)
		}
		loadSmartForm()
	}, [smartFormApiUrl])

	const classes = useStyles()

	const RequestData = () => {
		const [value, setValue] = useState('additional-kontakto-data')

		const handleChange = (event, newValue) => {
			setValue(newValue)
		}

		const a11yProps = (index) => {
			return {
				id: `simple-tab-${index}`,
				'aria-controls': `simple-tabpanel-${index}`
			}
		}

		return (
			<Box mt={3}>
				<Typography variant="subtitle1">Request</Typography>
				<Card variant="outlined">
					<Tabs
						value={value}
						indicatorColor="primary"
						textColor="primary"
						onChange={handleChange}
						aria-label="wrapped label tabs example"
					>
						<Tab
							value="additional-kontakto-data"
							label="Additional Kontakto Data"
							{...a11yProps('additional-kontakto-data')}
						/>
						<Tab value="buyer-info" label="Buyer Info" {...a11yProps('buyer-info')} />
						<Tab
							value="company-info"
							label="Company Info"
							{...a11yProps('company-info')}
						/>
						<Tab value="feedback" label="Feedback" {...a11yProps('feedback')} />
						<Tab
							value="invoice-info"
							label="Invoice Info"
							{...a11yProps('invoice-info')}
						/>
						<Tab value="terms" label="Terms" {...a11yProps('terms')} />
					</Tabs>
					<TabPanel value={value} index="additional-kontakto-data">
						<AdditionalKontaktoData
							data={smartForm.formRequest.additionalKontaktoData}
						/>
					</TabPanel>
					<TabPanel value={value} index="buyer-info">
						{smartForm.formRequest.buyerInfo && (
							<BuyerInfo data={smartForm.formRequest.buyerInfo} />
						)}
					</TabPanel>
					<TabPanel value={value} index="company-info">
						{smartForm.formRequest.companyInfo && (
							<CompanyInfo data={smartForm.formRequest.companyInfo} />
						)}
					</TabPanel>
					<TabPanel value={value} index="feedback">
						{smartForm.formRequest.feedback && smartForm.formRequest.feedback.freeText}
					</TabPanel>
					<TabPanel value={value} index="invoice-info">
						{smartForm.formRequest.invoiceInfo && (
							<InvoiceInfo data={smartForm.formRequest.invoiceInfo} />
						)}
					</TabPanel>
					<TabPanel value={value} index="terms">
						{smartForm.formRequest.terms && (
							<Terms data={smartForm.formRequest.terms} />
						)}
					</TabPanel>
				</Card>
			</Box>
		)
	}
	const TabPanel = (props) => {
		const { children, value, index, ...other } = props

		return (
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`full-width-tabpanel-${index}`}
				aria-labelledby={`full-width-tab-${index}`}
				{...other}
			>
				{value === index && <Box p={3}>{children}</Box>}
			</div>
		)
	}

	TabPanel.propTypes = {
		children: PropTypes.node,
		index: PropTypes.any.isRequired,
		value: PropTypes.any.isRequired
	}

	const AdditionalKontaktoData = (props) => {
		return (
			<table width="100%">
				<tbody>
					<tr>
						<td width="50%">Business Line Tol Code:</td>
						<td>{props.data.businessLineTolCode}</td>
					</tr>
					<tr>
						<td width="50%">Company Sector:</td>
						<td>{props.data.companySector}</td>
					</tr>
				</tbody>
			</table>
		)
	}

	const BuyerInfo = (props) => {
		return (
			<table width="100%">
				<tbody>
					<tr>
						<td width="50%">Email:</td>
						<td>
							<a href={`mailto:${props.data.email}`}>{props.data.email}</a>
						</td>
					</tr>
					<tr>
						<td width="50%">First Name:</td>
						<td>{props.data.firstName}</td>
					</tr>
					<tr>
						<td width="50%">Last Name:</td>
						<td>{props.data.lastName}</td>
					</tr>
				</tbody>
			</table>
		)
	}

	const Address = (props) => {
		return (
			<table width="100%">
				<tbody>
					<tr>
						<td width="50%">City:</td>
						<td>{props.data.city}</td>
					</tr>
					<tr>
						<td width="50%">Street:</td>
						<td>{props.data.street}</td>
					</tr>
					<tr>
						<td width="50%">Zip:</td>
						<td>{props.data.zip}</td>
					</tr>
				</tbody>
			</table>
		)
	}

	const CompanyInfo = (props) => {
		return (
			<table width="100%">
				<tbody>
					<tr>
						<td width="50%">Business ID:</td>
						<td>{props.data.businessId}</td>
					</tr>
					<tr>
						<td width="50%">Name:</td>
						<td>{props.data.name}</td>
					</tr>
					<tr>
						<td width="50%" valign="top">
							Offical Address:
						</td>
						<td>
							<Address data={props.data.officialAddress} />
						</td>
					</tr>
					<tr>
						<td width="50%" valign="top">
							User Provided Address:
						</td>
						<td>
							<Address data={props.data.userProvidedAddress} />
						</td>
					</tr>
				</tbody>
			</table>
		)
	}

	const InvoiceInfo = (props) => {
		return (
			<table width="100%">
				<tbody>
					<tr>
						<td width="50%">Operator:</td>
						<td>{props.data.operator}</td>
					</tr>
					<tr>
						<td width="50%">OVT:</td>
						<td>{props.data.ovt}</td>
					</tr>
				</tbody>
			</table>
		)
	}

	const Terms = (props) => {
		return (
			<table width="100%">
				<tbody>
					<tr>
						<td width="50%">Marketing:</td>
						<td>{props.data.marketing}</td>
					</tr>
					<tr>
						<td width="50%">Privacy Poicy:</td>
						<td>{props.data.privacyPolicy}</td>
					</tr>
					<tr>
						<td width="50%">Terms of Service:</td>
						<td>{props.data.termsOfService}</td>
					</tr>
				</tbody>
			</table>
		)
	}

	return (
		<div>
			<nav>
				<Link to={'/smart-forms'}>Back to List</Link>
			</nav>

			{smartFormLoading ? (
				<LinearProgress />
			) : (
				<div className="smart-form-detail">
					{smartForm && (
						<div className="smart-form-data">
							<h2>Form Data</h2>
							<Paper className={classes.paper}>
								<Card variant="outlined" className={classes.primaryDataCard}>
									<Grid container spacing={1}>
										<Grid item xs={12} sm={6}>
											<Typography variant="subtitle2">Form Name: </Typography>
										</Grid>
										<Grid item xs={12} sm={6}>
											{smartForm.formName}
										</Grid>
										<Grid item xs={12} sm={6}>
											<Typography variant="subtitle2">User: </Typography>
										</Grid>
										<Grid item xs={12} sm={6}>
											{smartForm.user}
										</Grid>
									</Grid>
								</Card>
								<RequestData />
							</Paper>
						</div>
					)}

					{approvalRequests && (
						<div className="approval-request-list">
							<h2>Approval Request List</h2>
							<ApprovalRequestTable tableData={approvalRequests} />
						</div>
					)}

					{decisionApis && (
						<div className="approval-request-list">
							<h2>Decision Api List</h2>
							<DecisionApiTable tableData={decisionApis} />
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default SmartFormDetail
