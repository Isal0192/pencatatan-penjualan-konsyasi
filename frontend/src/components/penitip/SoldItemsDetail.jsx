import React from 'react';
import { Table, Pagination } from 'react-bootstrap';

function SoldItemsDetail({ 
  soldItemsDetail, 
  currentPage,
  onPageChange
}) {
  return (
    <div className="mt-4">
      <h3>Detail Penjualan</h3>
      {soldItemsDetail.length > 0 ? (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Harga Satuan</th>
                <th>Total</th>
                <th>Komisi (20%)</th>
                <th>Penjual</th>
              </tr>
            </thead>
            <tbody>
              {soldItemsDetail.map((detail) => (
                <tr key={detail.id}>
                  <td>{new Date(detail.sale_date).toLocaleDateString('id-ID')}</td>
                  <td>{detail.item_name}</td>
                  <td>{detail.quantity_sold} unit</td>
                  <td>Rp {parseFloat(detail.unit_price).toLocaleString('id-ID')}</td>
                  <td>Rp {parseFloat(detail.total_price).toLocaleString('id-ID')}</td>
                  <td>Rp {parseFloat(detail.commission_amount).toLocaleString('id-ID')}</td>
                  <td>{detail.penjual_name}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <Pagination.Prev 
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            <Pagination.Item active>{currentPage}</Pagination.Item>
            <Pagination.Next 
              onClick={() => onPageChange(currentPage + 1)}
            />
          </Pagination>
        </>
      ) : (
        <p className="text-center text-muted p-3">Belum ada detail penjualan</p>
      )}
    </div>
  );
};

export default SoldItemsDetail;