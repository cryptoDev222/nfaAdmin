import { useTranslation } from 'react-i18next'
import { Auth, Hub } from 'aws-amplify'
import { useHistory, useLocation } from 'react-router'

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import {
	PieChart as DashbaordIcon,
	ViewModule as SmartFormIcon,
	ExitToApp as SignOutIcon,
	Business as BusinessIcon,
	AccountTree as DecisionIcon,
	BusinessCenter as OrganisationIcon,
	AccountCircle as AccountIcon,
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
		Auth.currentAuthenticatedUser().then((authData) => {
			const payload = authData.signInUserSession.idToken.payload
			let internal = false
			if (payload && payload['cognito:groups']) {
				internal = payload['cognito:groups'].indexOf('internal') > -1
				setIsInternal(internal)
			}
		})
	}, [])

	useEffect(() => {
		const items = [
			{
				title: t('dashboard'),
				icon: <DashbaordIcon fontSize="small" color={'inherit'} />,
				path: '/',
				exact: true
			},
			{
				title: t('results'),
				icon: <SmartFormIcon fontSize="small" color={'inherit'} />,
				path: '/results'
			},
			{
				title: t('companies'),
				icon: <BusinessIcon fontSize="small" color={'inherit'} />,
				path: '/companies'
			},
			{
				title: t('decisions'),
				icon: <DecisionIcon fontSize="small" color={'inherit'} />,
				path: '/decisions'
			},
			{
				title: t('profile'),
				icon: <AccountIcon fontSize="small" color={'inherit'} />,
				path: '/profile'
			},
			{
				title: t('my_organisation'),
				icon: <OrganisationIcon fontSize="small" color={'inherit'} />,
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
				Auth.signOut()
				return false
			}
		})
		setNavItems(items)
	}, [isInternal])

	Hub.listen('auth', (data) => {
		switch (data.payload.event) {
			case 'signOut':
				history.push('/login')
				break
			default:
				break
		}
	})

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
