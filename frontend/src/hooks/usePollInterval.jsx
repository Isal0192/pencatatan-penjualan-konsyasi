import React from 'react';

const PollIntervalContext = React.createContext(5000);

export const PollIntervalProvider = ({ children, interval = 5000 }) => {
  return (
    <PollIntervalContext.Provider value={interval}>
      {children}
    </PollIntervalContext.Provider>
  );
};

export const usePollInterval = () => {
  const context = React.useContext(PollIntervalContext);
  if (context === undefined) {
    throw new Error('usePollInterval must be used within PollIntervalProvider');
  }
  return context;
};
