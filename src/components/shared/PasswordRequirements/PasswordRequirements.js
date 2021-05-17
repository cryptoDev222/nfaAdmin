import { Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

const PasswordRequirements = () => {
	const { t } = useTranslation()

	const minPasswordLength = 8

	return (
		<Typography variant="caption">
			{t('password_requirements', {
				length: minPasswordLength
			})}
		</Typography>
	)
}

export default PasswordRequirements
