import React, { useEffect, useState } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import { theme } from './theme';
import { API_URL } from './constants';

interface Transaction {
  id: number;
  date: string;
  place: string;
  note: string;
  category: string;
  amount: number;
  positive: number;
}

const MonthlySpendingChart: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchMonthlySpending();
  }, []);

  const fetchMonthlySpending = () => {
    axios.get(`${API_URL}api/transactions/currentMonthDaily`)
      .then(response => {
        processChartData(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the transactions!", error);
      });
  };

  const processChartData = (transactions: Transaction[]) => {
    const dates = transactions.map(t => new Date(t.date).toLocaleDateString());
    const uniqueDates = Array.from(new Set(dates)).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const dailySpending = uniqueDates.map(date => {
      const dailyTransactions = transactions.filter(t => new Date(t.date).toLocaleDateString() === date);
      const dailyTotalPositive = dailyTransactions
        .filter(t => t.positive === 1)
        .reduce((total, t) => total + t.amount, 0);
      const dailyTotalNegative = dailyTransactions
        .filter(t => t.positive === 0)
        .reduce((total, t) => total + t.amount, 0);

      return {
        date,
        income: dailyTotalPositive,
        expense: dailyTotalNegative,
      };
    });

    setChartData(dailySpending);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: 1 }}>
        <h2>Current Month's Daily Transactions</h2>
        <BarChart
          margin={{ left: 80 }}
          dataset={chartData}
          xAxis={[{ scaleType: 'band', dataKey: 'date' }]}
          series={[
            { dataKey: 'income', label: 'Income', valueFormatter: value => `$${value?.toFixed(2)}`, color: theme.palette.success.main },
            { dataKey: 'expense', label: 'Expense', valueFormatter: value => `$${value?.toFixed(2)}`, color: theme.palette.error.main },
          ]}
          height={300}
        />
      </Box>
    </ThemeProvider>
  );
};

export default MonthlySpendingChart;
