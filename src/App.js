import { BrowserRouter as Router } from 'react-router-dom'
import { SnackbarProvider, LanguageProvider } from './context'
import Snackbar from './components/shared/Snackbar'

import AppRouter from './router'
import AuthHelper from './utils/AuthHelper'

const App = () => {
	return (
		<LanguageProvider>
			<SnackbarProvider>
				<div className="App">
					<Router>
						<AuthHelper />
						<AppRouter />
					</Router>
					<Snackbar />
				</div>
			</SnackbarProvider>
		</LanguageProvider>
	)
}

export default App
