import { useEffect, useState } from 'react'
import axios from '../../../utils/axios'
import { DB_API_URL } from '../../../config/constants'
import camelcaseKeys from 'camelcase-keys'
import { useParams } from 'react-router-dom'
import {
	Box,
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
	TableRow
} from '@material-ui/core'
import Error from '../../../layouts/Main/components/Error'
import { useTranslation } from 'react-i18next'
import formatDate from '../../../utils/formatDate'

const PersonDetail = () => {
	const { t } = useTranslation()

	const params = useParams()

	const [result, setResult] = useState(null)
	const [error, setError] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true)

				let res = await axios.get(`${DB_API_URL}/persons/${params.personId}`)

				setResult(camelcaseKeys(res.data, { deep: true }))
				setLoading(false)
			} catch (error) {
				setError(true)
			}
		}

		load()
	}, [params.personId])

	return (
		<div>
			<nav>
				<Link href={`/companies/${params.id}`}>Back to company</Link>
			</nav>
			{error ? (
				<Error />
			) : loading ? (
				<LinearProgress />
			) : (
				<Box mt={6} px={2}>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6}>
							<Card component={Paper}>
								<CardHeader title={t('person')} />

								<Divider />

								<Table>
									<TableBody>
										<TableRow>
											<TableCell variant={'head'}>{t('name')}</TableCell>
											<TableCell>
												{result.data.firstName} {result.data.lastName}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell variant={'head'}>{t('email')}</TableCell>
											<TableCell>{result.data.email}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell variant={'head'}>{t('phone')}</TableCell>
											<TableCell>{result.data.phoneNumber}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell variant={'head'}>{t('status')}</TableCell>
											<TableCell>{result.status}</TableCell>
										</TableRow>

										<TableRow>
											<TableCell variant={'head'}>{t('role')}</TableCell>
											<TableCell>{result.roles.join(', ')}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Card component={Paper}>
								<CardHeader title={t('details')} />

								<Divider />

								<Table>
									<TableBody>
										<TableRow>
											<TableCell variant={'head'}>{t('address')}</TableCell>
											<TableCell>{result.data.address}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell variant={'head'}>
												{t('date_of_birth')}
											</TableCell>
											<TableCell>{result.data.dateOfBirth}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell variant={'head'}>{t('gender')}</TableCell>
											<TableCell>{result.data.gender}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell variant={'head'}>
												{t('language_code')}
											</TableCell>
											<TableCell>{result.data.languageCode}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell variant={'head'}>{t('modified')}</TableCell>
											<TableCell>
												{result.modifiedAt
													? formatDate(result.modifiedAt)
													: ''}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell variant={'head'}>{t('created')}</TableCell>
											<TableCell>{formatDate(result.createdAt)}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</Card>
						</Grid>
					</Grid>
				</Box>
			)}
		</div>
	)
}

export default PersonDetail
