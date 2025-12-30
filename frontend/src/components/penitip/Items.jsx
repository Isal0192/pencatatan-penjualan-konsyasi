import React from 'react';
import { Button, Card, Row, Col, Badge } from 'react-bootstrap';

export default function Items({ items = [], onOpenModal }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'tersedia':
        return <Badge bg="success">Sedang Dijual</Badge>;
      case 'habis':
        return <Badge bg="danger">Habis</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-4">
        <Button variant="primary" onClick={onOpenModal}>
          + Tambah Barang Titipan
        </Button>
      </div>

      {items && items.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {items.map((item) => (
            <Col key={item.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <Card.Title>{item.name}</Card.Title>
                    {getStatusBadge(item.status)}
                  </div>
                  <Card.Text className="text-muted">{item.description}</Card.Text>
                </Card.Body>
                <Card.Footer className="bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="fw-bold fs-5 text-primary mb-0">
                      Rp {parseFloat(item.price || 0).toLocaleString('id-ID')}
                    </p>
                    <p className="fw-bold mb-0">
                      Stok: {item.quantity}
                    </p>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center p-5 bg-light rounded">
          <h4>Anda Belum Memiliki Barang Titipan</h4>
          <p className="text-muted">Klik tombol "Tambah Barang Titipan" untuk memulai.</p>
        </div>
      )}
    </div>
  );
}
