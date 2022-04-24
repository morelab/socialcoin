import React from 'react';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';

import { DataProvider } from './context/DataContext';
import { AppRoutes } from './routes';


// TODO Suspense fallback component
function App() {
  return (
    <React.Suspense fallback="...loading">
      <UserProvider>
        <ThemeProvider>
          <DataProvider>
            <HashRouter>
              <AppRoutes />
            </HashRouter>
          </DataProvider>
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
    </React.Suspense>
  );
}

export default App;
