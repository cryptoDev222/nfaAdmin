import { useHistory, useLocation } from 'react-router'

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import {
	PieChart as DashbaordIcon,
	ViewModule as SmartFormIcon,
	ExitToApp as SignOutIcon,
	AccountBalance as RewardsIcon,
	History as HistoryIcon,
	People as TokenIcon,
} from '@material-ui/icons'

import useStyles from './NavContent.styles'
import { useEffect, useState } from 'react'

const NavContent = () => {

	const [navItems, setNavItems] = useState([])

	const history = useHistory()
	const location = useLocation()

	useEffect(() => {
		const items = [
			{
				title: 'Dashboard',
				icon: <DashbaordIcon fontSize="small" color={'inherit'} />,
				path: '/',
				exact: true
			},
			{
				title: 'On Staking',
				icon: <SmartFormIcon fontSize="small" color={'inherit'} />,
				path: '/staking'
			},
			{
				title: 'Rewards',
				icon: <RewardsIcon fontSize="small" color={'inherit'} />,
				path: '/rewards'
			},
			{
				title: 'Tokens',
				icon: <TokenIcon fontSize="small" color={'inherit'} />,
				path: '/tokens'
			},
			{
				title: 'Staking History',
				icon: <HistoryIcon fontSize="small" color={'inherit'} />,
				path: '/history'
			},
			// {
			// 	title: 'Tokens',
			// 	icon: <TokenIcon fontSize="small" color={'inherit'} />,
			// 	path: '/profile'
			// },
			// {
			// 	title: 'Users',
			// 	icon: <PeopleIcon fontSize="small" color={'inherit'} />,
			// 	path: '/organisation'
			// }
		]

		setNavItems(items)
	}, [])

	const goTo = (path) => {
		history.push(path)
		return false
	}

	const classes = useStyles()

	const active = (exact, path) => {
		return (
			(exact && location.pathname === path) || (!exact && location.pathname.startsWith(path))
		)
	}

	return (
		<List classes={{ root: classes.list }}>
			{navItems.map(({ title, icon, path, exact, onClick }, i) => {
				return (
					<ListItem
						button
						key={`nav-item-${i}`}
						onClick={
							onClick
								? (e) => {
										e.preventDefault()
										onClick(e)
								  }
								: path
								? (e) => {
										e.preventDefault()
										goTo(path)
								  }
								: null
						}
						selected={active(exact, path)}
						classes={{ root: classes.root, selected: classes.selected }}
					>
						<ListItemIcon classes={{ root: classes.icon }}>{icon}</ListItemIcon>
						<ListItemText classes={{ primary: classes.listItemText }} primary={title} />
					</ListItem>
				)
			})}
		</List>
	)
}

export default NavContent
