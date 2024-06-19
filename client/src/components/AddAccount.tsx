import React, { useState } from 'react';
import { Container, Typography, TextField, Button, ThemeProvider, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { theme } from './theme';
import { API_URL } from './constants';

const AddAccount: React.FC = () => {
  const [accountName, setAccountName] = useState('');
  const [accountAmount, setAccountAmount] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    axios.post(`${API_URL}api/accounts`, { accountName, accountAmount })
      .then(() => {
        navigate('/accounts');
      })
      .catch(error => {
        console.error('There was an error creating the account!', error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Add New Account
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  label="Account Name"
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
                  required
                  label="Account Amount"
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
                  Add Account
                </Button>
                <Button onClick={() => navigate('/accounts')} variant="outlined" color="error">
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default AddAccount;
