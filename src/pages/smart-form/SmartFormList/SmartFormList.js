import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import camelcaseKeys from 'camelcase-keys'
import axios from '../../../utils/axios'
import { DB_API_URL } from '../../../config/constants'

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
	LinearProgress
} from '@material-ui/core'

const SmartFormList = () => {
	const history = useHistory()
	const [smartFormsLoading, setSmartFormsLoading] = useState(false)
	const [smartForms, setSmartForms] = useState([])

	useEffect(() => {
		async function loadSmartForms() {
			setSmartFormsLoading(true)
			const { data } = await axios.get(`${DB_API_URL}/smart-forms`)
			setSmartForms(camelcaseKeys(data, { deep: true }))
			setSmartFormsLoading(false)
		}

		loadSmartForms()
	}, [])

	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(10)

	const getOnePageSmartForms = () =>
		rowsPerPage > 0
			? smartForms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
			: smartForms

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}

	const gotoSmartFormDetail = (id) => {
		history.push(`/smart-forms/${id}`)
	}

	const SmartFormTable = () => (
		<TableContainer component={Paper}>
			<Table aria-label="Smart Form Table">
				<TableHead>
					<TableRow>
						<TableCell width="30%">Form ID</TableCell>
						<TableCell width="40%">Form Name</TableCell>
						<TableCell>User</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{getOnePageSmartForms().map((smartForm, i) => (
						<TableRow
							key={`smar-form-table-row-${i}`}
							onClick={() => gotoSmartFormDetail(smartForm.id)}
						>
							<TableCell>{smartForm.id}</TableCell>
							<TableCell>{smartForm.formName}</TableCell>
							<TableCell>{smartForm.user}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
							colSpan={3}
							count={smartForms.length}
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
		<div className="smart-form-list">
			<h2>Smart Form List</h2>
			{smartFormsLoading ? <LinearProgress /> : <SmartFormTable />}
		</div>
	)
}

export default SmartFormList
