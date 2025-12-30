import React from 'react';
import { itemService, saleService } from '../services/api.js';

export const useSaleHandlers = (callbacks = {}) => {
  const { onLoadData, onShowNotification } = callbacks;

  const handleRecordSale = React.useCallback(async (selectedItem, saleData, e) => {
    if (e) e.preventDefault();
    try {
      await saleService.createSale({
        itemId: selectedItem.id,
        quantitySold: parseInt(saleData.quantity),
        sellingUnitPrice: saleData.sellingPrice ? parseFloat(saleData.sellingPrice) : selectedItem.price,
      });
      onShowNotification?.('Penjualan berhasil dicatat!', 'success');
      onLoadData?.();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error recording sale';
      onShowNotification?.(errorMsg, 'error');
      console.error('Error recording sale:', error);
    }
  }, [onLoadData, onShowNotification]);

  const handleRestoreSale = React.useCallback(async (saleId) => {
    if (window.confirm('Kembalikan item ini ke katalog dan batalkan penjualan?')) {
      try {
        await saleService.deleteSale(saleId);
        onShowNotification?.('Penjualan berhasil dibatalkan dan item dikembalikan ke katalog!', 'success');
        onLoadData?.();
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Error restoring sale';
        onShowNotification?.(errorMsg, 'error');
        console.error('Error restoring sale:', error);
      }
    }
  }, [onLoadData, onShowNotification]);

  const handleDeleteItem = React.useCallback(async (itemId) => {
    if (window.confirm('Hapus item ini secara permanen dari data item?')) {
      try {
        await itemService.deleteItem(itemId);
        onShowNotification?.('Item berhasil dihapus secara permanen!', 'success');
        onLoadData?.();
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Error deleting item';
        onShowNotification?.(errorMsg, 'error');
        console.error('Error deleting item:', error);
      }
    }
  }, [onLoadData, onShowNotification]);

  const handleDeleteSale = React.useCallback(async (saleId) => {
    if (window.confirm('Hapus penjualan ini?')) {
      try {
        await saleService.deleteSale(saleId);
        onShowNotification?.('Penjualan berhasil dihapus!', 'success');
        onLoadData?.();
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Error deleting sale';
        onShowNotification?.(errorMsg, 'error');
        console.error('Error deleting sale:', error);
      }
    }
  }, [onLoadData, onShowNotification]);

  const handleResetAllSales = React.useCallback(async () => {
    if (window.confirm('Anda yakin ingin mereset SEMUA data penjualan? Tindakan ini tidak bisa dibatalkan.')) {
      try {
        await saleService.resetAllSales();
        onShowNotification?.('Semua data penjualan berhasil direset!', 'success');
        onLoadData?.();
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Error resetting sales';
        onShowNotification?.(errorMsg, 'error');
        console.error('Error resetting sales:', error);
      }
    }
  }, [onLoadData, onShowNotification]);

  return {
    handleRecordSale,
    handleRestoreSale,
    handleDeleteItem,
    handleDeleteSale,
    handleResetAllSales
  };
};
