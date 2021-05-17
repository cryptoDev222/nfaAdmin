import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import camelcaseKeys from 'camelcase-keys'

import axios from '../../../utils/axios'
import { DB_API_URL } from '../../../config/constants'

import {
	Box,
	Breadcrumbs,
	LinearProgress,
	Link,
	Paper,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Tabs,
	Typography
} from '@material-ui/core'

import { InvoicingAddressInfo } from '../../../components/invoicing-address'
import Error from '../../../layouts/Main/components/Error'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

const FormDetail = () => {
	const params = useParams()

	const [smartFormLoading, setSmartFormLoading] = useState(false)
	const [smartForm, setSmartForm] = useState(null)
	const [formData, setFormData] = useState(null)
	const [error, setError] = useState(false)

	useEffect(() => {
		const loadSmartForm = async () => {
			try {
				setSmartFormLoading(true)

				let res = await axios.get(`${DB_API_URL}/forms/${params.id}`)
				setSmartForm(camelcaseKeys(res.data, { deep: true }))

				if (res.data.data && Object.keys(res.data.data).length > 0) {
					setFormData(camelcaseKeys(res.data.data, { deep: true }))
				}

				setSmartFormLoading(false)
			} catch (error) {
				setError(true)
			}
		}
		loadSmartForm()
	}, [params.id])

	const RequestData = () => {
		const [value, setValue] = useState('people')

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
			<Box mt={4}>
				<Tabs
					value={value}
					indicatorColor="primary"
					textColor="primary"
					onChange={handleChange}
					aria-label="wrapped label tabs example"
				>
					<Tab value="people" label="People" {...a11yProps('people')} />
					<Tab value="company-info" label="Company Info" {...a11yProps('company-info')} />
					<Tab value="free-text" label="Freetext" {...a11yProps('free-text')} />
					<Tab value="invoice-info" label="Invoice Info" {...a11yProps('invoice-info')} />
					<Tab value="terms" label="Terms" {...a11yProps('terms')} />
				</Tabs>

				<TabPanel value={value} index="people">
					{formData.persons && (
						<TableContainer component={Paper}>
							<People data={formData.persons} />
						</TableContainer>
					)}
				</TabPanel>
				<TabPanel value={value} index="company-info">
					{formData.company && (
						<TableContainer component={Paper}>
							<CompanyInfo data={formData.company} />
						</TableContainer>
					)}
				</TabPanel>
				<TabPanel value={value} index="free-text">
					{formData.textBlocks && (
						<TableContainer component={Paper}>
							<FreeText data={formData.textBlocks} />
						</TableContainer>
					)}
				</TabPanel>
				<TabPanel value={value} index="invoice-info">
					{formData.invoicingAddresses && (
						<TableContainer component={Paper}>
							<InvoicingAddressInfo data={formData.invoicingAddresses} />
						</TableContainer>
					)}
				</TabPanel>
				<TabPanel value={value} index="terms">
					{formData.terms && (
						<TableContainer component={Paper}>
							<Terms data={formData.terms} />
						</TableContainer>
					)}
				</TabPanel>
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
				{value === index && <Box mt={4}>{children}</Box>}
			</div>
		)
	}

	TabPanel.propTypes = {
		children: PropTypes.node,
		index: PropTypes.any.isRequired,
		value: PropTypes.any.isRequired
	}

	const People = (props) => {

		return Object.keys(props.data).map((key, i) => {
			const person = props.data[key]
			return (
				<Table width="100%" key={i}>
					<TableBody>
						<TableRow>
							<TableCell width="30%" variant={'head'}>
								Email:
							</TableCell>
							<TableCell>
								<a href={`mailto:${person.email}`}>{person.email}</a>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width="30%" variant={'head'}>
								First Name:
							</TableCell>
							<TableCell>{person.firstName}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width="30%" variant={'head'}>
								Last Name:
							</TableCell>
							<TableCell>{person.lastName}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			)
		})
	}

	const Address = (props) => {
		return (
			<>
				<TableRow>
					<TableCell variant={'head'} width="30%">
						City:
					</TableCell>
					<TableCell>{props.data.city}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell variant={'head'}>Street:</TableCell>
					<TableCell>{props.data.street}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell variant={'head'}>Zip:</TableCell>
					<TableCell>{props.data.zip}</TableCell>
				</TableRow>
			</>
		)
	}

	const FreeText = (props) => {
		return props.data.map((data, i) => {
			return (
				<Table width="100%" key={i}>
					<TableBody>
						<TableRow>
							<TableCell width="30%">{data.name}</TableCell>
							<TableCell>{data.text}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			)
		})
	}

	const CompanyInfo = (props) => {
		const id = props.data.ids.filter((id) => id.idType === 'BID')

		return (
			<Table width="100%">
				<TableBody>
					<TableRow>
						<TableCell variant={'head'} width="30%">
							Business ID:
						</TableCell>
						<TableCell>{id.length > 0 ? id[0].idValue : ''}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell variant={'head'} width="30%">
							Name:
						</TableCell>
						<TableCell>{props.data.name}</TableCell>
					</TableRow>

					<Address data={props.data.addresses[0]} />
				</TableBody>
			</Table>
		)
	}

	const Terms = (props) => {
		return (
			<Table width="100%">
				<TableBody>
					{props.data.map((term, i) => {
						return (
							<TableRow key={`term-key-${i}`}>
								<TableCell width="30%">
									{term.termName.replace(/_/g, ' ')}
								</TableCell>
								<TableCell>{term.status}</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		)
	}

	return (
		<>
			<Typography variant={'h3'} gutterBottom>
				Form Data
			</Typography>

			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				<Link color="inherit" variant={'subtitle2'} href="/">
					Dashboard
				</Link>
				<Typography variant={'subtitle2'} color="textPrimary">
					Form
				</Typography>
			</Breadcrumbs>

			<Box mt={4}>
				{error ? (
					<Error />
				) : smartFormLoading ? (
					<LinearProgress />
				) : (
					<div className="smart-form-detail">
						{smartForm && (
							<div>{formData ? <RequestData /> : <p>Form data was not saved</p>}</div>
						)}
					</div>
				)}
			</Box>
		</>
	)
}

export default FormDetail
