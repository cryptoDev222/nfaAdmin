import { Box, Breadcrumbs, Link, Typography } from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { useTranslation } from 'react-i18next'
import { OrganisationForm, SmartFormCreateForm } from '../../../components/admin'

const Admin = () => {
	const { t } = useTranslation()

	return (
		<>
			<Box display="flex" justifyContent="space-between">
				<Typography variant="h3" component="h3" gutterBottom={true}>
					{t('admin')}
				</Typography>
			</Box>

			<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				<Link color="inherit" variant={'subtitle2'} href="/">
					{t('dashboard')}
				</Link>
				<Typography variant={'subtitle2'} color="textPrimary">
					{t('admin')}
				</Typography>
			</Breadcrumbs>

			<Box mt={4}>
				<Box mb={6}>
					<OrganisationForm />
				</Box>
			</Box>

			<Box mt={4}>
				<Box mb={6}>
					<SmartFormCreateForm />
				</Box>
			</Box>
		</>
	)
}

export default Admin
