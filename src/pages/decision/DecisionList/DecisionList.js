import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

import useStyles from './DecisionList.styles'

import axios from '../../../utils/axios'
import { DB_API_URL } from '../../../config/constants'

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
	Box
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

import Error from '../../../layouts/Main/components/Error'
import formatDate from '../../../utils/formatDate'

const DecisionList = () => {
	const history = useHistory()
	const [organizationId, setOrganizationId] = useState('')
	const [results, setResults] = useState([])
	const [error, setError] = useState(false)

	const [page, setPage] = useState(0)
	const [loading, setLoading] = useState(false)

	const [rowsPerPage, setRowsPerPage] = useState(10)

	useEffect(() => {
		Auth.currentAuthenticatedUser().then((authData) => {
			setOrganizationId(authData.attributes['custom:org'])
		})
	}, [])

	useEffect(() => {
		setLoading(true)
		if (organizationId) {
			const params = snakecaseKeys({ organizationId }, { deep: true })
			axios
				.get(`${DB_API_URL}/decisions`, { params })
				.then(({ data }) => {
					data = camelcaseKeys(data, { deep: true })
					setResults(data)

					setLoading(false)
				})
				.catch((e) => {
					setError(true)
				})
		}
	}, [organizationId])

	const classes = useStyles()

	const gotoResultDetail = (id) => {
		history.push(`/decisions/${id}`)
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}

	const getOnePage = () =>
		rowsPerPage > 0
			? results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
			: results

	const ResultTable = () => (
		<TableContainer component={Paper}>
			<Table aria-label="Results Table">
				<TableHead>
					<TableRow>
						<TableCell>Result ID</TableCell>
						<TableCell>Date</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{getOnePage().map((result, i) => (
						<TableRow
							className={classes.tableRow}
							key={`result-table-row-${i}`}
							onClick={() => gotoResultDetail(result.uuid)}
						>
							<TableCell>{result.uuid}</TableCell>
							<TableCell>{formatDate(result.createdAt)}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
							colSpan={3}
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
				Decisions List
			</Typography>

			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				<Link color="inherit" variant={'subtitle2'} href="/">
					Dashboard
				</Link>
				<Typography color="textPrimary" variant={'subtitle2'}>
					Decisions
				</Typography>
			</Breadcrumbs>

			<Box mt={4}>{error ? <Error /> : loading ? <LinearProgress /> : <ResultTable />}</Box>
		</>
	)
}

export default DecisionList
