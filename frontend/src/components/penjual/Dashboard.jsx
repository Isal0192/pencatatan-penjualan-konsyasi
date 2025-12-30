import React from 'react';

export const Dashboard = ({ income, onResetAllSales, penitips = [] }) => {
  return (
    <div>
      {/* Income Summary */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <h5 className="card-title text-uppercase">Total Keuntungan Bersih</h5>
              <p className="card-text fs-2 fw-bold">
                {income ? `Rp ${parseFloat(income.total_sales).toLocaleString('id-ID')}` : 'Memuat...'}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card text-dark bg-light shadow">
            <div className="card-body">
              <h5 className="card-title text-uppercase">Jumlah Transaksi</h5>
              <p className="card-text fs-2 fw-bold">
                {income ? income.transaction_count : 'Memuat...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registered Consignors List & Actions */}
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Mitra Penitip Terdaftar</h5>
          <button className="btn btn-sm btn-outline-danger" onClick={onResetAllSales}>
            Reset Semua Data Penjualan
          </button>
        </div>
        <div className="card-body">
          {penitips && penitips.length > 0 ? (
            <ul className="list-group" style={{maxHeight: '400px', overflowY: 'auto'}}>
              {penitips.map((p) => (
                <li key={p.id} className="list-group-item d-flex justify-content-between align-items-start">
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{p.name}</div>
                    <small className="text-muted">{p.email} | {p.phone || 'No phone'}</small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted">Tidak ada mitra penitip yang terdaftar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;