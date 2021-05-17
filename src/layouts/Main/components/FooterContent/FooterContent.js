import { Fragment } from 'react'
import Typography from '@material-ui/core/Typography'

import useStyles from './FooterContent.styles'

function FooterContent(props) {
	const classes = useStyles()

	return (
		<Fragment>
			<div className={classes.root}>
				<Typography variant="caption" align="center">
					NFA Admin @ 2021 All right reserved
				</Typography>
			</div>
		</Fragment>
	)
}

export default FooterContent
