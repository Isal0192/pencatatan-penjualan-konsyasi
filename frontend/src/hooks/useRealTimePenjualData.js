import React from 'react';
import { authService, itemService, saleService } from '../services/api.js';
import { usePollInterval } from './usePollInterval.jsx';

export const useRealTimePenjualData = () => {
  const pollInterval = usePollInterval();
  const [items, setItems] = React.useState([]);
  const [penitips, setPenitips] = React.useState([]);
  const [sales, setSales] = React.useState([]);
  const [income, setIncome] = React.useState(null);

  const loadData = React.useCallback(async () => {
    try {
      const itemsRes = await itemService.getAllItems();
      const availableItems = itemsRes.data.items.filter(item => item.quantity > 0);
      setItems(availableItems);

      const penitipsRes = await authService.getPenitips();
      setPenitips(penitipsRes.data.users);

      const salesRes = await saleService.getMySales();
      setSales(salesRes.data.sales);

      const incomeRes = await saleService.getTotalIncome('penjual');
      setIncome(incomeRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time polling dengan context interval
  React.useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [loadData, pollInterval]);

  return {
    items,
    penitips,
    sales,
    income,
    loadData
  };
};
