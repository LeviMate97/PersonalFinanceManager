import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import StatCard from './StatCard';
import axios from 'axios';
import MonthlySpendingChart from './MonthlySpendingChart';
import DailyBalanceSnapshotChart from './DailyBalanceSnapshotChart';
import { API_URL } from './constants';

const Dashboard: React.FC = () => {
  const [totalSpendMonth, setTotalSpendMonth] = useState(0);
  const [totalNetworth, setTotalNetworth] = useState(0);
  const [totalSpendYear, setTotalSpendYear] = useState(0);
  const [incomeMonth, setIncomeMonth] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: monthSpend } = await axios.get(`${API_URL}api/transactions/totalSpendMonth`);
      const { data: networth } = await axios.get(`${API_URL}api/accounts/totalNetworth`);
      const { data: yearSpend } = await axios.get(`${API_URL}api/transactions/totalSpendYear`);
      const { data: monthIncome } = await axios.get(`${API_URL}api/transactions/totalIncomeMonth`);

      setTotalSpendMonth(monthSpend);
      setTotalNetworth(networth);
      setTotalSpendYear(yearSpend);
      setIncomeMonth(monthIncome);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  };
  return (
    <Container sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6} xl={3}>
          <StatCard title="Income This Month" value={'$' + incomeMonth} />
        </Grid>
        <Grid item xs={12} lg={6} xl={3}>
          <StatCard title="Total Spend This Month" value={'$' + totalSpendMonth} />
        </Grid>
        <Grid item xs={12} lg={6} xl={3}>
          <StatCard title="Total Spend This Year" value={'$' + totalSpendYear} />
        </Grid>
        <Grid item xs={12} lg={6} xl={3}>
          <StatCard title="Total Networth" value={'$' + totalNetworth} />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <MonthlySpendingChart />
          <DailyBalanceSnapshotChart />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
