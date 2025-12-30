import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PenitipDashboard from './pages/PenitipDashboard.jsx';
import PenjualDashboard from './pages/PenjualDashboard.jsx';
import { PollIntervalProvider } from './hooks/usePollInterval';

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <PollIntervalProvider interval={5000}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <RegisterPage onLogin={handleLogin} />}
          />
          <Route
            path="/"
            element={
              user ? (
                user.role === 'penitip' ? (
                  <PenitipDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <PenjualDashboard user={user} onLogout={handleLogout} />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </PollIntervalProvider>
  );
}

export default App;
