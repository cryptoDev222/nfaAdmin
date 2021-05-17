import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Main from './layouts/Main'
import RouteWithLayout from './components/shared/RouteWithLayout'

// import { ApiKeyList } from './pages/api-key'

import Home from './Home'
import Login from './Login'

const AppRouter = () => (
	<Switch>
		<Route exact path="/login" component={Login} />

		<RouteWithLayout layout={Main} exact path="/" component={Home} />

	</Switch>
)

export default AppRouter
