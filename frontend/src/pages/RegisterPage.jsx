import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { authService } from '../services/api.js';

export default function RegisterPage({ onLogin }) {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'penitip',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: formData.role,
      });

      const loginResponse = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
      onLogin(loginResponse.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100">
        <Col md={8} lg={6} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h1 className="h3 fw-bold text-primary">Registrasi</h1>
                <p className="text-muted">Buat akun baru untuk Sistem Konsinyasi</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicName">
                      <Form.Label>Nama Lengkap</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Masukkan nama lengkap"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Masukkan email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicPhone">
                      <Form.Label>Nomor Telepon</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Masukkan nomor telepon"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicAddress">
                      <Form.Label>Alamat (Opsional)</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        placeholder="Masukkan alamat"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Minimal 6 karakter"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? 'Hide' : 'Show'}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                      <Form.Label>Konfirmasi Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Konfirmasi password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="formBasicRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Select name="role" value={formData.role} onChange={handleChange}>
                    <option value="penitip">Penitip (Pemilik Barang)</option>
                    <option value="penjual">Penjual (Reseller)</option>
                  </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? 'Mendaftar...' : 'Daftar'}
                </Button>
              </Form>
              <p className="mt-3 text-center">
                Sudah punya akun? <Link to="/login">Masuk di sini</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
