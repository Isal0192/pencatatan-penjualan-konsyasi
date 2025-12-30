import React from 'react';

export const Katalog = ({ items, onSelectItem }) => {
  return (
    <div>
      {items.length === 0 ? (
        <div className="text-center p-5 bg-light rounded">
          <h4>Katalog Kosong</h4>
          <p className="text-muted">Tidak ada barang titipan yang tersedia saat ini.</p>
        </div>
      ) : (
        <div className="row g-4">
          {items.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <img 
                  src={`https://placehold.co/600x400/F7931E/white?text=${encodeURIComponent(item.name)}`} 
                  className="card-img-top" 
                  alt={item.name} 
                  style={{height: '200px', objectFit: 'cover'}}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text text-muted flex-grow-1">{item.description}</p>
                  <p className="card-text">
                    <small className="text-muted">Dari: {item.penitip_name}</small>
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="fw-bold fs-5 text-primary mb-0">
                      Rp {parseFloat(item.price).toLocaleString('id-ID')}
                    </p>
                    <p className={`fw-bold mb-0 ${item.quantity < 5 ? 'text-danger' : ''}`}>
                      Stok: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 p-3">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => onSelectItem(item)}
                    disabled={item.quantity === 0}
                  >
                    Hitung Penjualan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Katalog;