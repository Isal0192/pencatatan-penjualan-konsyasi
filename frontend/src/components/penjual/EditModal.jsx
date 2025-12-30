import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const EditModal = ({ editingSale, onClose, onRestoreSale, onDeleteItem }) => {
  if (!editingSale) return null;

  return (
    <Modal show={!!editingSale} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Detail Penjualan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Penitip:</strong> {editingSale.penitip_name}</p>
        <p><strong>Jumlah:</strong> {editingSale.quantity_sold} unit</p>
        <p><strong>Harga Satuan:</strong> Rp {parseFloat(editingSale.unit_price).toLocaleString('id-ID')}</p>
        <p><strong>Total:</strong> Rp {parseFloat(editingSale.total_price).toLocaleString('id-ID')}</p>
        <p><strong>Komisi ({editingSale.commission_percentage}%):</strong> Rp {parseFloat(editingSale.commission_amount).toLocaleString('id-ID')}</p>
        <p><strong>Pendapatan Anda:</strong> Rp {parseFloat(editingSale.penjual_income).toLocaleString('id-ID')}</p>
        <p><strong>Tanggal:</strong> {new Date(editingSale.sale_date).toLocaleDateString('id-ID')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Tutup</Button>
        <Button
          variant="warning"
          onClick={() => {
            onRestoreSale(editingSale.id);
            onClose();
          }}
        >
          Edit - Kembalikan ke Katalog
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            onDeleteItem(editingSale.item_id);
            onClose();
          }}
        >
          Hapus - Hapus Item Permanen
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;