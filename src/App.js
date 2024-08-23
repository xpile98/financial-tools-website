import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import MainPage from './components/MainPage';
import CAGRCalculator from './components/CAGRCalculator';
import CompoundInterestCalculator from './components/CompoundInterestCalculator';
import AveragePriceCalculator from './components/AveragePriceCalculator';
import LoanRepaymentCalculator from './components/LoanRepaymentCalculator';

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/cagr-calculator" element={<CAGRCalculator />} />
          <Route path="/compound-interest-calculator" element={<CompoundInterestCalculator />} />
          <Route path="/average-price-calculator" element={<AveragePriceCalculator />} />
          <Route path="/loan-repayment-calculator" element={<LoanRepaymentCalculator />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;