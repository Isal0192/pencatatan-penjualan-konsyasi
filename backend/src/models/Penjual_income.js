import pool from '../config/database.js';
import { encrypt, decrypt } from '../middleware/encript.js';

const Penjual_income = {
    createPenjualIncome: async (penjual_id, total_sales, total_commission, net_income, month) => {
        try {
            const query = `INSERT INTO penjual_income (penjual_id, total_sales, total_commission, net_income, month)
                           VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const encryptedSales = encrypt(total_sales.toString());
            const encryptedCommission = encrypt(total_commission.toString());
            const encryptedNetIncome = encrypt(net_income.toString());
            
            const result = await pool.query(query, [
                penjual_id,
                encryptedSales,
                encryptedCommission,
                encryptedNetIncome,
                month
            ]);
            
            return result.rows[0];
        } catch (error) {
            console.error('Error creating PenjualIncome:', error);
            throw error;
        }
    },
   
    getPenjualById : async (penjual_id) => {
        try{
            const query = `SELECT * FROM penjual_income WHERE penjual_id = $1`;
            const result = await pool.query(query, [penjual_id]);
            return result.rows;
        } catch (error) {
            console.error('Error getting PenjualIncome by penjual_id:', error);
            throw error;
        }
    },

    getIncomeSummaryById : async (penjual_id) => {
        try{
            const result = await pool.query('SELECT net_income FROM penjual_income WHERE penjual_id = $1', [penjual_id]);
            const rows = result.rows;

            let total_net_income = 0;
            for (let row of rows) {
                if (row.net_income) {
                    const decryptedIncome = decrypt(row.net_income);
                    total_net_income += parseFloat(decryptedIncome) || 0;
                }
            }
            return {
                total_income: total_net_income,
                transaction_count: rows.length
            };
        } catch (error) {
            console.error('Error getting income summary by penjual_id:', error);
            throw error;
        }
    }
};

export default Penjual_income;
