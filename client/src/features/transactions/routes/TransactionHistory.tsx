import React from 'react';
import { ClipboardCopyIcon, FlagIcon, ShoppingBagIcon, PlusCircleIcon, QuestionMarkCircleIcon, ExternalLinkIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';

import { ContentModal } from '../../../components/Overlay/ContentModal';

import { Transaction } from '../../../types';
import { MiniTopbar } from '../../../components/Layout/MiniTopbar';
import { Sidebar } from '../components/Sidebar';
import { FilterProvider, useFilters } from '../context/FilterContext';
import { EmptyTableNotice } from '../../dashboard/components/EmptyTableNotice';
import { useData } from '../../../context/DataContext';
import { getTransactions } from '../api/getTransactions';
import { notifyInfo } from '../../../utils/notifications';


type TransactionModalProps = {
  transaction: Transaction;
  open: boolean;
  setOpen: (open: boolean) => void;
};

type TransactionProps = {
  transaction: Transaction;
  clickHandler: () => void;
};


const TransactionModal = ({ transaction, open, setOpen }: TransactionModalProps) => {
  const { t } = useTranslation();

  if (!transaction) {
    return null;
  }

  const copyToClipboard = (text: string):void => {
    navigator.clipboard.writeText(text);
    notifyInfo(t('transactions.copiedToClipboard'));
  };

  return (
    <ContentModal open={open} setOpen={setOpen}>
      <div className="overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
        <div className="px-4 py-5 sm:px-6 bg-indigo-600 dark:bg-indigo-500">
          <h3 className="text-lg leading-6 font-medium text-gray-100">{transaction.transaction_info}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-200 dark:text-gray-300">{transaction.date}</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">{t('transactions.sender')}</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50 sm:mt-0 sm:col-span-2 flex flex-col gap-1">
                <span>{transaction.sender_name}</span>
                <span>{transaction.sender_email}</span>
                <span className='text-xs'>{transaction.sender_address}</span>
              </dd>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">{t('transactions.receiver')}</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50 sm:mt-0 sm:col-span-2 flex flex-col gap-1">
                <span>{transaction.receiver_name}</span>
                <span>{transaction.receiver_email}</span>
                <span className='text-xs'>{transaction.receiver_address}</span>
              </dd>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">{t('transactions.quantity')}</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50 sm:mt-0 sm:col-span-2">{transaction.quantity / 100} UDC</dd>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">{t('transactions.transactionHash')}</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50 sm:mt-0 sm:col-span-2">
                {transaction.transaction_hash && transaction.transaction_hash.length > 5 ? transaction.transaction_hash : t('common.none')}
              </dd>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">{t('transactions.ipfsHash')}</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50 sm:mt-0 sm:col-span-2">
                {transaction.img_ipfs_hash
                  ?
                  <div className='flex items-center justify-center sm:justify-start gap-5'>
                    <div
                      onClick={() => copyToClipboard(transaction.img_ipfs_hash)}
                      className='flex items-center gap-1 cursor-pointer hover:text-indigo-200 hover:underline transition-colors'
                    >
                      {t('common.copy')} hash
                      <ClipboardCopyIcon className='h-5 w-5 text-indigo-500' />
                    </div>
                    <a
                      href={`https://ipfs.io/ipfs/${transaction.img_ipfs_hash}`}
                      target='_blank'
                      rel='noreferrer'
                      className='flex items-center gap-1 hover:text-indigo-200 hover:underline transition-colors'
                    >
                      {t('common.goToFile')}
                      <ExternalLinkIcon className='h-5 w-5 text-indigo-500' />
                    </a>
                  </div>
                  : 'None'}
              </dd>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">{t('transactions.proofURL')}</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50 sm:mt-0 sm:col-span-2">
                {transaction.external_proof_url && transaction.external_proof_url !== 'undefined' ? transaction.external_proof_url : t('common.none')}
              </dd>
            </div>
          </dl>
        </div>
        <div className="px-4 py-3 flex sm:px-6 gap-4 bg-gray-50 dark:bg-gray-900 ">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-indigo-400 shadow-sm px-4 py-2
            text-base font-medium dark:text-white hovedark:focus:ring-indigo-700 sm:text-sm
            text-gray-200 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            onClick={() => {
              setOpen(false);
            }}
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </ContentModal>
  );
};

const TransactionCard = ({ transaction, clickHandler }: TransactionProps) => {
  const { t } = useTranslation();

  const getTransactionType = () => {
    const splitInfo = transaction.transaction_info.split(' ');
    return splitInfo[splitInfo.length - 1].toLowerCase();
  };

  const getTransactionTitle = () => {
    const type = getTransactionType();

    if (type === 'registration') return t('transactions.types.registration');
    else if (type === 'creation') return t('transactions.types.creation');
    else if (type === 'payment') return t('transactions.types.payment');
    else return transaction.transaction_info;
  };

  const getTransactionIcon = () => {
    const type = getTransactionType();
    if (type === 'registration') {
      return (
        <div className='bg-pink-200 dark:bg-pink-300 p-2 rounded-2xl'>
          <FlagIcon className="w-10 sm:w-14 text-pink-600 dark:text-pink-800" />
        </div>
      );
    } else if (type === 'payment') {
      return (
        <div className='bg-indigo-200 dark:bg-indigo-300 p-2 rounded-2xl'>
          <ShoppingBagIcon className="w-10 sm:w-14 text-indigo-600 dark:text-indigo-800" />
        </div>
      );
    } else if (type === 'creation') {
      return (
        <div className='bg-emerald-200 dark:bg-emerald-300 p-2 rounded-2xl'>
          <PlusCircleIcon className="w-10 sm:w-14 text-emerald-600 dark:text-emerald-800" />
        </div>
      );
    } else {
      return (
        <div className='bg-emerald-200 dark:bg-emerald-300 p-2 rounded-2xl'>
          <QuestionMarkCircleIcon className="w-10 sm:w-14 text-emerald-600 dark:text-emerald-800" />
        </div>
      );
    }
  };

  return (
    <div onClick={clickHandler} className="grid grid-cols-4 shadow-md text-sm sm:text-base w-full max-w-sm sm:max-w-xl bg-white dark:bg-gray-800 divide-x-2 divide-gray-200 dark:divide-gray-500 rounded-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">
      <div className="col-span-1 flex items-center justify-center">
        {getTransactionIcon()}
      </div>
      <div className="text-gray-800 dark:text-gray-100 col-span-3 flex flex-col items-center justify-center divide-y-2 divide-gray-200 dark:divide-gray-500">
        <div className="text-base sm:text-lg font-semibold bg-gray-100 dark:bg-gray-900 flex items-center justify-between w-full p-1.5 sm:px-2.5">
          <span>
            {getTransactionTitle()}
            <div className='hidden md:block text-sm'>{transaction.date}</div>
          </span>
          <span>{transaction.quantity / 100} UDC</span>
        </div>
        <div className="flex flex-col sender-to-receiver p-1.5 sm:p-2.5 w-full">
          <span>{t('transactions.from')}: {transaction.sender_name}</span>
          <span>{t('transactions.to')}: {transaction.receiver_name}</span>
        </div>
      </div>
    </div>
  );
};

export const Transactions = () => {
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction>({} as Transaction);
  const [openModal, setOpenModal] = React.useState(false);
  const { data, dispatchData } = useData();
  const { t } = useTranslation();
  const { filters } = useFilters();

  // reload transactions each time the page is visited
  React.useEffect(() => {
    getTransactions()
      .then(transactions => {
        dispatchData({
          type: 'loadTransactions',
          payload: transactions
        });
      });
  }, []);

  const handleOpenTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpenModal(true);
  };

  const getFilteredTransactions = () => {
    const { receiver, sender, date } = filters;
    let filteredTransactions = data.transactions.slice();

    if (sender && sender !== '')
      filteredTransactions = filteredTransactions.filter(transaction => {
        return transaction.sender_name.toLowerCase().includes(sender.toLowerCase())
          || transaction.sender_email.toLowerCase().includes(sender.toLowerCase())
          || transaction.sender_address.toLowerCase().includes(sender.toLowerCase());
      });

    if (receiver && receiver !== '')
      filteredTransactions = filteredTransactions.filter(transaction => {
        return transaction.receiver_name.toLowerCase().includes(receiver.toLowerCase())
          || transaction.receiver_email.toLowerCase().includes(receiver.toLowerCase())
          || transaction.receiver_address.toLowerCase().includes(receiver.toLowerCase());
      });

    if (date && date !== '')  // TODO use includes()
      filteredTransactions = filteredTransactions.filter(transaction => transaction.date.split(' ')[0] === date);

    return filteredTransactions;
  };

  return (
    <div>
      <MiniTopbar title={t('main.transactions')} />
      <div className='flex flex-col-reverse gap-2 lg:grid lg:grid-cols-3 2xl:grid-cols-4 lg:gap-4 h-full w-full'>
        <div className={`${data.transactions.length > 0 ? 'lg:col-span-2 2xl:col-span-3' : 'lg:col-span-3 2xl:col-span-4'} `}>
          {data.transactions.length === 0 && <EmptyTableNotice title={t('errors.noTransactions')} />}
          <div className='flex flex-col gap-3 items-center px-2 sm:px-0'>
            {getFilteredTransactions().map(transaction =>
              <TransactionCard key={transaction.id} transaction={transaction} clickHandler={() => handleOpenTransaction(transaction)} />
            )}
          </div>
        </div>
        {data.transactions.length > 0 && <Sidebar className='bg-white dark:bg-gray-800 lg:col-span-1 2xl:col-span-1' />}
      </div>
      <TransactionModal open={openModal} setOpen={setOpenModal} transaction={selectedTransaction} />
    </div>
  );
};

export const TransactionHistory = () => {
  return (
    <FilterProvider>
      <Transactions />
    </FilterProvider>
  );
};