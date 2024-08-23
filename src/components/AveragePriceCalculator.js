import React, { useState } from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CalculatorLayout from './CalculatorLayout';
import { formatCurrency, formatNumberWithCommas, parseFormattedNumber } from '../utils/currencyUtils';

const AveragePriceCalculator = () => {
  const [currentAvgPrice, setCurrentAvgPrice] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [targetAvgPrice, setTargetAvgPrice] = useState('');
  const [result, setResult] = useState(null);
  const [currency, setCurrency] = useState('KRW');
  const [chartData, setChartData] = useState([]);

  const handleAmountChange = (setter) => (event) => {
    const value = event.target.value;
    const numericValue = parseFormattedNumber(value);
    setter(formatNumberWithCommas(numericValue));
  };

  const calculateAveragePrice = () => {
    const avgPrice = parseFloat(parseFormattedNumber(currentAvgPrice));
    const quantity = parseFloat(parseFormattedNumber(currentQuantity));
    const price = parseFloat(parseFormattedNumber(currentPrice));
    const targetAvg = parseFloat(parseFormattedNumber(targetAvgPrice));

    if (avgPrice > 0 && quantity > 0 && price > 0 && targetAvg > 0 && targetAvg < avgPrice) {
      const additionalQuantity = (quantity * (avgPrice - targetAvg)) / (targetAvg - price);
      const additionalCost = Math.ceil(additionalQuantity) * price;

      setResult({
        additionalQuantity: Math.ceil(additionalQuantity),
        additionalCost: additionalCost,
      });

      setChartData([
        { name: '현재 평균 단가', value: avgPrice },
        { name: '목표 평균 단가', value: targetAvg },
        { name: '현재 주식 수량', value: quantity },
        { name: '필요 추가 수량', value: Math.ceil(additionalQuantity) },
      ]);
    } else {
      alert('입력값을 확인해주세요. 목표 평단가는 현재 평단가보다 작아야 합니다.');
    }
  };

  return (
    <CalculatorLayout currency={currency} onCurrencyChange={setCurrency} title="평단가 계산기">
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="현재 평단가"
          value={currentAvgPrice}
          onChange={handleAmountChange(setCurrentAvgPrice)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="현재 수량"
          value={currentQuantity}
          onChange={handleAmountChange(setCurrentQuantity)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="현재 주가"
          value={currentPrice}
          onChange={handleAmountChange(setCurrentPrice)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="목표 평단가"
          value={targetAvgPrice}
          onChange={handleAmountChange(setTargetAvgPrice)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={calculateAveragePrice} sx={{ mt: 2 }}>
          계산하기
        </Button>
      </Box>
      {result && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">결과:</Typography>
          <Typography>필요 수량: {formatNumberWithCommas(result.additionalQuantity)}주</Typography>
          <Typography>필요 금액: {formatCurrency(result.additionalCost, currency)}</Typography>
        </Box>
      )}
      {chartData.length > 0 && (
        <Box sx={{ mt: 4, height: 400 }}>
          <Typography variant="h6" gutterBottom>평단가 및 수량 비교</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatNumberWithCommas(value)} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </CalculatorLayout>
  );
};

export default AveragePriceCalculator;