import React from 'react';

function PenitipDashboardComponent({ income, information }) {
  return (
    <div className="row g-4">
      {/* Income Summary */}
      <div className="col-md-6">
        <div className="card text-white bg-success shadow h-100">
          <div className="card-body">
            <h5 className="card-title text-uppercase">Total Pendapatan</h5>
            <p className="card-text fs-2 fw-bold">
              {income ? `Rp ${parseFloat(income.total_sales).toLocaleString('id-ID')}` : 'Memuat...'}
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card text-dark bg-light shadow h-100">
          <div className="card-body">
            <h5 className="card-title text-uppercase">Hari Jualan</h5>
            <p className="card-text fs-2 fw-bold">
              {income ? income.transaction_count : 'Memuat...'}
            </p>
          </div>
        </div>
      </div>

      {/* Information from Seller */}
      <div className="col-12">
        <div className="card shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Informasi dari Penjual</h5>
          </div>
          <div className="card-body">
            {information && information.length > 0 ? (
              <ul className="list-group list-group-flush">
                {information.map((info) => (
                  <li key={info.id} className="list-group-item">
                    <p className="mb-1">{info.content}</p>
                    <small className="text-muted">
                      Dari: <strong>{info.penjual_name}</strong> | Pada: {new Date(info.created_at).toLocaleString('id-ID')}
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted p-3">Tidak ada informasi baru dari penjual.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenitipDashboardComponent;
