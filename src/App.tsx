import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, LandingPage, ReporteConfigPage, ReportePresetConfig } from './components';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mobile-report" element={<ReporteConfigPage />} />
        <Route path="/preset-report" element={<ReportePresetConfig />} />
      </Routes>
    </Router>
  );
}

export default App;
