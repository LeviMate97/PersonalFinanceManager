import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, ThemeProvider, Paper, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { theme } from './theme';
import { API_URL } from './constants';

const EditAccount: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [accountName, setAccountName] = useState('');
  const [accountAmount, setAccountAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}api/accounts/${id}`)
      .then(response => {
        const account = response.data;
        setAccountName(account.accountName);
        setAccountAmount(account.accountAmount);
      })
      .catch(error => {
        console.error('There was an error fetching the account!', error);
      });
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    axios.put(`${API_URL}api/accounts/${id}`, { id: parseInt(id!), accountName, accountAmount })
      .then(() => {
        navigate('/accounts');
      })
      .catch(error => {
        console.error('There was an error updating the account!', error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Edit Account
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Amount"
                  type="number"
                  value={accountAmount}
                  onChange={(e) => setAccountAmount(e.target.value)}
                  fullWidth
                  margin="normal"
                  inputProps={{ min: "0" }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" color="primary" type="submit">
                  Save Changes
                </Button>
                <Button onClick={() => navigate(-1)} variant="outlined" color="error">
                  Back
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditAccount;
