import React, { useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@heroicons/react/solid';
import logo from '../assets/deustoCoin-256.png';
import GoogleButton from 'react-google-button';

import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_BASE_BACKEND_URL } = process.env;

const TopBar = ({ themeHandler, dark }) => (
  <nav className='fixed top-0 left-0 h-14 px-2 w-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800'>
    <div className='max-w-4xl h-full w-full flex items-center justify-end'>
      <a href='https://github.com/morelab/socialcoin' target='_blank' rel="noreferrer" className='rounded-md transition-colors p-1 hover:bg-gray-300 dark:hover:bg-gray-600'>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" strokeWidth="1.5" stroke={`${dark ? '#f3f4f5' : '#000000'}`} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
        </svg>
      </a>
      <button onClick={themeHandler} className='ml-2 transition-colors rounded-md p-1 hover:bg-gray-300 dark:hover:bg-gray-600'>
        {dark
          ? <SunIcon className='h-7 w-7 text-gray-100' />
          : <MoonIcon className='h-7 w-7' />
        }
      </button>
    </div>
  </nav>
);

const Landing = () => {
  const { user } = useUser();
  const { dark, setDark } = useTheme();

  if (user != null) {
    return <Redirect to={'/dashboard'} />;
  }

  const openGoogleLoginPage = useCallback(() => {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const redirectUri = 'api/login';

    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');

    const params = {
      response_type: 'code',
      client_id: REACT_APP_GOOGLE_CLIENT_ID,
      redirect_uri: `${REACT_APP_BASE_BACKEND_URL}/${redirectUri}`,
      prompt: 'select_account',
      access_type: 'offline',
      scope
    };

    const urlParams = new URLSearchParams(params).toString();

    window.location = `${googleAuthUrl}?${urlParams}`;
  }, []);

  const handleThemeChange = (e) => {
    e.preventDefault();
    localStorage.setItem('theme', dark ? 'light' : 'dark');
    setDark(!dark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className='h-screen w-screen bg-white dark:bg-gray-900'>
      <TopBar themeHandler={handleThemeChange} dark={dark} />
      <div className="pt-14 px-4 h-full flex flex-col items-center justify-center pb-28">
        <div className="flex flex-col items-center justify-center h-full max-w-7xl">
          <img className="h-20 w-20 mb-5" src={logo} alt="logo" />
          <h1 className="mb-4 font-semibold text-3xl dark:text-gray-100">DeustoCoin</h1>
          <p className='max-w-md mb-5 text-center dark:text-gray-100'>
            DeustoCoin pretende sacar el máximo partido de la tecnología Blockchain y llevarla al ámbito universitario,
            promoviendo un estilo de vida sostenible y respetuoso con el medio ambiente.
          </p>
          <GoogleButton
            onClick={openGoogleLoginPage}
            label="Sign in with Google"
            disabled={!REACT_APP_GOOGLE_CLIENT_ID}
            type={dark ? 'dark' : 'light'}
            className="mb-5"
          />
          <p className="text-center text-gray-500 dark:text-gray-100">&copy; 2020-2022 - MORELab</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;