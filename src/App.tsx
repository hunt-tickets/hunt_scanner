import { Routes, Route, useNavigate } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import ScanPage from './pages/ScanPage';
import ResultPage from './pages/ResultPage';
import { useState } from 'react';
import { ApiResponse } from './services/apiService';

function App() {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<ApiResponse | null>(null);
  
  const handleScanComplete = (result: ApiResponse) => {
    setScanResult(result);
    navigate('/result');
  };
  
  const handleScanAgain = () => {
    navigate('/scan');
  };
  
  const handleStartScan = () => {
    navigate('/scan');
  };
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#D9D9D9]">
      <Routes>
        <Route path="/" element={<IndexPage onStartScan={handleStartScan} />} />
        <Route path="/scan" element={<ScanPage onScanComplete={handleScanComplete} />} />
        <Route path="/result" element={<ResultPage result={scanResult} onScanAgain={handleScanAgain} />} />
      </Routes>
    </div>
  );
}

export default App;