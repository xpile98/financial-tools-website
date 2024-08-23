import React, { useState } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CalculatorLayout from './CalculatorLayout';
import { formatCurrency, formatNumberWithCommas, parseFormattedNumber } from '../utils/currencyUtils';

const CAGRCalculator = () => {
  const [initialValue, setInitialValue] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);
  const [currency, setCurrency] = useState('KRW');
  const [chartData, setChartData] = useState([]);

  const handleAmountChange = (setter) => (event) => {
    const value = event.target.value;
    const numericValue = parseFormattedNumber(value);
    setter(formatNumberWithCommas(numericValue));
  };

  const calculateCAGR = () => {
    const initial = parseFloat(parseFormattedNumber(initialValue));
    const final = parseFloat(parseFormattedNumber(finalValue));
    const period = parseFloat(years);

    if (initial > 0 && final > 0 && period > 0) {
      const cagr = (Math.pow(final / initial, 1 / period) - 1) * 100;
      setResult(cagr.toFixed(2));

      // 그래프 데이터 생성
      const data = [];
      for (let i = 0; i <= period; i++) {
        const value = initial * Math.pow(1 + cagr / 100, i);
        data.push({
          year: i,
          value: Math.round(value),
        });
      }
      setChartData(data);
    }
  };

  return (
    <CalculatorLayout currency={currency} onCurrencyChange={setCurrency} title="연평균 수익률 계산기 (CAGR)">
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="초기 금액"
          value={initialValue}
          onChange={handleAmountChange(setInitialValue)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="최종 금액"
          value={finalValue}
          onChange={handleAmountChange(setFinalValue)}
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
        <Button variant="contained" onClick={calculateCAGR} sx={{ mt: 2 }}>
          계산하기
        </Button>
      </Box>
      {result !== null && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">결과:</Typography>
          <Typography>연평균 수익률 (CAGR): {result}%</Typography>
          <Typography>초기 금액: {formatCurrency(parseFormattedNumber(initialValue), currency)}</Typography>
          <Typography>최종 금액: {formatCurrency(parseFormattedNumber(finalValue), currency)}</Typography>
        </Box>
      )}
      {chartData.length > 0 && (
        <Box sx={{ mt: 4, height: 400 }}>
          <Typography variant="h6" gutterBottom>투자금 성장 추이</Typography>
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
              <XAxis dataKey="year" label={{ value: '년', position: 'insideBottomRight', offset: -5 }} />
              <YAxis tickFormatter={(value) => formatCurrency(value, currency)} width={100} />
              <Tooltip formatter={(value) => formatCurrency(value, currency)} />
              <Legend />
              <Line type="monotone" dataKey="value" name="투자금" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </CalculatorLayout>
  );
};

export default CAGRCalculator;