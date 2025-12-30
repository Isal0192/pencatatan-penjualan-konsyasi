import React from 'react';

export const useAddItemModal = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
  });

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      description: '',
      quantity: '',
      price: '',
    });
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    showModal,
    formData,
    openModal,
    closeModal,
    setFormData,
    updateFormData
  };
};
