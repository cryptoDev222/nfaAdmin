import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import camelcaseKeys from 'camelcase-keys'
import axios from '../../../utils/axios'
import { DB_API_URL } from '../../../config/constants'

import {
	LinearProgress,
	Link,
	Paper,
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	TableContainer,
	Box,
	Typography,
	Breadcrumbs
} from '@material-ui/core'

import Error from '../../../layouts/Main/components/Error'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import formatDate from '../../../utils/formatDate'

const DecisionDetail = () => {
	const params = useParams()

	const [result, setResult] = useState(null)
	const [error, setError] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true)

				let res = await axios.get(`${DB_API_URL}/decisions/${params.id}`)
				setResult(camelcaseKeys(res.data, { deep: true }))

				setLoading(false)
			} catch (error) {
				setError(true)
			}
		}

		load()
	}, [params.id])

	const parseValue = (value) => {
		return typeof value === 'boolean' ? value.toString() : value
	}

	const NestedTable = (props) => {
		const { data } = props

		return (
			<Table>
				<TableBody>
					{Object.keys(data).map((key) => (
						<TableRow key={key}>
							<TableCell width="20%" component="th" scope="row">
								{key}
							</TableCell>
							{data[key] && typeof data[key] === 'object' ? (
								<NestedObjectRow data={data[key]} />
							) : (
								<TableCell>{parseValue(data[key])}</TableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		)
	}

	const NestedObjectRow = (props) => {
		const { data } = props

		return data ? (
			<TableCell>
				<NestedTable data={data} />
			</TableCell>
		) : (
			<></>
		)
	}

	const Row = (props) => {
		const { data } = props

		let json
		if (typeof data === 'string') {
			try {
				json = JSON.parse(data)
			} catch (error) {}
		} else {
			json = data
		}

		return data ? (
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
					<Box margin={1}>
						{json ? <NestedTable data={json} /> : <TableCell>{data}</TableCell>}
					</Box>
				</TableCell>
			</TableRow>
		) : (
			<></>
		)
	}

	return (
		<>
			<Box display="flex" justifyContent="space-between">
				<Typography variant="h3" component="h3" gutterBottom={true}>
					Decision
				</Typography>
			</Box>

			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				<Link color="inherit" variant={'subtitle2'} href="/">
					Dashboard
				</Link>
				<Link color="inherit" variant={'subtitle2'} href="/decisions">
					Decisions
				</Link>
				<Typography variant={'subtitle2'} color="textPrimary">
					Decision
				</Typography>
			</Breadcrumbs>

			<Box mt={4}>
				{error ? (
					<Error />
				) : loading ? (
					<LinearProgress />
				) : (
					<>
						<Box mb={6}>
							<TableContainer component={Paper}>
								<Table aria-label="Decision Table">
									<TableHead>
										<TableRow>
											<TableCell width="25%">Company ID</TableCell>
											<TableCell width="25%">Created At</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow>
											<TableCell>{result.companyId}</TableCell>
											<TableCell>{formatDate(result.createdAt)}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</Box>

						<Box mb={6}>
							<Typography variant="subtitle1" gutterBottom={true}>
								Request
							</Typography>

							<TableContainer component={Paper}>
								<Table aria-label="Decision Request Table">
									<TableBody>
										<Row data={result.data.request}></Row>
									</TableBody>
								</Table>
							</TableContainer>
						</Box>

						<Box mb={6}>
							<Typography variant="subtitle1" gutterBottom={true}>
								Response
							</Typography>

							<TableContainer component={Paper}>
								<Table aria-label="Decision Response Table">
									<TableBody>
										<Row data={result.data.response}></Row>
									</TableBody>
								</Table>
							</TableContainer>
						</Box>

						<Box mb={6}>
							<Typography variant="subtitle1" gutterBottom={true}>
								Result
							</Typography>

							<TableContainer component={Paper}>
								<Table aria-label="Decision Result Table">
									<TableBody>
										<Row data={result.data.result}></Row>
									</TableBody>
								</Table>
							</TableContainer>
						</Box>
					</>
				)}
			</Box>
		</>
	)
}

export default DecisionDetail
