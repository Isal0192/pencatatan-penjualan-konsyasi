import React from 'react';

export const useSaleModal = () => {
  const [showSaleModal, setShowSaleModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [saleData, setSaleData] = React.useState({
    quantity: '',
  });

  const openSaleModal = (item) => {
    setSelectedItem(item);
    setShowSaleModal(true);
  };

  const closeSaleModal = () => {
    setShowSaleModal(false);
    setSelectedItem(null);
    setSaleData({ quantity: '' });
  };

  return {
    showSaleModal,
    selectedItem,
    saleData,
    openSaleModal,
    closeSaleModal,
    setSaleData
  };
};
