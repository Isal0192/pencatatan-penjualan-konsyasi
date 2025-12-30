import React from 'react';
import { Table } from 'react-bootstrap';

function SoldItemsSummary({ soldItems }) {
  return (
    <div className="mt-4">
      <h3>Ringkasan Barang Terjual</h3>
      {soldItems.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nama Barang</th>
              <th>Harga</th>
              <th>Total Terjual</th>
              <th>Transaksi</th>
              <th>Total Revenue</th>
              <th>Komisi</th>
              <th>Penjual Terakhir</th>
            </tr>
          </thead>
          <tbody>
            {soldItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>Rp {parseFloat(item.price).toLocaleString('id-ID')}</td>
                <td>{item.total_quantity_sold} unit</td>
                <td>{item.total_transactions}x</td>
                <td>Rp {parseFloat(item.total_revenue).toLocaleString('id-ID')}</td>
                <td>Rp {parseFloat(item.total_commission).toLocaleString('id-ID')}</td>
                <td>{item.penjual_name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center text-muted p-3">Belum ada barang terjual</p>
      )}
    </div>
  );
};

export default SoldItemsSummary;