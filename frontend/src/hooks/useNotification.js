import React from 'react';

export const useNotification = () => {
  const [notification, setNotification] = React.useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return { notification, showNotification };
};
