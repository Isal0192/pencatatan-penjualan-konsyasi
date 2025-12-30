import React from 'react';

export const Penjualan = ({ 
  sales, 
  currentPage, 
  totalPages,
  onPageChange,
  onEdit,
  onDelete 
}) => {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {sales.length === 0 ? (
          <div className="text-center p-5">
            <h4>Belum Ada Penjualan</h4>
            <p className="text-muted">Setiap penjualan yang Anda catat akan muncul di sini.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nama Barang</th>
                    <th scope="col">Penitip</th>
                    <th scope="col">Jumlah</th>
                    <th scope="col">Total Harga</th>
                    <th scope="col">Komisi Anda</th>
                    <th scope="col">Tanggal</th>
                    <th scope="col" className="text-end">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <th scope="row">#{sale.id}</th>
                      <td>{sale.item_name || 'N/A'}</td>
                      <td>{sale.penitip_name || 'N/A'}</td>
                      <td>{sale.quantity_sold}</td>
                      <td>Rp {parseFloat(sale.total_price).toLocaleString('id-ID')}</td>
                      <td className="text-success fw-bold">Rp {parseFloat(sale.penjual_income).toLocaleString('id-ID')}</td>
                      <td>{new Date(sale.sale_date).toLocaleDateString('id-ID')}</td>
                      <td className="text-end">
                        <button 
                          className="btn btn-sm btn-outline-secondary me-2"
                          title="Edit"
                          onClick={() => onEdit(sale)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          title="Hapus"
                          onClick={() => onDelete(sale.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                      Sebelumnya
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => onPageChange(page)}>
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                      Selanjutnya
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Penjualan;