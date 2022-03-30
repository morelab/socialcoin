import React, { useReducer, useEffect } from 'react';

const DashboardContext = React.createContext();

const dashboardReducer = (state, action) => {
  switch (action.type) {
  case 'loadCampaigns': {
    return {
      campaigns: action.payload.campaigns,
      actions: state.actions,
      offers: state.offers
    };
  }
  case 'loadActions': {
    return {
      campaigns: state.campaigns,
      actions: action.payload.actions,
      offers: state.offers
    };
  }
  case 'loadOffers': {
    return {
      campaigns: state.campaigns,
      actions: state.actions,
      offers: action.payload.offers
    };
  }
  case 'addCampaign': {
    return {
      campaigns: state.campaigns.concat(action.payload.newCampaign),
      actions: state.actions,
      offers: state.offers
    };
  }
  case 'editCampaign': {
    const editedCampaign = action.payload.editedCampaign;

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
      campaigns: state.campaigns.filter(campaign => campaign.id !== action.payload.campaignId),
      actions: state.actions,
      offers: state.offers
    };
  }
  case 'addAction': {
    return {
      campaigns: state.campaigns,
      actions: state.actions.concat(action.payload.newAction),
      offers: state.offers
    };
  }
  case 'editAction': {
    const editedAction = action.payload.editedAction;

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
      campaigns: state.campaigns,
      actions: state.actions.filter(act => act.id !== action.payload.actionId),
      offers: state.offers
    };
  }
  case 'addOffer': {
    return {
      campaigns: state.campaigns,
      actions: state.actions,
      offers: state.offers.concat(action.payload.newOffer)
    };
  }
  case 'editOffer': {
    const editedOffer = action.payload.editedOffer;

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
      campaigns: state.campaigns,
      actions: state.actions,
      offers: state.offers.filter(offer => offer.id !== action.payload.offerId)
    };
  }
  default: {
    throw new Error(`Unhandled action type: ${action.type}`);
  }
  }
};

const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, {
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