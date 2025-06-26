import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ReporteConfigPage from './components/ReporteConfigPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/configurar-reporte" element={<ReporteConfigPage />} />
      </Routes>
    </Router>
  );
}

export default App;
