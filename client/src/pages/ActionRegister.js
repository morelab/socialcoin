import React, { useEffect, useState, useRef } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import LoadingIcon from '../components/common/LoadingIcon';
import InputGroup from '../components/common/forms/InputGroup';
import SubmitButton from '../components/common/forms/SubmitButton';
import actionService from '../services/actions';
import { useUser } from '../context/UserContext';
import { notifyWarning } from '../utils/notifications';


const RegisterForm = ({ action, setState }) => {
  const [formState, setFormState] = useState({});
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef();

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = () => {
    setFileName(fileInputRef.current.files[0].name);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const kpi_value = formState.kpiIndicator;
    const verificationURL = formState.verificationURL;
    const files = fileInputRef.current.files;

    if (kpi_value <= 0) {
      notifyWarning('Please enter a KPI greater than 0.');
      return;
    }
    if (files.length == 0) {
      notifyWarning('Please introduce a file.');
      return;
    }

    let formData = new FormData();
    formData.append('kpi', kpi_value);
    formData.append('verification_url', verificationURL);
    formData.append('image_proof', files[0]);
    setState('registering');
    await actionService.registerAction(action.id, formData);
    setState('registered');
  };

  return (
    <div className="mt-5 md:mt-0 md:col-span-2">
      <form action="#" method="POST" onSubmit={handleRegister}>
        <div className="bg-white dark:bg-gray-800">
          <div className="grid grid-cols-6 gap-6">
            <InputGroup
              label={action.kpi_indicator}
              forName="kpiIndicator"
              type="number"
              value={formState.kpiIndicator || ''}
              handleInputChange={handleInputChange}
              required
            />
            <div className='col-span-6'>
              <label htmlFor='photo-proof' className="block text-md font-medium text-gray-700 dark:text-gray-100">
                Photo proof
              </label>
              <div onClick={handleFileInputClick} className="cursor-pointer mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex justify-center text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleFileUpload} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">{fileName.length < 2 ? 'No file selected.' : fileName}</p>
                </div>
              </div>
            </div>
            <InputGroup
              label="Verification URL (not mandatory)"
              forName="verificationURL"
              type="text"
              value={formState.verificationURL || ''}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>
        <div className="px-4 py-3 text-right sm:px-6">
          <SubmitButton content="Register action" />
        </div>
      </form>
    </div>
  );
};

const ActionRegister = () => {
  const actionID = useParams().id;
  const [action, setAction] = useState(null);
  const [registerState, setRegisterState] = useState('initial');
  const { user } = useUser();
  const history = useHistory();

  if (user.role === 'PM') {
    return <Redirect to="/dashboard/campaigns" />;
  }

  useEffect(() => {
    actionService.getOne(actionID).then(action => setAction(action));
  }, []);

  if (!action) {
    return (
      <div className='px-5 flex items-center justify-center'>
        <LoadingIcon />
      </div>
    );
  }

  const getSideSection = () => {
    if (registerState === 'registering') {
      return (
        <div className='flex flex-col items-center justify-center py-16'>
          <h2 className='text-xl dark:text-gray-200'>Please wait...</h2>
          <LoadingIcon />
        </div>
      );
    } else if (registerState === 'registered') {
      return (
        <div className='flex flex-col items-center justify-center py-16'>
          <h3 className='text-xl text-center font-semibold dark:text-gray-100 mb-4'>The payment was successful!</h3>
          <p className='text-center dark:text-gray-300 mb-5'>
            You have been rewarded {action.reward / 100} UDC.
          </p>
          <button
            type="button"
            onClick={() => history.push('/actions')}
            className="inline-flex justify-center py-2 px-4 border border-gray-400 w-full shadow-sm text-md font-medium
                rounded-md text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 mb-3
                focus:ring-offset-2 focus:ring-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition"
          >
            Go back to actions
          </button>
        </div>
      );
    } else {
      return <RegisterForm action={action} setState={setRegisterState} />;
    }
  };

  return (
    <div className='flex items-center justify-center'>
      <div className='shadow-lg max-w-3xl divide-y-2 sm:divide-x-2 sm:divide-y-0 divide-gray-300 flex flex-col sm:grid sm:grid-cols-5 m-5 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden'>
        <div className='col-span-2'>
          <div className='p-3 flex flex-col bg-indigo-600 dark:bg-indigo-500 text-gray-200'>
            <span className='font-semibold text-xl mb-1'>{action.name}</span>
            <span className='font-medium text-lg'>{action.reward/100} UDC</span>
          </div>
          <div className='p-3 dark:text-gray-200'>
            <p>
              {action.description}
            </p>
          </div>
        </div>
        <div className='p-3 col-span-3 bg-white dark:bg-gray-800'>
          {getSideSection()}
        </div>
      </div>
    </div>
  );
};

export default ActionRegister;