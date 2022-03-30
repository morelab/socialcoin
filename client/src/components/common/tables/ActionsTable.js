import React, { useState } from 'react';
import QRModal from './QRModal';
import SlideOver from '../../overlay/SlideOver';
import EditActionForm from '../forms/EditActionForm';
import { useDashboard } from '../../../context/DashboardContext';
import { useUser } from '../../../context/UserContext';

const ActionsTable = () => {
  const [openSlide, setOpenSlide] = useState(false);
  const [openQR, setOpenQR] = useState(false);
  const [activeID, setActiveID] = useState(0);
  const [slideAction, setSlideAction] = useState({});
  const { state } = useDashboard();
  const { user } = useUser();

  const handleQR = (id) => {
    setActiveID(id);
    setOpenQR(true);
  };

  const handleEdit = (action) => {
    setSlideAction(action);
    setOpenSlide(true);
  };

  const getOwnActions = () => {
    return user.role === 'AD'
      ? state.actions
      : state.actions.filter(a => a.company_id === user.id);
  };

  return (
    <>
      <SlideOver open={openSlide} setOpen={setOpenSlide} >
        <EditActionForm data={slideAction} setOpen={setOpenSlide} />
      </SlideOver>
      <QRModal open={openQR} setOpen={setOpenQR} url={`${window.location.href}/register/${activeID}`} />
      <div className="shadow block whitespace-nowrap overflow-x-auto lg:border-b lg:border-gray-200 lg:rounded-lg dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                Reward
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                Indicator
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                Progress
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider dark:text-gray-200"
              >
                QR
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-600 dark:bg-gray-800">
            {getOwnActions().map((action) => (
              <tr key={action.id}>
                <td className="px-2 py-2 whitespace-normal">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-md font-semibold text-gray-900 dark:text-gray-50">{action.name}</div>
                      <div className="text-md text-gray-500 dark:text-gray-300">{action.company_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-md max-w-xl text-gray-900 dark:text-gray-50">{action.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-md text-gray-900 dark:text-gray-50">{action.reward / 100} UDC</div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-md text-gray-900 dark:text-gray-50">{action.kpi_indicator}</div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-md text-gray-900 dark:text-gray-50">{`${action.kpi}/${action.kpi_target}`}</div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div onClick={() => handleQR(action.id)} className="cursor-pointer text-md text-indigo-600 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200">
                    Download
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                  <div onClick={() => handleEdit(action)} className="cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200">
                    Edit
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ActionsTable;