import './App.css'
import Footer from './components/Footer.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage.jsx'
import HomePage from './components/HomePage.jsx'  

function App() {
  return (
    // This <Router> tag MUST wrap everything else
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App
