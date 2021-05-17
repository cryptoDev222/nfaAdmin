import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router'

import formatDate from '../../../utils/formatDate'

import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

import axios from '../../../utils/axios'
import { DB_API_URL } from '../../../config/constants'

import useStyles from './CompanyList.styles'

import {
	Paper,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TableFooter,
	LinearProgress,
	InputBase,
	IconButton,
	Box,
	TableSortLabel,
	Button,
	Grid
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

import { PAGE_SIZE, ORDER_DIRS } from '../../../config/constants'

const CompanyListTable = ({ organizationId, setError }) => {
	const history = useHistory()
	const { t } = useTranslation()
	const classes = useStyles()

	const [companies, setCompanies] = useState([])
	const [orderBy, setOrderBy] = useState('createdAt')
	const [orderDir, setOrderDir] = useState('asc')
	const [keyword, setKeyword] = useState('')
	const [offset, setOffset] = useState(0)
	const [loadFinished, setLoadFinish] = useState(false)

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadMore()
	}, [organizationId, offset, orderBy, orderDir, keyword])

	const loadMore = () => {
		setLoading(true)
		setLoadFinish(false)

		if (organizationId) {
			const params = snakecaseKeys(
				{
					organizationId,
					limit: PAGE_SIZE,
					offset,
					orderBy,
					orderDir,
					q: keyword
				},
				{ deep: true }
			)
			console.log(params)

			axios
				.get(`${DB_API_URL}/companies`, { params })
				.then(({ data }) => {
					data = camelcaseKeys(data, { deep: true })
					let temp = companies
					temp = temp.concat(data)
					setCompanies(temp)
					setLoading(false)
					if (data.length < PAGE_SIZE) setLoadFinish(true)
				})
				.catch((e) => {
					setError(true)
					setLoading(false)
				})
		}
	}

	const resetSearch = () => {
		setOffset(0)
		setCompanies([])
	}

	const handleSearchFormSubmit = (event) => {
		event.preventDefault()
		const value = event.target[0].value
		if (value !== keyword) setKeyword(value)
		else if (!offset) {
			loadMore()
		}
		resetSearch()
	}

	const handleSortChange = (newOrderBy) => {
		if (newOrderBy === orderBy)
			setOrderDir(orderDir === ORDER_DIRS.DESC ? ORDER_DIRS.ASC : ORDER_DIRS.DESC)
		else setOrderDir(ORDER_DIRS.ASC)

		setOrderBy(newOrderBy)

		resetSearch()
	}

	const gotoResultDetail = (id) => {
		history.push(`/companies/${id}`)
	}

	const headCells = [
		{ id: 'name', company: true, label: t('company_name') },
		{ id: 'status', label: t('status') },
		{ id: 'createdAt', label: t('date') }
	]

	return (
		<>
			<Paper
				elevation={1}
				component="form"
				className={classes.root}
				onSubmit={handleSearchFormSubmit}
			>
				<InputBase
					placeholder="Search with keywords"
					inputProps={{ 'aria-label': 'search google maps' }}
				/>
				<IconButton type="submit" className="iconButton" aria-label="search">
					<SearchIcon />
				</IconButton>
			</Paper>
			<TableContainer component={Paper}>
				<Table aria-label="Companies Table">
					<TableHead>
						<TableRow>
							{headCells.map((headCell) => (
								<TableCell
									key={headCell.id}
									sortDirection={orderBy === headCell.id ? orderDir : false}
								>
									<TableSortLabel
										active={orderBy === headCell.id}
										direction={orderBy === headCell.id ? orderDir : 'asc'}
										onClick={() => {
											handleSortChange(headCell.id, headCell.company)
										}}
									>
										{headCell.label}
									</TableSortLabel>
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{companies.map((result, i) => (
							<TableRow
								className={classes.tableRow}
								key={`result-table-row-${i}`}
								onClick={() => gotoResultDetail(result.uuid)}
							>
								<TableCell>{result.data.name}</TableCell>
								<TableCell>{result.status}</TableCell>
								<TableCell>{formatDate(result.createdAt)}</TableCell>
							</TableRow>
						))}
					</TableBody>
					<TableFooter>
						{!loadFinished && (
							<TableRow>
								<TableCell colSpan={3}>
									<Grid
										container
										justify="center"
										direction="column"
										alignItems="center"
									>
										{loading && <LinearProgress className={classes.progress} />}
										<Button
											disabled={loading}
											variant="outlined"
											color="primary"
											onClick={() => setOffset(offset + PAGE_SIZE)}
										>
											Load More
										</Button>
									</Grid>
								</TableCell>
							</TableRow>
						)}
					</TableFooter>
				</Table>
			</TableContainer>
		</>
	)
}

export default CompanyListTable
