import { Box, Typography } from '@material-ui/core'

const Error = (props) => {
	return (
		<Box pt={4} pb={4}>
			<Typography component="p" align="center">
				{props.error || 'An error occured'}
			</Typography>
		</Box>
	)
}

export default Error
