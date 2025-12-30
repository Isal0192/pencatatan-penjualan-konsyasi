import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export const SaleModal = ({ selectedItem, saleData, onClose, onSubmit, onDataChange }) => {
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem || selectedItem.quantity <= 0) {
      alert('Item ini sudah terjual habis atau tidak tersedia');
      onClose();
      return;
    }
    await onSubmit(e);
  };

  if (!selectedItem) return null;

  return (
    <Modal show={!!selectedItem} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Catat Penjualan - {selectedItem.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedItem.quantity <= 0 ? (
          <div>
            <p className="text-danger">Item &quot;{selectedItem.name}&quot; sudah terjual habis.</p>
          </div>
        ) : (
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Harga Dasar (dari Penitip)</Form.Label>
              <Form.Control type="text" value={`Rp ${parseFloat(selectedItem.price).toLocaleString('id-ID')}`} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="sellingPrice">Harga Jual Anda (Rp)</Form.Label>
              <Form.Control
                type="number"
                id="sellingPrice"
                value={saleData.sellingPrice ?? selectedItem.price}
                onChange={(e) => onDataChange({ ...saleData, sellingPrice: e.target.value })}
                min={selectedItem.price}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="quantity">Jumlah Terjual</Form.Label>
              <Form.Control
                type="number"
                id="quantity"
                placeholder="Jumlah"
                value={saleData.quantity}
                onChange={(e) => onDataChange({ ...saleData, quantity: e.target.value })}
                max={selectedItem.quantity}
                min="0"
                required
              />
              <Form.Text className="text-muted">Stok tersedia: {selectedItem.quantity}</Form.Text>
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={onClose}>Batal</Button>
              <Button variant="primary" type="submit">Simpan Penjualan</Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SaleModal;