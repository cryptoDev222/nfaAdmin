import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import useStyles from './CompanyList.styles'

import { Auth } from '@aws-amplify/auth'

import CompanyListTable from './CompanyListTable'

import {
	Link,
	Breadcrumbs,
	Box,
	Button
} from '@material-ui/core'

import Typography from '@material-ui/core/Typography'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

import Error from '../../../layouts/Main/components/Error'

const CompanyList = () => {
	const { t } = useTranslation()
	const history = useHistory()

	const [organizationId, setOrganizationId] = useState('')

	const [error, setError] = useState(false)

	useEffect(() => {
		Auth.currentAuthenticatedUser().then((authData) => {
			setOrganizationId(authData.attributes['custom:org'])
		})
	}, [])

	const classes = useStyles()

	const handleAddCompanyClick = () => {
		history.push('/companies/add')
	}

	return (
		<>
			<div className={classes.header}>
				<Typography variant={'h3'} gutterBottom>
					{t('company_list')}
				</Typography>
				<Button
					variant="contained"
					color="primary"
					onClick={handleAddCompanyClick}
					className={classes.companyAddButton}
				>
					{t('company.add.title')}
				</Button>
			</div>
			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				<Link color="inherit" variant={'subtitle2'} href="/">
					Dashboard
				</Link>
				<Typography color="textPrimary" variant={'subtitle2'}>
					Companies
				</Typography>
			</Breadcrumbs>

			<Box mt={4}>
				{' '}
				{error ? <Error /> : <CompanyListTable organizationId={organizationId} setError={setError} />}
			</Box>
		</>
	)
}

export default CompanyList
