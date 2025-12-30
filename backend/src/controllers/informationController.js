import Information from '../models/Information.js';

export const createInformation = async (req, res) => {
  try {
    const { content } = req.body;
    const penjualId = req.user.id;

    if (req.user.role !== 'penjual') {
      return res.status(403).json({ message: 'Unauthorized: Only sellers can create information' });
    }

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const information = await Information.create(penjualId, content);
    res.status(201).json({
      message: 'Information created successfully',
      information
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating information', error: error.message });
  }
};

export const getInformation = async (req, res) => {
  try {
    const information = await Information.getAll();
    res.status(200).json({ information });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching information', error: error.message });
  }
};
