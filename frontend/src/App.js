import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminPage';

// Import CSS files
import './styles/App.css';
import './styles/Header.css';
import './styles/Footer.css';
import './styles/LandingPage.css';
import './styles/AdminPage.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AdminLogin />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;