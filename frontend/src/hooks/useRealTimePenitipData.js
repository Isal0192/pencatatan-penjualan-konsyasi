import React from 'react';
import { itemService, saleService } from '../services/api.js';
import { usePollInterval } from './usePollInterval.jsx';

export const useRealTimePenitipData = () => {
  const pollInterval = usePollInterval();
  const [items, setItems] = React.useState([]);
  const [sales, setSales] = React.useState([]);
  const [soldItems, setSoldItems] = React.useState([]);
  const [income, setIncome] = React.useState(null);

  const loadData = React.useCallback(async () => {
    try {
      const itemsRes = await itemService.getMyItems();
      setItems(itemsRes.data.items);

      const salesRes = await saleService.getPenitipSales();
      setSales(salesRes.data.sales);

      const incomeRes = await saleService.getTotalIncome('penitip');
      setIncome(incomeRes.data);

      const soldItemsRes = await itemService.getSoldItems();
      setSoldItems(soldItemsRes.data.sold_items || []);
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
    sales,
    soldItems,
    income,
    loadData
  };
};
