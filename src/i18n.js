import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import { DEFAULT_LANGUAGE } from './config/constants'

// import translationFiFI from '../locales/fiFi/translation.json'
i18n.use(Backend)
	.use(initReactI18next)
	.init({
		debug: false,
		lng: DEFAULT_LANGUAGE,
		fallbackLng: DEFAULT_LANGUAGE, // use en if detected lng is not available

		keySeparator: false, // we do not use keys in form messages.welcome

		interpolation: {
			escapeValue: false // react already safes from xss
		},

		ns: ['translations'],
		defaultNS: 'translations',

		useDataAttrOptions: true,

		react: {
			wait: true,
			useSuspense: false
		}
	})

export default i18n
