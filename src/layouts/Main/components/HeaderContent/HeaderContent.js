import { useContext } from 'react'
import { Box, Hidden, Toolbar, Button } from '@material-ui/core'

import Avatar from './Avatar'
import Logo from './Logo'
import { ContractContext } from '../../../../context/ContractContext'

const HeaderContent = (props) => {

	const { connectWallet } = useContext(ContractContext);

	return (
		<Toolbar>
			<Logo />

			<Box flexGrow={1} />

			<Button variant="contained" color="primary" onClick={connectWallet}>Connect</Button>

			<Avatar />

			<Hidden lgUp>{props.sidebarTrigger}</Hidden>
		</Toolbar>
	)
}

export default HeaderContent
