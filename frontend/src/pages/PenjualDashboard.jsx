import React from 'react';
import { Navbar, Nav, Container, Row, Col, Alert, Button } from 'react-bootstrap';
import '../styles.css';
import Dashboard from '../components/penjual/Dashboard.jsx';
import Katalog from '../components/penjual/Katalog.jsx';
import Penjualan from '../components/penjual/Penjualan.jsx';
import Penitip from '../components/penjual/Penitip.jsx';
import SaleModal from '../components/penjual/SaleModal.jsx';
import EditModal from '../components/penjual/EditModal.jsx';
import InformationForm from '../components/penjual/InformationForm.jsx';

// Import custom hooks
import { useNotification } from '../hooks/useNotification.js';
import { usePenjualData } from '../hooks/usePenjualData.js';
import { useSaleModal } from '../hooks/useSaleModal.js';
import { useEditModal } from '../hooks/useEditModal.js';
import { useSaleHandlers } from '../hooks/useSaleHandlers.js';
import { usePagination } from '../hooks/usePagination.js';

const tabTitles = {
  dashboard: 'Ringkasan Dashboard',
  items: 'Katalog Barang',
  sales: 'Riwayat Penjualan',
  penitips: 'Daftar Mitra Penitip',
  information: 'Kirim Informasi ke Mitra'
};

export default function PenjualDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = React.useState('dashboard');

  // Custom hooks
  const { notification, showNotification } = useNotification();
  const { items, penitips, sales, income, loadData } = usePenjualData(user?.id);
  const { selectedItem, saleData, openSaleModal, closeSaleModal, setSaleData } = useSaleModal();
  const { editingSale, openEditModal, closeEditModal } = useEditModal();
  const { currentPage, totalPages, paginatedItems, handlePageChange, resetPage } = usePagination(sales);
  
  const { handleRecordSale, handleRestoreSale, handleDeleteItem, handleDeleteSale, handleResetAllSales } = useSaleHandlers({
    onLoadData: loadData,
    onShowNotification: showNotification
  });

  const handleRecordSaleWrapper = async (e) => {
    await handleRecordSale(selectedItem, saleData, e);
    closeSaleModal();
    resetPage();
  };

  const handleEditSaleWrapper = (sale) => {
    openEditModal(sale);
  };

  const handleRestoreSaleWrapper = async (saleId) => {
    await handleRestoreSale(saleId);
    closeEditModal();
    resetPage();
  };

  const handleDeleteItemWrapper = async (itemId) => {
    await handleDeleteItem(itemId);
    closeEditModal();
    resetPage();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          income={income}
          onResetAllSales={handleResetAllSales}
          penitips={penitips}
        />;
      case 'items':
        return <Katalog 
          items={items}
          onSelectItem={openSaleModal}
        />;
      case 'sales':
        return <Penjualan 
          sales={paginatedItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onEdit={handleEditSaleWrapper}
          onDelete={handleDeleteSale}
        />;
      case 'penitips':
        return <Penitip penitips={penitips} />;
      case 'information':
        return <InformationForm />;
      default:
        return null;
    }
  }

  return (
    <div className="d-flex flex-column vh-100">
      {notification && (
        <Alert variant={notification.type} className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
          {notification.message}
        </Alert>
      )}
      
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand href="#" className="fw-bold text-primary">warung budeh</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link disabled>Halo, {user?.name}!</Nav.Link>
              <Button variant="outline-secondary" size="sm" onClick={onLogout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="flex-grow-1">
        <Row className="h-100">
          <Col md={2} className="bg-white p-3 border-end">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
                  Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'items'} onClick={() => setActiveTab('items')}>
                  Katalog Barang
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'sales'} onClick={() => setActiveTab('sales')}>
                  Penjualan
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'penitips'} onClick={() => setActiveTab('penitips')}>
                  List Penitip
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'information'} onClick={() => setActiveTab('information')}>
                  Buat Informasi
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <main className="col-md-10 p-4" style={{ overflowY: 'auto' }}>
            <header className="pb-3 mb-4 border-bottom">
              <h2 className="h4">{tabTitles[activeTab]}</h2>
            </header>
            {renderContent()}
          </main>
        </Row>
      </Container>

      <SaleModal 
        selectedItem={selectedItem}
        saleData={saleData}
        onClose={closeSaleModal}
        onSubmit={handleRecordSaleWrapper}
        onDataChange={setSaleData}
      />

      <EditModal 
        editingSale={editingSale}
        onClose={closeEditModal}
        onRestoreSale={handleRestoreSaleWrapper}
        onDeleteItem={handleDeleteItemWrapper}
      />
    </div>
  );
};
