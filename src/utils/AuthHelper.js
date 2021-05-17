import { useHistory, useLocation } from 'react-router'
import { useEffect } from 'react'

const AuthHelper = () => {
	// const history = useHistory()
	// const location = useLocation()

	// useEffect(() => {
	// 	Auth.currentAuthenticatedUser()
	// 		.then((authData) => {
	// 			if (!authData || !authData.username) {
	// 				if (location.pathname !== '/login') {
	// 					history.push('/login')
	// 				}
	// 			} else {
	// 				if (location.pathname === '/login') {
	// 					history.push('/')
	// 				} else if (location.pathname === '/admin') {
	// 					const payload = authData.signInUserSession.idToken.payload
	// 					let internal = false
	// 					if (payload && payload['cognito:groups']) {
	// 						internal = payload['cognito:groups'].indexOf('internal') > -1
	// 					}

	// 					if (!internal) {
	// 						history.push('/')
	// 					}
	// 				}
	// 			}
	// 		})
	// 		.catch(() => {
	// 			if (location.pathname !== '/login') {
	// 				history.push('/login')
	// 			}
	// 		})
	// }, [history, location])

	// useEffect(() => {
	// 	return onAuthUIStateChange((nextAuthState, authData) => {
	// 		if (nextAuthState === 'signedin') {
	// 			history.push('/')
	// 		} else if (nextAuthState === 'signedout') {
	// 			history.push('/login')
	// 		}
	// 	})

	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [])

	return ''
}

export default AuthHelper
