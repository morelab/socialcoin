import React from 'react';

type ProviderProps = {
  children: React.ReactNode;
};

type TransactionFilters = {
  sender: string;
  receiver: string;
  date: string;
};

type ContextValue = {
  filters: TransactionFilters;
  filterHandler: (event: React.FormEvent<HTMLInputElement>) => void;
  clearFilters: () => void;
};

const FilterContext = React.createContext<ContextValue>({} as ContextValue);

const defaultFilters: TransactionFilters = {
  sender: '',
  receiver: '',
  date: ''
};

export const FilterProvider = ({ children }: ProviderProps) => {
  const [filters, setFilters] = React.useState<TransactionFilters>(defaultFilters);

  const filterHandler = (event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.currentTarget;
    const value = target.value;
    const name = target.name;

    setFilters({
      ...filters,
      [name]: value
    });
  };

  const clearFilters = () => setFilters(defaultFilters);

  const value = {
    filters,
    filterHandler,
    clearFilters,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = React.useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a ModalProvider');
  }
  return context;
};