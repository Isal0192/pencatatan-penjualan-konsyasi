import Sale from '../models/Sale.js';
import Item from '../models/Item.js';

export const createSale = async (req, res) => {
  try {
    const { itemId, quantitySold, sellingUnitPrice } = req.body;
    const penjualId = req.user.id;

    if (!itemId || !quantitySold) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.quantity < quantitySold) {
      return res.status(400).json({ message: 'Insufficient quantity' });
    }

    // Use penitip-provided base price (item.price) as the penitip unit price
    const basePrice = parseFloat(item.price);
    const sellPrice = sellingUnitPrice ? parseFloat(sellingUnitPrice) : basePrice;

    const sale = await Sale.create(itemId, penjualId, item.penitip_id, quantitySold, sellPrice, basePrice);

    // Update item quantity
    const updatedItem = await Item.updateQuantity(itemId, -quantitySold);

    // If quantity becomes 0, mark as 'habis' instead of deleting the row. This lets us restore stock if a sale is removed.
    if (updatedItem.quantity === 0) {
      await Item.update(itemId, updatedItem.name, updatedItem.description, 0, updatedItem.price, 'habis', updatedItem.image_url);
    }

    res.status(201).json({
      message: 'Sale recorded successfully',
      sale
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating sale', error: error.message });
  }
};

export const getMySales = async (req, res) => {
  try {
    const penjualId = req.user.id;
    const sales = await Sale.findByPenjualId(penjualId);
    res.status(200).json({ sales });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales', error: error.message });
  }
};

export const getPenitipSales = async (req, res) => {
  try {
    const penitipId = req.user.id;
    const sales = await Sale.findByPenitipId(penitipId);
    res.status(200).json({ sales });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales', error: error.message });
  }
};

export const getPenitipMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const penitipId = req.user.id;

    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required' });
    }

    const report = await Sale.getMonthlyReportByPenitip(penitipId, year, month);
    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error: error.message });
  }
};

export const getPenjualMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const penjualId = req.user.id;

    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required' });
    }

    const report = await Sale.getMonthlyReportByPenjual(penjualId, year, month);
    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error: error.message });
  }
};

export const getTotalPenjualIncome = async (req, res) => {
  try {
    const penjualId = req.user.id;
    const sales = await Sale.findByPenjualId(penjualId);
    
    const totalIncome = sales.reduce((sum, sale) => sum + parseFloat(sale.penjual_income || 0), 0);
    const totalCommission = sales.reduce((sum, sale) => sum + parseFloat(sale.commission_amount || 0), 0);
    const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total_price || 0), 0);

    res.status(200).json({
      total_penjual_income: totalIncome,
      total_commission: totalCommission,
      total_sales: totalSales
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating income', error: error.message });
  }
};

export const getPenitipTotalIncome = async (req, res) => {
  try {
    const penitipId = req.user.id;
    const sales = await Sale.findByPenitipId(penitipId);
    
    const totalIncome = sales.reduce((sum, sale) => sum + parseFloat(sale.commission_amount || 0), 0);
    const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total_price || 0), 0);

    res.status(200).json({
      total_income: totalIncome,
      total_sales: totalSales,
      transaction_count: sales.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating income', error: error.message });
  }
};

export const resetPenjualSales = async (req, res) => {
  try {
    const penjualId = req.user.id;
    await Sale.deleteByPenjualId(penjualId);
    res.status(200).json({ message: 'All sales reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting sales', error: error.message });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const { saleId } = req.params;
    const penjualId = req.user.id;

    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    if (sale.penjual_id !== penjualId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Before deleting sale, restore item quantity
    const item = await Item.findById(sale.item_id);
    if (item) {
      await Item.updateQuantity(sale.item_id, parseInt(sale.quantity_sold));
      // If item was marked 'habis', mark it 'tersedia' again
      if (item.status === 'habis') {
        // set status to tersedia
        await Item.update(item.id, item.name, item.description, item.quantity + parseInt(sale.quantity_sold), item.price, 'tersedia', item.image_url);
      }
    }

    await Sale.deleteBySaleId(saleId);
    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sale', error: error.message });
  }
};
