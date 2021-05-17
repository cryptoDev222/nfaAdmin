import React, { useContext } from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import CssBaseline from '@material-ui/core/CssBaseline'
import styled from 'styled-components'
import Layout, {
	Root,
	getDrawerSidebar,
	getSidebarTrigger,
	getSidebarContent,
	getCollapseBtn,
	getContent,
	getFooter
} from '@mui-treasury/layout'

import { ThemeProvider } from '@material-ui/core/styles'
import { LanguageContext } from '../../context'
import { createLocalizedTheme } from '../../utils/theme'

import HeaderContent from './components/HeaderContent'
import FooterContent from './components/FooterContent'

import NavContent from './components/NavContent'
import NavHeader from './components/NavHeader'

import useStyles from './Main.styles'
import theme from '../../theme'
import { Box } from '@material-ui/core'
import AppHeader from './components/AppHeader'

const DrawerSidebar = getDrawerSidebar(styled)
const SidebarTrigger = getSidebarTrigger(styled)
const SidebarContent = getSidebarContent(styled)
const CollapseBtn = getCollapseBtn(styled)
const Content = getContent(styled)
const Footer = getFooter(styled)

const scheme = Layout()

scheme.configureHeader((builder) => {
	builder
		.registerConfig('xs', {
			position: 'sticky'
		})
		.registerConfig('md', {
			position: 'relative' // won't stick to top when scroll down
		})
})

scheme.configureEdgeSidebar((builder) => {
	builder
		.create('mainSidebar', { anchor: 'left' })
		.registerTemporaryConfig('xs', {
			anchor: 'left',
			width: 'auto' // 'auto' is only valid for temporary variant
		})
		.registerPermanentConfig('md', {
			width: 256, // px, (%, rem, em is compatible)
			// collapsible: true,
			collapsedWidth: 64
		})
})

scheme.enableAutoCollapse('mainSidebar', 'md')

const Main = (props) => {
	const { children } = props

	const classes = useStyles()
	const { language } = useContext(LanguageContext)

	return (
		<Root scheme={scheme} classes={classes.root}>
			{({ state: { sidebar } }) => (
				<ThemeProvider theme={() => createLocalizedTheme(theme, language)}>
					<CssBaseline />

					<Box className={classes.rootBox}>
						<AppHeader>
							<HeaderContent
								sidebarTrigger={
									<SidebarTrigger
										sidebarId="mainSidebar"
										className={classes.sidebarTrigger}
									/>
								}
							/>
						</AppHeader>

						<DrawerSidebar sidebarId="mainSidebar">
							<Toolbar />

							<SidebarContent>
								<NavContent />
							</SidebarContent>
							<CollapseBtn />
						</DrawerSidebar>
						<Content className={classes.wrapper}>
							<Box className={classes.container}>
								<Box className={classes.content}>{children}</Box>
							</Box>
						</Content>
						<Footer>
							<FooterContent />
						</Footer>
					</Box>
				</ThemeProvider>
			)}
		</Root>
	)
}

export default Main
