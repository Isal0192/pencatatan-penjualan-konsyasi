import React from 'react';
import { itemService } from '../services/api.js';

export const usePenitipHandlers = (callbacks = {}) => {
  const { onLoadData, onShowNotification } = callbacks;

  const handleAddItem = React.useCallback(async (formData, e) => {
    if (e) e.preventDefault();
    try {
      await itemService.createItem(formData);
      onShowNotification?.('Titipan berhasil ditambahkan!', 'success');
      onLoadData?.();
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error adding item';
      onShowNotification?.(errorMsg, 'error');
      console.error('Error adding item:', error);
      return false;
    }
  }, [onLoadData, onShowNotification]);

  return {
    handleAddItem
  };
};
