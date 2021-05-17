import { Hub } from 'aws-amplify'
import { useHistory } from 'react-router'

import { Box, Hidden, Toolbar } from '@material-ui/core'

import Avatar from './Avatar'
import Language from './Language'
import Logo from './Logo'

const HeaderContent = (props) => {
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

	return (
		<Toolbar>
			<Logo />

			<Box flexGrow={1} />

			<Language />
			<Avatar />

			<Hidden lgUp>{props.sidebarTrigger}</Hidden>
		</Toolbar>
	)
}

export default HeaderContent
