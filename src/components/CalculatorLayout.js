import React from 'react';
import { Box, Button, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { currencyOptions } from '../utils/currencyUtils';

const CalculatorLayout = ({ children, currency, onCurrencyChange, title }) => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Button 
          component={Link} 
          to="/" 
          variant="outlined"
          sx={{ mt: 1 }}  // 상단 여백 추가
        >
          메인 페이지로
        </Button>
        <FormControl 
          variant="outlined" 
          style={{ minWidth: 120 }}
          sx={{ mt: 1 }}  // 상단 여백 추가
        >
          <InputLabel 
            id="currency-select-label" 
            sx={{ 
              bgcolor: 'background.paper', 
              px: 1,
              mt: 1  // 라벨에도 상단 여백 추가
            }}
          >
            통화
          </InputLabel>
          <Select
            labelId="currency-select-label"
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            label="통화"
          >
            {currencyOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      {children}
    </Box>
  );
};

export default CalculatorLayout;