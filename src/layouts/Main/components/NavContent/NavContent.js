import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router'

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import {
	PieChart as DashbaordIcon,
	ViewModule as SmartFormIcon,
	ExitToApp as SignOutIcon,
	AccountBalance as RewardsIcon,
	History as HistoryIcon,
	People as PeopleIcon,
	Lock as TokenIcon,
	Build as AdminIcon
} from '@material-ui/icons'

import useStyles from './NavContent.styles'
import { useEffect, useState } from 'react'

const NavContent = () => {
	const { t } = useTranslation()

	const [isInternal, setIsInternal] = useState(false)
	const [navItems, setNavItems] = useState([])

	const history = useHistory()
	const location = useLocation()

	useEffect(() => {
		const items = [
			{
				title: t('dashboard'),
				icon: <DashbaordIcon fontSize="small" color={'inherit'} />,
				path: '/',
				exact: true
			},
			{
				title: t('On Staking'),
				icon: <SmartFormIcon fontSize="small" color={'inherit'} />,
				path: '/results'
			},
			{
				title: t('Rewards'),
				icon: <RewardsIcon fontSize="small" color={'inherit'} />,
				path: '/companies'
			},
			{
				title: t('Staking History'),
				icon: <HistoryIcon fontSize="small" color={'inherit'} />,
				path: '/decisions'
			},
			{
				title: t('Tokens'),
				icon: <TokenIcon fontSize="small" color={'inherit'} />,
				path: '/profile'
			},
			{
				title: t('Users'),
				icon: <PeopleIcon fontSize="small" color={'inherit'} />,
				path: '/organisation'
			}
		]

		if (isInternal) {
			items.push({
				title: t('admin'),
				icon: <AdminIcon fontSize="small" color={'inherit'} />,
				path: '/admin'
			})
		}

		items.push({
			title: t('sign_out'),
			icon: <SignOutIcon fontSize="small" color={'inherit'} />,
			onClick: () => {
				return false
			}
		})
		setNavItems(items)
	}, [isInternal])

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
