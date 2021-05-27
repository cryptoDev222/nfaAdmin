import { BrowserRouter as Router } from "react-router-dom";
import { SnackbarProvider, ContractProvider } from "./context";
import Snackbar from "./components/shared/Snackbar";

import AppRouter from "./router";

const App = () => {
  return (
    <SnackbarProvider>
      <ContractProvider>
        <div className="App">
          <Router basename="/admin">
            {/* <AuthHelper /> */}
            <AppRouter />
          </Router>
          <Snackbar />
        </div>
      </ContractProvider>
    </SnackbarProvider>
  );
};

export default App;
