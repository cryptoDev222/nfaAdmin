import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

import useStyles from './ResultList.styles'

import axios from '../../../utils/axios'
import { DB_API_URL } from '../../../config/constants'

import formatDate from '../../../utils/formatDate'

import { Auth } from '@aws-amplify/auth'

import {
	Paper,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TableFooter,
	TablePagination,
	LinearProgress,
	Breadcrumbs,
	Link,
	Box,
	TableSortLabel
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

import Error from '../../../layouts/Main/components/Error'

const ResultList = () => {
	const { t } = useTranslation()
	const history = useHistory()
	const [organizationId, setOrganizationId] = useState('')
	const [results, setResults] = useState([])
	const [orderBy, setOrderBy] = useState('createdAt')
	const [order, setOrder] = useState('asc')
	const [error, setError] = useState(false)

	const [page, setPage] = useState(0)
	const [resultsLoading, setSmartFormsLoading] = useState(false)

	const [rowsPerPage, setRowsPerPage] = useState(10)

	useEffect(() => {
		Auth.currentAuthenticatedUser().then((authData) => {
			setOrganizationId(authData.attributes['custom:org'])
		})
	}, [])

	useEffect(() => {
		setSmartFormsLoading(true)
		if (organizationId) {
			const params = snakecaseKeys({ organizationId }, { deep: true })
			axios
				.get(`${DB_API_URL}/results`, { params })
				.then(({ data }) => {
					data = camelcaseKeys(data, { deep: true })
					setResults(data.sort(sortByDate))
					setSmartFormsLoading(false)
				})
				.catch((e) => {
					setError(true)
				})
		}
	}, [organizationId])

	const classes = useStyles()

	const gotoResultDetail = (id) => {
		history.push(`/results/${id}`)
	}

	const sortByDate = (a, b) => {
		a = new Date(a.createdAt).getTime()
		b = new Date(b.createdAt).getTime()

		return b - a
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}

	const sortResults = (field, company = false) => {
		if (orderBy === field) {
			results.reverse()
			if (order === 'desc') {
				setOrder('asc')
			} else {
				setOrder('desc')
			}
		} else {
			if (field === 'createdAt') {
				results.sort(sortByDate)
			} else {
				results.sort((a, b) => {
					if (company) {
						a = a.formData && a.formData.company ? a.formData.company : a
						b = b.formData && b.formData.company ? b.formData.company : b
					}

					a = a[field] ? a[field].toLowerCase() : ''
					b = b[field] ? b[field].toLowerCase() : ''

					if (a < b) {
						return -1
					}
					if (a > b) {
						return 1
					}

					return 0
				})
				setOrder('asc')
			}
		}

		setOrderBy(field)
		setResults((results) => [...results])
	}

	const getOnePageSmartForms = () =>
		rowsPerPage > 0
			? results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
			: results

	const headCells = [
		{ id: 'name', company: true, label: t('company_name') },
		{ id: 'status', label: t('status') },
		{ id: 'createdAt', label: t('date') }
	]

	const ResultTable = () => (
		<TableContainer component={Paper}>
			<Table aria-label="Results Table">
				<TableHead>
					<TableRow>
						<TableCell width="20%">{t('id')}</TableCell>
						{headCells.map((headCell) => (
							<TableCell
								key={headCell.id}
								sortDirection={orderBy === headCell.id ? order : false}
							>
								<TableSortLabel
									active={orderBy === headCell.id}
									direction={orderBy === headCell.id ? order : 'asc'}
									onClick={() => {
										sortResults(headCell.id, headCell.company)
									}}
								>
									{headCell.label}
								</TableSortLabel>
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{getOnePageSmartForms().map((result, i) => (
						<TableRow
							className={classes.tableRow}
							key={`result-table-row-${i}`}
							onClick={() => gotoResultDetail(result.id)}
						>
							<TableCell>{result.id}</TableCell>
							<TableCell>
								{result.formData && result.formData.company
									? result.formData.company.name
									: ''}
							</TableCell>
							<TableCell>{result.status}</TableCell>
							<TableCell>{formatDate(result.createdAt)}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
							colSpan={4}
							count={results.length}
							rowsPerPage={rowsPerPage}
							page={page}
							SelectProps={{
								inputProps: { 'aria-label': 'rows per page' },
								native: true
							}}
							onChangePage={handleChangePage}
							onChangeRowsPerPage={handleChangeRowsPerPage}
						/>
					</TableRow>
				</TableFooter>
			</Table>
		</TableContainer>
	)

	return (
		<>
			<Typography variant={'h3'} gutterBottom>
				Results List
			</Typography>

			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				<Link color="inherit" variant={'subtitle2'} href="/">
					Dashboard
				</Link>
				<Typography color="textPrimary" variant={'subtitle2'}>
					Results
				</Typography>
			</Breadcrumbs>

			<Box mt={4}>
				{error ? <Error /> : resultsLoading ? <LinearProgress /> : <ResultTable />}
			</Box>
		</>
	)
}

export default ResultList
