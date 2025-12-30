import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

export const Penitip = ({ penitips }) => {
  return (
    <div>
      <h2>Daftar Penitip</h2>
      {penitips.length === 0 ? (
        <div className="text-center p-5 bg-light rounded">
          <p>Tidak ada data penitip</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {penitips.map((penitip) => (
            <Col key={penitip.id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{penitip.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{penitip.email}</Card.Subtitle>
                  <Card.Text>
                    <strong>Telepon:</strong> {penitip.phone}
                    <br />
                    <strong>Alamat:</strong> {penitip.address}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Penitip;