import Item from '../models/Item.js';

export const createItem = async (req, res) => {
  try {
    const { name, description, quantity, price } = req.body;
    const penitipId = req.user.id;

    if (!name || !quantity || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const item = await Item.create(penitipId, name, description, quantity, price);
    res.status(201).json({
      message: 'Item created successfully',
      item
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
};

export const getMyItems = async (req, res) => {
  try {
    const penitipId = req.user.id;
    const items = await Item.findByPenitipId(penitipId);
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.getAll();
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, quantity, price, status, imageUrl } = req.body;
    
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.penitip_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedItem = await Item.update(id, name, description, quantity, price, status, imageUrl);
    res.status(200).json({
      message: 'Item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.penitip_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Item.delete(id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
};

// Get sold items (grouped by item)
export const getSoldItems = async (req, res) => {
  try {
    const penitipId = req.user.id;
    const soldItems = await Item.getSoldItems(penitipId);
    res.status(200).json({ 
      message: 'Sold items retrieved successfully',
      sold_items: soldItems 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sold items', error: error.message });
  }
};

// Get sold items detail (per transaction)
export const getSoldItemsDetail = async (req, res) => {
  try {
    const penitipId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const soldItems = await Item.getSoldItemsDetail(penitipId);
    const paginatedItems = soldItems.slice(offset, offset + parseInt(limit));

    res.status(200).json({ 
      message: 'Sold items detail retrieved successfully',
      sold_items_detail: paginatedItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: soldItems.length,
        pages: Math.ceil(soldItems.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sold items detail', error: error.message });
  }
};

// Get sold items summary by period
export const getSoldItemsSummary = async (req, res) => {
  try {
    const penitipId = req.user.id;
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required' });
    }

    const summary = await Item.getSoldItemsSummary(penitipId, year, month);
    res.status(200).json({ 
      message: 'Sold items summary retrieved successfully',
      summary: summary || {
        total_items_sold: 0,
        total_quantity: 0,
        total_sales: 0,
        total_commission: 0,
        unique_sellers: 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sold items summary', error: error.message });
  }
};

