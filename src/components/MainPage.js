import React from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, CardActions, Button, Link } from '@mui/material';
import { Calculator, TrendingUp, PieChart, Landmark } from 'lucide-react';

const tools = [
  { name: '연평균 수익률 계산기', icon: <TrendingUp />, link: '/cagr-calculator' },
  { name: '복리 계산기', icon: <PieChart />, link: '/compound-interest-calculator' },
  { name: '평단가 계산기', icon: <Calculator />, link: '/average-price-calculator' },
  { name: '대출 상환 계산기', icon: <Landmark />, link: '/loan-repayment-calculator' }
];

const MainPage = () => {
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">금융 계산기 by </Typography>
        </Toolbar>
        <Link 
            href="https://minicode.tistory.com" 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ 
              color: 'white', 
              textDecoration: 'none',
              paddingLeft: '16px',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            minicode.tistory.com
          </Link>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {tools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool.name}>
              <Card>
                <CardContent>
                  {tool.icon}
                  <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                    {tool.name}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" href={tool.link}>
                    사용하기
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default MainPage;