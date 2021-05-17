import { useContext, useState } from 'react'

import { IconButton, Menu, MenuItem, Typography } from '@material-ui/core'
import useStyles from './Language.styles'

import { LanguageContext } from '../../../../context'
import { LANGUAGES } from '../../../../config/constants'

const Language = () => {
	const { language, setLanguage } = useContext(LanguageContext)
	const [languageAnchorEl, setLanguageAnchorEl] = useState(null)
	const languageMenuOpen = Boolean(languageAnchorEl)

	const handleLanguageClick = (event) => {
		setLanguageAnchorEl(event.currentTarget)
	}

	const handleLanguageItemClick = (lang) => {
		setLanguage(lang)
		handleLanguageMenuClose()
	}

	const handleLanguageMenuClose = () => {
		setLanguageAnchorEl(null)
	}

	const classes = useStyles()

	return (
		<div>
			<IconButton className={classes.languageButton} onClick={handleLanguageClick}>
				<img className={classes.btnFlag} src={`/flags/${language}.svg`} alt={language} />
			</IconButton>
			<Menu
				id="menu-appbar"
				getContentAnchorEl={null}
				anchorEl={languageAnchorEl}
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
				open={languageMenuOpen}
				onClose={handleLanguageMenuClose}
			>
				{Object.keys(LANGUAGES).map((lang) => (
					<MenuItem
						key={`language-${lang}`}
						selected={language === lang}
						onClick={() => handleLanguageItemClick(lang)}
					>
						<img className={classes.flag} src={`/flags/${lang}.svg`} alt={''} />
						<Typography variant={'h6'}>{LANGUAGES[lang]}</Typography>
					</MenuItem>
				))}
			</Menu>
		</div>
	)
}

export default Language
