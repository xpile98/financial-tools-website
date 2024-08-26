import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CalculatorLayout from './CalculatorLayout';
import { formatCurrency, formatNumberWithCommas, parseFormattedNumber } from '../utils/currencyUtils';

const LoanRepaymentCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [repaymentType, setRepaymentType] = useState('annuity');
  const [currency, setCurrency] = useState('KRW');
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  const handleAmountChange = (setter) => (event) => {
    const value = event.target.value;
    const numericValue = parseFormattedNumber(value);
    setter(formatNumberWithCommas(numericValue));
  };

  const calculateRepayment = () => {
    const principal = parseFloat(parseFormattedNumber(loanAmount));
    const rate = parseFloat(interestRate) / 100 / 12;
    const term = parseFloat(loanTerm) * 12;

    if (principal > 0 && rate > 0 && term > 0) {
      let monthlyPayment, totalInterest, totalPayment;
      const data = [];

      if (repaymentType === 'annuity') {
        // 원리금 균등상환
        monthlyPayment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
        totalPayment = monthlyPayment * term;
        totalInterest = totalPayment - principal;

        let remainingBalance = principal;
        for (let i = 0; i <= term; i++) {
          const interestPayment = remainingBalance * rate;
          const principalPayment = monthlyPayment - interestPayment;
          remainingBalance -= principalPayment;

          data.push({
            month: i,
            remainingBalance: Math.max(0, remainingBalance),
            totalPaid: i * monthlyPayment,
          });
        }
      } else {
        // 원금 균등상환
        const monthlyPrincipal = principal / term;
        totalPayment = 0;
        totalInterest = 0;
      
        let remainingBalance = principal;
        for (let i = 0; i <= term; i++) {
          const interestPayment = remainingBalance * rate;
          const payment = i === 0 ? 0 : monthlyPrincipal + interestPayment; // 첫 달은 상환이 없으므로 0 처리
          totalPayment += payment;
          totalInterest += interestPayment;
          remainingBalance -= i === 0 ? 0 : monthlyPrincipal; // 첫 달에는 원금 감소 없음
      
          data.push({
            month: i,
            remainingBalance: Math.max(0, remainingBalance),
            totalPaid: totalPayment, // 수정된 부분: 총 상환액 누적
          });
        }
        monthlyPayment = totalPayment / term;
      }

      setResult({
        monthlyPayment: monthlyPayment,
        totalInterest: totalInterest,
        totalPayment: totalPayment,
      });
      setChartData(data);
    }
  };

  return (
    <CalculatorLayout currency={currency} onCurrencyChange={setCurrency} title="대출 상환 계산기">
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="대출 금액"
          value={loanAmount}
          onChange={handleAmountChange(setLoanAmount)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="연이자율 (%)"
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="대출 기간 (년)"
          type="number"
          value={loanTerm}
          onChange={(e) => setLoanTerm(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">상환 방식</FormLabel>
          <RadioGroup
            row
            value={repaymentType}
            onChange={(e) => setRepaymentType(e.target.value)}
          >
            <FormControlLabel value="annuity" control={<Radio />} label="원리금 균등상환" />
            <FormControlLabel value="fixed-principal" control={<Radio />} label="원금 균등상환" />
          </RadioGroup>
        </FormControl>
        <br></br>
        <Button variant="contained" onClick={calculateRepayment} sx={{ mt: 2 }}>
          계산하기
        </Button>
      </Box>
      {result && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">결과:</Typography>
          <Typography>월 상환금: {formatCurrency(result.monthlyPayment, currency)}</Typography>
          <Typography>총 이자: {formatCurrency(result.totalInterest, currency)}</Typography>
          <Typography>총 상환금액: {formatCurrency(result.totalPayment, currency)}</Typography>
        </Box>
      )}
      {chartData.length > 0 && (
        <Box sx={{ mt: 4, height: 400 }}>
          <Typography variant="h6" gutterBottom>상환 계획</Typography>
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
              <XAxis dataKey="month" label={{ value: '개월', position: 'insideBottomRight', offset: -5 }} />
              <YAxis tickFormatter={(value) => formatCurrency(value, currency)} width={100} />
              <Tooltip formatter={(value) => formatCurrency(value, currency)} />
              <Legend />
              <Line type="monotone" dataKey="remainingBalance" name="잔액" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="totalPaid" name="총 상환액" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </CalculatorLayout>
  );
};

export default LoanRepaymentCalculator;