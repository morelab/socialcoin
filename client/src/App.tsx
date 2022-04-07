import {
  HashRouter, Route, Switch
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';

import { Landing } from './features/misc';
import PagesContainer from './components/PagesContainer';

function App() {
  return (
    <>
      <UserProvider>
        <ThemeProvider>
          <HashRouter>
            <Switch>
              <Route exact path='/' component={Landing} />
              <Route component={PagesContainer} />
            </Switch>
          </HashRouter>
        </ThemeProvider>
      </UserProvider>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
