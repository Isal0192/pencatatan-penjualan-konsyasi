import React from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';

function SoldItemsStatistics({ 
  soldItemsStats, 
  selectedMonth, 
  selectedYear,
  onMonthChange,
  onYearChange,
  onLoadStats
}) {
  return (
    <div className="mt-4">
      <h3>Statistik Per Bulan</h3>
      <Form className="mb-3">
        <Row className="align-items-end">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Bulan</Form.Label>
              <Form.Select 
                value={selectedMonth} 
                onChange={(e) => onMonthChange(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                  <option key={m} value={m}>Bulan {m}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Tahun</Form.Label>
              <Form.Select 
                value={selectedYear}
                onChange={(e) => onYearChange(parseInt(e.target.value))}
              >
                {[2023, 2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Button variant="primary" onClick={onLoadStats} className="w-100">
              Lihat Statistik
            </Button>
          </Col>
        </Row>
      </Form>

      {soldItemsStats && (
        <Row>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Item Terjual</Card.Title>
                <Card.Text className="fs-4 fw-bold">{soldItemsStats.total_items_sold}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Jumlah Unit</Card.Title>
                <Card.Text className="fs-4 fw-bold">{soldItemsStats.total_quantity}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Total Penjualan</Card.Title>
                <Card.Text className="fs-4 fw-bold">Rp {parseFloat(soldItemsStats.total_sales || 0).toLocaleString('id-ID')}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Komisi</Card.Title>
                <Card.Text className="fs-4 fw-bold">Rp {parseFloat(soldItemsStats.total_commission || 0).toLocaleString('id-ID')}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default SoldItemsStatistics;