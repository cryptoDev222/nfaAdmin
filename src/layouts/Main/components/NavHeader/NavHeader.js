import { Auth, Hub } from 'aws-amplify'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'

import { Avatar, Box, Divider, Typography } from '@material-ui/core'
import useStyles from './NavHeader.styles'

const NavHeader = (props) => {
	const history = useHistory()

	Hub.listen('auth', (data) => {
		switch (data.payload.event) {
			case 'signOut':
				history.push('/login')
				break
			default:
				break
		}
	})

	const [user, setUser] = useState({})

	useEffect(() => {
		async function loadUserInfo() {
			Auth.currentUserInfo()
				.then((userInfo) => {
					setUser({
						username: userInfo.username,
						email: userInfo.attributes.email
					})
				})
				.catch(() => {})
		}
		loadUserInfo()
	}, [])

	const classes = useStyles()

	return (
		<>
			<Box
				className={classes.root}
				style={{ padding: props.collapsed ? 8 : 16 }}
				alignItems={'center'}
				display={'flex'}
				flexDirection={'column'}
				p={2}
			>
				<Box className={classes.box} p={2}>
					<Avatar
						className={classes.avatar}
						style={{
							width: 36,
							height: 36
						}}
					/>
					<Box ml={2}>
						<Typography variant="h6" noWrap>
							{user && user.email}
						</Typography>
					</Box>
				</Box>
			</Box>

			<Divider />
		</>
	)
}

export default NavHeader
