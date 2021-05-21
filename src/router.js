import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Main from './layouts/Main'
import RouteWithLayout from './components/shared/RouteWithLayout'

import Home from './Home'
import Staking from './pages/staking'
import Rewards from './pages/rewards'
import NoPage from './pages/404'
// import Login from './Login'

const AppRouter = () => (
	<Switch>
		{/* <Route exact path="/admin/login" component={Login} /> */}
		<RouteWithLayout layout={Main} exact path="/admin/" component={Home} />
		<RouteWithLayout layout={Main} exact path="/admin/staking" component={Staking} />
		<RouteWithLayout layout={Main} exact path="/admin/rewards" component={Rewards} />
		<Route>
			<NoPage />
		</Route>
	</Switch>
)

export default AppRouter
