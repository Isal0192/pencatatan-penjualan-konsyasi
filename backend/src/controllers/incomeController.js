import Penitip_income from '../models/penitip_income.js';
import Penjual_income from '../models/Penjual_income.js';

const incomeController = {
    getTotalIncomeByPenitipId: async (req, res) => {
        try {
            const { penitip_id } = req.params;
            const incomeSummary = await Penitip_income.getIncomeSummaryById(penitip_id);
            res.status(200).json({ 
                total_sales: incomeSummary.total_income,
                transaction_count: incomeSummary.transaction_count
            });
        } catch (error) {
            console.error('Error getting total income by penitip_id:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getTotalIncomeByPenjualId: async (req, res) => {
        try {
            const { penjual_id } = req.params;
            const incomeSummary = await Penjual_income.getIncomeSummaryById(penjual_id);
            res.status(200).json({ 
                total_sales: incomeSummary.total_income,
                transaction_count: incomeSummary.transaction_count
            });
        } catch (error) {
            console.error('Error getting total income by penjual_id:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export default incomeController;

