import React from 'react';

import { Campaign, Action, Offer } from '../types';

type ProviderProps = {
  children: React.ReactNode;
};

type DashboardState = {
  campaigns: Campaign[];
  actions: Action[];
  offers: Offer[];
};

export type DashboardAction =
  | { type: 'loadCampaigns', payload: Campaign[] }
  | { type: 'loadActions', payload: Action[] }
  | { type: 'loadOffers', payload: Offer[] }
  | { type: 'addCampaign', payload: Campaign }
  | { type: 'editCampaign', payload: Campaign }
  | { type: 'removeCampaign', payload: number }
  | { type: 'addAction', payload: Action }
  | { type: 'editAction', payload: Action }
  | { type: 'removeAction', payload: number }
  | { type: 'addOffer', payload: Offer }
  | { type: 'editOffer', payload: Offer }
  | { type: 'removeOffer', payload: number };

type ContextValue = {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
};

const DashboardContext = React.createContext<ContextValue>({} as ContextValue);

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  const { type, payload } = action;

  switch (type) {
  case 'loadCampaigns': {
    return {
      ...state,
      campaigns: payload
    };
  }
  case 'loadActions': {
    return {
      ...state,
      actions: payload,
    };
  }
  case 'loadOffers': {
    return {
      ...state,
      offers: payload
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
      campaigns: state.campaigns.map(el => {
        if (el.id === editedCampaign.id) {
          return editedCampaign;
        }
        return el;
      }),
      actions: state.actions,
      offers: state.offers
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
      campaigns: state.campaigns,
      actions: state.actions.map(el => {
        if (el.id === editedAction.id) {
          return editedAction;
        }
        return el;
      }),
      offers: state.offers
    };
  }
  case 'removeAction': {
    return {
      ...state,
      actions: state.actions.filter(act => act.id !== payload)
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
      campaigns: state.campaigns,
      actions: state.actions,
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

const DashboardProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = React.useReducer(dashboardReducer, {
    campaigns: [],
    actions: [],
    offers: []
  });
  const value = { state, dispatch };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

const useDashboard = () => {
  const context = React.useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export { DashboardProvider, useDashboard };