import './Home.css'

import { Box, Typography } from '@material-ui/core'

const Home = () => {
	return (
		<>
			<Box mb={4}>
				<Typography variant={'overline'}>Overview</Typography>
				<Typography variant={'h3'} gutterBottom={true}>
					Statistic
				</Typography>
			</Box>
		</>
	)
}

export default Home
