import React from 'react';
import { itemService } from '../services/api.js';

export const useSoldItemsData = (itemsPerPage = 10, pollInterval = 5000) => {
  const [soldItemsDetail, setSoldItemsDetail] = React.useState([]);
  const [soldItemsStats, setSoldItemsStats] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());

  const loadSoldItemsDetail = React.useCallback(async (page) => {
    try {
      const res = await itemService.getSoldItemsDetail(page, itemsPerPage);
      setSoldItemsDetail(res.data.sold_items_detail || []);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading sold items detail:', error);
    }
  }, [itemsPerPage]);

  const loadSoldItemsStats = React.useCallback(async (year, month) => {
    try {
      const res = await itemService.getSoldItemsStatistics(year, month);
      setSoldItemsStats(res.data.summary);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }, []);

  React.useEffect(() => {
    loadSoldItemsDetail(1);
  }, [loadSoldItemsDetail]);

  // Real-time polling untuk detail penjualan
  React.useEffect(() => {
    const interval = setInterval(() => {
      loadSoldItemsDetail(currentPage);
    }, pollInterval);

    return () => clearInterval(interval);
  }, [loadSoldItemsDetail, currentPage, pollInterval]);

  return {
    soldItemsDetail,
    soldItemsStats,
    currentPage,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    loadSoldItemsDetail,
    loadSoldItemsStats
  };
};
