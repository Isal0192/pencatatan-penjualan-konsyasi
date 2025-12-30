import React from 'react';

export const useEditModal = () => {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editingSale, setEditingSale] = React.useState(null);

  const openEditModal = (sale) => {
    setEditingSale(sale);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingSale(null);
  };

  return {
    showEditModal,
    editingSale,
    openEditModal,
    closeEditModal
  };
};
