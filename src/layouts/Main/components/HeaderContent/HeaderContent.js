import { Box, Hidden, Toolbar } from '@material-ui/core'

import Avatar from './Avatar'
import Logo from './Logo'

const HeaderContent = (props) => {

	return (
		<Toolbar>
			<Logo />

			<Box flexGrow={1} />

			<Avatar />

			<Hidden lgUp>{props.sidebarTrigger}</Hidden>
		</Toolbar>
	)
}

export default HeaderContent
