import React from 'react';
import { Navbar, Nav, Container, Row, Col, Alert, Button } from 'react-bootstrap';
import '../styles.css';

// Import components
import PenitipDashboardComponent from '../components/penitip/Dashboard.jsx';
import Items from '../components/penitip/Items.jsx';
import PenitipSales from '../components/penitip/Sales.jsx';
import AddItemModal from '../components/penitip/AddItemModal.jsx';
import SoldItemsSummary from '../components/penitip/SoldItemsSummary.jsx';
import SoldItemsStatistics from '../components/penitip/SoldItemsStatistics.jsx';
import SoldItemsDetail from '../components/penitip/SoldItemsDetail.jsx';

// Import custom hooks
import { useNotification } from '../hooks/useNotification.js';
import { usePenitipData } from '../hooks/usePenitipData.js';
import { useAddItemModal } from '../hooks/useAddItemModal.js';
import { usePenitipHandlers } from '../hooks/usePenitipHandlers.js';
import { useSoldItemsData } from '../hooks/useSoldItemsData.js';
import { informationService } from '../services/api.js';

const tabTitles = {
  dashboard: 'Ringkasan Dashboard',
  items: 'Barang Saya',
  sales: 'Riwayat Penjualan',
  'sold-items': 'Laporan Barang Terjual'
};

export default function PenitipDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [information, setInformation] = React.useState([]);

  // Custom hooks
  const { notification, showNotification } = useNotification();
  const { items, sales, soldItems, income, loadData } = usePenitipData(user?.id);
  const { showModal, formData, openModal, closeModal, updateFormData } = useAddItemModal();
  const { handleAddItem } = usePenitipHandlers({
    onLoadData: loadData,
    onShowNotification: showNotification
  });
  const {
    soldItemsDetail,
    soldItemsStats,
    currentPage,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    loadSoldItemsDetail,
    loadSoldItemsStats
  } = useSoldItemsData();

  React.useEffect(() => {
    const fetchInformation = async () => {
      try {
        const res = await informationService.getInformation();
        setInformation(res.data.information);
      } catch (error) {
        console.error('Error fetching information:', error);
      }
    };
    fetchInformation();
  }, []);

  const handleAddItemWrapper = async (e) => {
    e.preventDefault();
    const success = await handleAddItem(formData, e);
    if (success) {
      closeModal();
    }
  };

  const handleLoadStats = async () => {
    await loadSoldItemsStats(selectedYear, selectedMonth);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <PenitipDashboardComponent
          income={income}
          information={information}
        />;
      case 'items':
        return <Items
          items={items}
          onOpenModal={openModal}
        />;
      case 'sales':
        return <PenitipSales
          sales={sales}
        />;
      case 'sold-items':
        return (
          <div>
            <SoldItemsSummary
              soldItems={soldItems}
              onLoadDetail={loadSoldItemsDetail}
            />
            <SoldItemsStatistics
              soldItemsStats={soldItemsStats}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
              onLoadStats={handleLoadStats}
            />
            <SoldItemsDetail
              soldItemsDetail={soldItemsDetail}
              currentPage={currentPage}
              onPageChange={loadSoldItemsDetail}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="d-flex flex-column vh-100">
      {notification && (
        <Alert variant={notification.type} className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
          {notification.message}
        </Alert>
      )}
      
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand href="#" className="fw-bold text-success">lapak budeh</Navbar.Brand>
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
                  Barang Saya
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'sales'} onClick={() => setActiveTab('sales')}>
                  Penjualan
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'sold-items'} onClick={() => setActiveTab('sold-items')}>
                  Laporan
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col md={10} className="p-4" style={{ overflowY: 'auto' }}>
            <header className="pb-3 mb-4 border-bottom">
              <h2 className="h4">{tabTitles[activeTab]}</h2>
            </header>
            {renderContent()}
          </Col>
        </Row>
      </Container>

      {showModal && (
        <AddItemModal
          showModal={showModal}
          formData={formData}
          onClose={closeModal}
          onSubmit={handleAddItemWrapper}
          onFieldChange={(field, value) => updateFormData(field, value)}
        />
      )}
    </div>
  );
};