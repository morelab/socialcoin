import React, { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Spinner } from '../../../components/Elements/Spinner';
import { Button } from '../../../components/Elements/Button';
import { InputField } from '../../../components/Form/InputField';
import { MiniTopbar } from '../../../components/Layout/MiniTopbar';

import { Action, RequestLoadState, User } from '../../../types';
import { notifySuccess, notifyWarning } from '../../../utils/notifications';
import { getAction } from '../api/getAction';
import { registerAction } from '../api/registerAction';
import { useUser } from '../../../context/UserContext';


type RegisterFormProps = {
  action: Action;
  setState: (state: RequestLoadState) => void;
};

type FormState = {
  kpi_value: number;
  verificationUrl: string;
  files: File[];
};

const RegisterForm = ({ action, setState }: RegisterFormProps) => {
  const [formState, setFormState] = React.useState<FormState>({
    kpi_value: 0,
    verificationUrl: '',
    files: []
  });
  const [fileName, setFileName] = React.useState('');
  const { user, setUser } = useUser();
  const { t } = useTranslation();
  const fileInputRef = React.createRef<HTMLInputElement>();

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const value = target.value;
    const name = target.name;

    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      const files = fileInputRef.current.files;
      if (files) setFileName(files[0].name);
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();

    const kpi_value = formState.kpi_value;
    const verificationURL = formState.verificationUrl;
    const files = fileInputRef?.current?.files;

    if (!files) return;

    if (kpi_value <= 0) {
      notifyWarning(t('notifications.positiveKPI'));
      return;
    }
    if (files.length == 0 && verificationURL.length < 3) {
      // TODO: improve URL validation
      notifyWarning(t('notifications.introduceFileOrUrl'));
      return;
    }

    const formData = new FormData();
    formData.append('kpi', kpi_value.toString());
    formData.append('verification_url', verificationURL);
    formData.append('image_proof', files[0]);
    setState('loading');
    registerAction(action.id, formData)
      .then(() => {
        setState('success');
        if (user) {
          const addedBalance = formState.kpi_value * action.reward;
          const newUser: User = {
            ...user,
            balance: user.balance + addedBalance
          };
          setUser(newUser);
          notifySuccess(`${t('notifications.balanceIncrease')} ${addedBalance / 100} UDC.`);
        }
      }).catch(error => {
        console.error(error);
        setState('failure');
      });
  };

  return (
    <div className="mt-5 md:mt-0 md:col-span-2">
      <form action="#" method="POST" onSubmit={handleRegister}>
        <div className="bg-white dark:bg-gray-800 flex flex-col gap-4">
          <InputField
            label={action.kpi_indicator}
            name="kpi_value"
            type="number"
            value={formState.kpi_value}
            onChange={handleInputChange}
            required
          />
          <div className='flex items-center justify-center border border-gray-300 dark:border-gray-400 bg-white dark:bg-gray-900 dark:text-white p-2 rounded-lg'>
            {t('main.offer')}: {(formState.kpi_value * action.reward / 100).toFixed(2)} UDC
          </div>
          <div className='col-span-6'>
            <label htmlFor='photo-proof' className="block text-md font-medium text-gray-700 dark:text-gray-100">
              {t('actions.photoProof')}
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
                    <span>{t('actions.uploadFile')}</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleFileUpload} />
                  </label>
                </div>
                <p className="text-xs text-gray-500">{fileName.length < 2 ? t('actions.noFile') : fileName}</p>
              </div>
            </div>
          </div>
          <InputField
            label={t('actions.verificationURL')}
            name="verificationUrl"
            type="text"
            value={formState.verificationUrl}
            onChange={handleInputChange}
          />
        </div>
        <div className="px-4 py-3 text-right sm:px-6">
          <Button type='submit' variant='submit'>{t('actions.registerAction')}</Button>
        </div>
      </form>
    </div>
  );
};

export const ActionRegister = () => {
  const actionID = useParams<{ id: string }>().id;
  const [action, setAction] = React.useState<Action>({} as Action);
  const [registerState, setRegisterState] = React.useState<RequestLoadState>('unloaded');
  const { t } = useTranslation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (actionID) {
      getAction(actionID).then(action => {
        setAction(action);
      });
    }
  }, []);

  // TODO unexisting action

  if (!action) {
    return (
      <div className='px-5 flex items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  const getSideSection = () => {
    switch (registerState) {
      case 'unloaded':
        return <RegisterForm action={action} setState={setRegisterState} />;
      case 'loading':
        return (
          <div className='flex flex-col items-center justify-center py-16'>
            <Spinner size='lg' />
            <h2 className='text-xl dark:text-gray-200 mt-5'>{t('common.pleaseWait')}...</h2>
          </div>
        );
      case 'success':
        return (
          <div className='flex flex-col items-center justify-center py-16'>
            <h3 className='text-xl text-center font-semibold dark:text-gray-100 mb-4'>{t('actions.successfulPayment')}!</h3>
            <p className='text-center dark:text-gray-300 mb-5'>
              {t('actions.rewarded')} {action.reward / 100} UDC.
            </p>
            <button
              type="button"
              onClick={() => navigate('/actions')}
              className="inline-flex justify-center py-2 px-4 border border-gray-400 w-full shadow-sm text-md font-medium
                  rounded-md text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 mb-3
                  focus:ring-offset-2 focus:ring-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition"
            >
              {t('actions.backToActions')}
            </button>
          </div>
        );
      case 'failure':
        return (
          <div className='flex flex-col items-center justify-center py-16'>
            <h3 className='text-xl text-center font-semibold dark:text-gray-100 mb-8'>{t('actions.paymentError')}.</h3>
            <button
              type="button"
              onClick={() => navigate('/actions')}
              className="inline-flex justify-center py-2 px-4 border border-gray-400 w-full shadow-sm text-md font-medium
                  rounded-md text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 mb-3
                  focus:ring-offset-2 focus:ring-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition"
            >
              {t('actions.backToActions')}
            </button>
          </div>
        );
    }
  };

  return (
    <>
      <MiniTopbar title='Action registration' />
      <div className='flex items-center justify-center'>
        <div className='shadow-lg max-w-2xl w-full divide-y-2 sm:divide-x-2 sm:divide-y-0 divide-gray-300 flex flex-col sm:grid sm:grid-cols-5 m-5 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden'>
          <div className='col-span-2'>
            <div className='p-3 flex flex-col bg-indigo-600 dark:bg-indigo-500 text-gray-200'>
              <span className='font-semibold text-xl mb-1'>{action.name}</span>
              <span className='font-medium text-lg'>{action.reward / 100} UDC</span>
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
    </>
  );
};