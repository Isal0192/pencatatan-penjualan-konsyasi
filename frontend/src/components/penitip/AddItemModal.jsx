import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function AddItemModal({ showModal, formData, onClose, onSubmit, onFieldChange }) {
  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tambah Titipan Baru</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nama Barang</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nama Barang"
              value={formData.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Deskripsi"
              value={formData.description}
              onChange={(e) => onFieldChange('description', e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Jumlah</Form.Label>
            <Form.Control
              type="number"
              placeholder="Jumlah"
              value={formData.quantity}
              onChange={(e) => onFieldChange('quantity', e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Harga</Form.Label>
            <Form.Control
              type="number"
              placeholder="Harga"
              value={formData.price}
              onChange={(e) => onFieldChange('price', e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Simpan
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddItemModal;