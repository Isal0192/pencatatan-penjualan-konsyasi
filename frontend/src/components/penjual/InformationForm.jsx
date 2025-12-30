import React from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { informationService } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';

export const InformationForm = () => {
  const [content, setContent] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { notification, showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      showNotification('Konten tidak boleh kosong', 'danger');
      return;
    }
    setLoading(true);
    try {
      await informationService.createInformation({ content });
      showNotification('Informasi berhasil dikirim', 'success');
      setContent('');
    } catch (error) {
      console.error('Error creating information:', error);
      showNotification(error.response?.data?.message || 'Gagal mengirim informasi', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Buat Informasi untuk Penitip</Card.Title>
        {notification && (
          <Alert variant={notification.type}>
            {notification.message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="information-content" visuallyHidden>Informasi</Form.Label>
            <Form.Control
              as="textarea"
              id="information-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis informasi di sini..."
              rows="6"
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Mengirim...' : 'Kirim Informasi'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default InformationForm;