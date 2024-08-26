import React, { useState, useEffect } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter } from 'recharts';
import Papa from 'papaparse';

const eventsData = [
  { 
    date: "1929-10-29", 
    title: "Black Tuesday", 
    description: "The stock market crash of 1929 marked the beginning of the Great Depression.",
  },
  {
    date: "1973-10-19",
    title: "1973 Oil Crisis",
    description: "The 1973 oil crisis caused a severe economic shock and led to widespread inflation.",
  },
  {
    date: "1987-10-19",
    title: "1987 Black Monday",
    description: "The stock market crash of 1987, known as Black Monday, saw the largest one-day percentage decline in stock market history.",
  },
  {
    date: "2000-03-10",
    title: "Dot-com Bubble Burst",
    description: "The bursting of the dot-com bubble led to a massive loss in market value for tech companies.",
  },
  {
    date: "2008-09-15",
    title: "2008 Financial Crisis",
    description: "The collapse of Lehman Brothers triggered the worst global financial crisis since the Great Depression.",
  },
  {
    date: "2020-03-11",
    title: "COVID-19 Pandemic",
    description: "The COVID-19 pandemic led to a rapid and severe downturn in global financial markets.",
  },
];

const normalizeData = (data) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return data.map(value => (value - min) / (max - min));
};

const EconomicCrisisTimeline = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const loadData = async () => {
        const file = process.env.PUBLIC_URL + '/data/Combined_Data.csv';
      
        const parseCSV = (file) => new Promise((resolve, reject) => {
          Papa.parse(file, {
            download: true,
            header: true,
            dynamicTyping: true, // Automatically convert numbers and dates
            complete: resolve,
            error: reject
          });
        });
      
        try {
          const result = await parseCSV(file);
          const data = result.data;
      
          // Log the data to inspect its structure
          console.log('Parsed Data:', data);
      
          // Normalize the data if necessary
          const normalizedData = data.map(row => {
            const normalizedRow = { date: row.Date };
            Object.keys(row).forEach(key => {
              if (key !== 'Date') {
                const value = parseFloat(row[key]);
                if (!isNaN(value)) {
                  normalizedRow[key] = value; // Apply normalization logic if needed
                }
              }
            });
            return normalizedRow;
          });
      
          setChartData(normalizedData);
        } catch (error) {
          console.error('Error parsing CSV:', error);
        }
      };

    loadData();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Economic Crisis Timeline
      </Typography>
      <Box sx={{ mt: 4, height: 500 }}>
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
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="^spx_d" name="S&P 500" stroke="#8884d8" />
            <Line type="monotone" dataKey="^hsi_d" name="Hang Seng Index" stroke="#82ca9d" />
            <Line type="monotone" dataKey="^shc_d" name="Shanghai Composite" stroke="#ffc658" />
            <Line type="monotone" dataKey="^nkx_d" name="Nikkei 225" stroke="#d88484" />
            <Line type="monotone" dataKey="^dji_d" name="Dow Jones Industrial Average" stroke="#8dd1e1" />
            <Line type="monotone" dataKey="^ndq_d" name="NASDAQ" stroke="#a4de6c" />
            <Scatter data={eventsData.map(event => ({ date: event.date, title: event.title }))} fill="red" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ marginTop: '20px' }}>
        {eventsData.map((event, index) => (
          <Button 
            key={index} 
            variant="outlined" 
            sx={{ marginRight: '10px', marginBottom: '10px' }}
            onClick={() => handleEventClick(event)}
          >
            {event.title}
          </Button>
        ))}
      </Box>
      {selectedEvent && (
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h6">{selectedEvent.title}</Typography>
          <Typography>{selectedEvent.description}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default EconomicCrisisTimeline;
