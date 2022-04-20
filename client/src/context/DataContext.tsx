import React from 'react';

import { Campaign, Action, Offer } from '../types';

type ProviderProps = {
  children: React.ReactNode;
};

export type LoadState = 'NOT_LOADED' | 'ALL_LOADED' | 'LOADING_ERROR';

type DataState = {
  loadState: LoadState;
  campaigns: Campaign[];
  actions: Action[];
  offers: Offer[];
};

export type DataAction =
  | { type: 'loadData', payload: { campaigns: Campaign[], actions: Action[], offers: Offer[] } }
  | { type: 'loadError', payload: Record<string, never> } // Record<string, never> indicates an empty object
  | { type: 'addCampaign', payload: Campaign }
  | { type: 'editCampaign', payload: Campaign }
  | { type: 'removeCampaign', payload: string }
  | { type: 'addAction', payload: Action }
  | { type: 'editAction', payload: Action }
  | { type: 'removeAction', payload: string }
  | { type: 'addOffer', payload: Offer }
  | { type: 'editOffer', payload: Offer }
  | { type: 'removeOffer', payload: string };

type ContextValue = {
  data: DataState;
  dispatchData: React.Dispatch<DataAction>;
};

const DataContext = React.createContext<ContextValue>({} as ContextValue);

const dashboardReducer = (state: DataState, action: DataAction): DataState => {
  const { type, payload } = action;

  switch (type) {
    case 'loadData': {
      const { campaigns, actions, offers } = payload;
      return {
        ...state,
        loadState: 'ALL_LOADED',
        campaigns,
        actions,
        offers
      };
    }
    case 'loadError': {
      return {
        ...state,
        loadState: 'LOADING_ERROR'
      };
    }
    case 'addCampaign': {
      return {
        ...state,
        campaigns: state.campaigns.concat(payload)
      };
    }
    case 'editCampaign': {
      const editedCampaign = payload;
      return {
        ...state,
        campaigns: state.campaigns.map(el => {
          if (el.id === editedCampaign.id) {
            return editedCampaign;
          }
          return el;
        })
      };
    }
    case 'removeCampaign': {
      return {
        ...state,
        campaigns: state.campaigns.filter(campaign => campaign.id !== payload)
      };
    }
    case 'addAction': {
      return {
        ...state,
        actions: state.actions.concat(payload)
      };
    }
    case 'editAction': {
      const editedAction = payload;
      return {
        ...state,
        actions: state.actions.map(el => {
          if (el.id === editedAction.id) {
            return editedAction;
          }
          return el;
        }),
      };
    }
    case 'removeAction': {
      return {
        ...state,
        actions: state.actions.filter(action => action.id !== payload)
      };
    }
    case 'addOffer': {
      return {
        ...state,
        offers: state.offers.concat(payload)
      };
    }
    case 'editOffer': {
      const editedOffer = payload;
      return {
        ...state,
        offers: state.offers.map(el => {
          if (el.id === editedOffer.id) {
            return editedOffer;
          }
          return el;
        }),
      };
    }
    case 'removeOffer': {
      return {
        ...state,
        offers: state.offers.filter(offer => offer.id !== payload)
      };
    }
  }
};

const DataProvider = ({ children }: ProviderProps) => {
  const [data, dispatchData] = React.useReducer(dashboardReducer, {
    loadState: 'NOT_LOADED',
    campaigns: [],
    actions: [],
    offers: []
  });
  const value = { data, dispatchData };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => {
  const context = React.useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export { DataProvider, useData };