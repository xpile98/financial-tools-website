import React, { useState } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CalculatorLayout from './CalculatorLayout';
import { formatCurrency, formatNumberWithCommas, parseFormattedNumber } from '../utils/currencyUtils';

const CompoundInterestCalculator = () => {
  const [initialAmount, setInitialAmount] = useState('');
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [currency, setCurrency] = useState('KRW');

  const handleAmountChange = (setter) => (event) => {
    const value = event.target.value;
    const numericValue = parseFormattedNumber(value);
    setter(formatNumberWithCommas(numericValue));
  };

  const calculateCompoundInterest = () => {
    const principal = parseFloat(parseFormattedNumber(initialAmount));
    const monthly = parseFloat(parseFormattedNumber(monthlyDeposit));
    const rate = parseFloat(annualRate) / 100 / 12;
    const periods = parseFloat(years) * 12;

    if (principal >= 0 && monthly >= 0 && rate > 0 && periods > 0) {
      let data = [];
      let totalAmount = principal;
      let totalDeposit = principal;

      for (let i = 0; i <= periods; i++) {
        if (i % 12 === 0) {
          data.push({
            year: i / 12,
            amount: totalAmount,
            deposit: totalDeposit
          });
        }
        totalAmount = totalAmount * (1 + rate) + monthly;
        totalDeposit += monthly;
      }

      const finalAmount = totalAmount;
      const interestEarned = finalAmount - totalDeposit;

      setResult({
        finalAmount: finalAmount,
        totalDeposit: totalDeposit,
        interestEarned: interestEarned,
      });

      setChartData(data);
    }
  };

  return (
    <CalculatorLayout currency={currency} onCurrencyChange={setCurrency} title="복리 계산기">
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="초기 금액"
          value={initialAmount}
          onChange={handleAmountChange(setInitialAmount)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="매월 적립 금액"
          value={monthlyDeposit}
          onChange={handleAmountChange(setMonthlyDeposit)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="연이율 (%)"
          type="number"
          value={annualRate}
          onChange={(e) => setAnnualRate(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="기간 (년)"
          type="number"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={calculateCompoundInterest} sx={{ mt: 2 }}>
          계산하기
        </Button>
      </Box>
      {result && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">결과:</Typography>
          <Typography>최종 금액: {formatCurrency(result.finalAmount, currency)}</Typography>
          <Typography>총 적립액: {formatCurrency(result.totalDeposit, currency)}</Typography>
          <Typography>이자 수익: {formatCurrency(result.interestEarned, currency)}</Typography>
        </Box>
      )}
      {chartData.length > 0 && (
        <Box sx={{ mt: 4, height: 400 }}>
          <Typography variant="h6" gutterBottom>연도별 금액 추이</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => formatCurrency(value, currency)} width={100} />
              <Tooltip formatter={(value) => formatCurrency(value, currency)} />
              <Legend />
              <Line type="monotone" dataKey="amount" name="총 금액" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="deposit" name="총 적립액" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </CalculatorLayout>
  );
};

export default CompoundInterestCalculator;