import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import MainPage from './components/MainPage';
import CAGRCalculator from './components/CAGRCalculator';
import CompoundInterestCalculator from './components/CompoundInterestCalculator';
import AveragePriceCalculator from './components/AveragePriceCalculator';
import LoanRepaymentCalculator from './components/LoanRepaymentCalculator';
import EconomicCrisisTimeline from './components/EconomicCrisisTimeline';

function App() {
  return (
    <Router basename={"/"}>
      <Container>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/cagr-calculator" element={<CAGRCalculator />} />
          <Route path="/compound-interest-calculator" element={<CompoundInterestCalculator />} />
          <Route path="/average-price-calculator" element={<AveragePriceCalculator />} />
          <Route path="/loan-repayment-calculator" element={<LoanRepaymentCalculator />} />
          <Route path="/economic-crisis-timeline" element={<EconomicCrisisTimeline />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;