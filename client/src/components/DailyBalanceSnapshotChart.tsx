import React, { useEffect, useState } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import axios from 'axios';
import { LineChart } from "@mui/x-charts/LineChart";
import { theme } from './theme';
import { API_URL } from './constants';

interface DailyBalanceSnapshot {
  id: number;
  snapshotDate: string;
  totalBalance: number;
}

const MonthlySpendingChart: React.FC = () => {
  const [chartData, setChartData] = useState<DailyBalanceSnapshot[]>([]);

  useEffect(() => {
    fetchDailyBalanceSnapshot();
  }, []);

  const fetchDailyBalanceSnapshot = () => {
    axios.get<DailyBalanceSnapshot[]>(`${API_URL}api/transactions/snapshot`)
      .then(response => {
        setChartData(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the transactions!", error);
      });
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const date: any[] = chartData.map((a) => formatDate(new Date(a.snapshotDate))).slice(-7);
  const balance: number[] = chartData.map((a) => a.totalBalance).slice(-7);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: 1 }}>
        <h2>Last 7 Days Balance Change</h2>
        <LineChart
          margin={{ left: 80 }}
          xAxis={[
            {
              scaleType: "band",
              data: date,
            },
          ]}
          series={[
            {
              color: balance.at(-1)! < 0 ? theme.palette.error.main : theme.palette.success.main,
              data: balance,
            },
          ]}
          height={300}
        />
      </Box>
    </ThemeProvider>
  );
};

export default MonthlySpendingChart;
