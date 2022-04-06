import React from 'react';

import { User } from '../types';

type ProviderProps = {
  children: React.ReactNode;
};

type ContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = React.createContext<ContextValue>({} as ContextValue);

const UserProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = React.useState<User | null>(null);
  const value = { user, setUser };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };