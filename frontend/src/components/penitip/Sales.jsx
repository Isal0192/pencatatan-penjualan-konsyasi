import React from 'react';

function PenitipSales({ sales }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {sales.length === 0 ? (
          <div className="text-center p-5">
            <h4>Belum Ada Penjualan</h4>
            <p className="text-muted">Setiap barang Anda yang terjual akan muncul di sini.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID Penjualan</th>
                  <th scope="col">Nama Barang</th>
                  <th scope="col">Dijual Oleh</th>
                  <th scope="col">Jumlah</th>
                  <th scope="col">Total Harga</th>
                  <th scope="col">Pendapatan Anda</th>
                  <th scope="col">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <th scope="row">#{sale.id}</th>
                    <td>{sale.item_name || 'N/A'}</td>
                    <td>{sale.penjual_name || 'N/A'}</td>
                    <td>{sale.quantity_sold}</td>
                    <td>Rp {parseFloat(sale.total_price).toLocaleString('id-ID')}</td>
                    <td className="text-success fw-bold">
                      Rp {parseFloat(sale.total_price - (sale.penjual_income || 0)).toLocaleString('id-ID')}
                    </td>
                    <td>{new Date(sale.sale_date).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PenitipSales;


