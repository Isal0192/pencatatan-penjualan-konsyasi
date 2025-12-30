import pool from '../config/database.js';
import { encrypt, decrypt } from '../middleware/encript.js';

const Penitip_income = {
    createPenitipIncome: async (penitip_id, item_id, total_sales, total_income, month) => {
        try {
            const query = `INSERT INTO penitip_income (penitip_id, item_id, total_sales, total_income, month)
                           VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const encryptedSales = encrypt(total_sales.toString());
            const encryptedIncome = encrypt(total_income.toString());
            const result = await pool.query(query, [
                penitip_id, 
                item_id, 
                encryptedSales, 
                encryptedIncome, 
                month
            ]);
            
            return result.rows[0];
        } catch (error) {
            console.error('Error creating PenitipIncome:', error);
            throw error;
        }
    },
   
    getPenitipById : async (penitip_id) => {
        try{
            const query = `SELECT * FROM penitip_income WHERE penitip_id = $1`;
            const result = await pool.query(query, [penitip_id]);
            return result.rows;
        } catch (error) {
            console.error('Error getting PenitipIncome by penitip_id:', error);
            throw error;
        }
    },

    getIncomeSummaryById : async (penitip_id) => {
        try{
            const result = await pool.query('SELECT total_income FROM penitip_income WHERE penitip_id = $1', [penitip_id]);
            const rows = result.rows;

            let total_income = 0;
            for (let row of rows) {
                if (row.total_income) {
                    const decryptedIncome = decrypt(row.total_income);
                    total_income += parseFloat(decryptedIncome) || 0;
                }
            }
            return {
                total_income: total_income,
                transaction_count: rows.length
            };
        } catch (error) {
            console.error('Error getting income summary by penitip_id:', error);
            throw error;
        }
    }
};

export default Penitip_income;
