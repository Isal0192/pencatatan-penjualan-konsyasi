import React from 'react';
import { itemService, saleService, incomeService } from '../services/api.js';

export const usePenitipData = (userId, pollInterval = 5000) => {
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

      if (userId) {
        const incomeRes = await incomeService.getIncomeByPenitipId(userId);
        setIncome(incomeRes.data);
      }

      const soldItemsRes = await itemService.getSoldItems();
      setSoldItems(soldItemsRes.data.sold_items || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [userId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time polling
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
