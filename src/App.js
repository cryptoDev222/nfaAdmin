import { BrowserRouter as Router } from "react-router-dom";
import { SnackbarProvider } from "./context";
import Snackbar from "./components/shared/Snackbar";

import AppRouter from "./router";
// import AuthHelper from './utils/AuthHelper'

const App = () => {
  return (
    <SnackbarProvider>
      <div className="App">
        <Router basename="/admin">
          {/* <AuthHelper /> */}
          <AppRouter />
        </Router>
        <Snackbar />
      </div>
    </SnackbarProvider>
  );
};

export default App;
