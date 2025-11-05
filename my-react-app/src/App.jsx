import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ReportPage from './pages/ReportPage';
import FormPage from './pages/FormPage';
import LoginPage from './pages/LoginPage';
import AnalyticsPage from './pages/AnalyticsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/report" element={<ReportPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ReportPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
