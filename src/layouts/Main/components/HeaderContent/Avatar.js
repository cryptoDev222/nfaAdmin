import { useState } from 'react'
import { useHistory } from 'react-router'

import useStyles from './Avatar.styles'

import {
	Box,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Typography,
	Button,
	Divider
} from '@material-ui/core'
import { AccountCircle } from '@material-ui/icons'
import PersonIcon from '@material-ui/icons/Person'

const Avatar = () => {
	const history = useHistory()

	const [avatarAnchorEl, setAvatarAnchorEl] = useState(null)
	const profileMenuOpen = Boolean(avatarAnchorEl)

	const user = {}

	const handleAvatarClick = (event) => {
		setAvatarAnchorEl(event.currentTarget)
	}

	const handleProfileMenuClose = () => {
		setAvatarAnchorEl(null)
	}

	const handleMyAccountClick = () => {
		// history.push('/profile')
		handleProfileMenuClose()
	}

	const classes = useStyles()

	return (
		<div>
			<IconButton className={classes.avatarButton} onClick={handleAvatarClick}>
				<AccountCircle className={classes.avatarIcon} />
			</IconButton>
			<Menu
				id="menu-appbar"
				getContentAnchorEl={null}
				anchorEl={avatarAnchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right'
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				classes={{ paper: classes.menu }}
				open={profileMenuOpen}
				onClose={handleProfileMenuClose}
			>
				{user && (
					<Box p={2}>
						<Typography component={'h6'} variant={'subtitle2'}>
							{user.username}
						</Typography>
						<Typography
							classes={{ root: classes.subTitle }}
							component={'h6'}
							variant={'subtitle2'}
						>
							{user.email}
						</Typography>
					</Box>
				)}
				{user && <Divider />}
				<Box mt={2}>
					<MenuItem onClick={handleMyAccountClick}>
						<ListItemIcon>
							<PersonIcon />
						</ListItemIcon>
						<Typography component={'h6'} variant={'subtitle2'}>
							Profile
						</Typography>
					</MenuItem>
				</Box>
				<Box p={2}>
					<Button fullWidth variant="outlined" color="primary">
						Sign Out
					</Button>
				</Box>
			</Menu>
		</div>
	)
}

export default Avatar
