import axios from 'axios'
import { API_URL } from '../config/constants'

const axiosRequestInterceptor = async (config) => {
	config.baseURL = API_URL

	// const token = session.getIdToken().getJwtToken()

	// if (token) {
	// 	const prefix =
	// 		config.url.startsWith(KONTAKTO_API_URL) || config.url.startsWith(GENERIC_API_URL)
	// 			? ''
	// 			: 'Bearer '
	// 	config.headers.Authorization = `${prefix}${token}`
	// }

	return config
}

axios.interceptors.request.use(axiosRequestInterceptor, (e) => Promise.reject(e))

export default axios
