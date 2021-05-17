import { createContext, useState } from 'react'
import { DEFAULT_LANGUAGE } from '../config/constants'
import i18n from '../i18n'

export const LanguageContext = createContext({
	setLanguage: () => {},
	language: DEFAULT_LANGUAGE
})

export const LanguageProvider = ({ children }) => {
	const [language, setLanguage] = useState(DEFAULT_LANGUAGE)

	const setLanuageAndI18n = (lang) => {
		setLanguage(lang)
		i18n.changeLanguage(lang)
	}
	return (
		<LanguageContext.Provider
			value={{
				setLanguage: setLanuageAndI18n,
				language
			}}
		>
			{children}
		</LanguageContext.Provider>
	)
}
