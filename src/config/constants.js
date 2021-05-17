const API_URL = process.env.REACT_APP_API_URL

const DB_API_URL = `/db`
const AUTH_API_URL = `/v1`
const KONTAKTO_API_URL = `/kontakto`
const GENERIC_API_URL = `/generic`

const LANGUAGES = {
	en: 'English',
	fi: 'Finnish'
}
const LOCALES = {
	en: 'enUS',
	fi: 'fiFI'
}

const DEFAULT_LANGUAGE = Object.keys(LANGUAGES)[0]

const ORDER_DIRS = {
	ASC: 'asc',
	DESC: 'desc'
}

const PAGE_SIZE = 5

export {
	API_URL,
	DB_API_URL,
	AUTH_API_URL,
	KONTAKTO_API_URL,
	GENERIC_API_URL,
	LANGUAGES,
	DEFAULT_LANGUAGE,
	LOCALES,
	ORDER_DIRS,
	PAGE_SIZE
}
