import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, MenuItem, ThemeProvider, Paper, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { theme } from './theme';
import { API_URL } from './constants';

interface Category {
  id: number;
  name: string;
}

interface Account {
  id: number;
  accountName: string;
  accountAmount: number;
}

const EditTransaction: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}api/transactions/${id}`)
      .then(response => {
        const transaction = response.data;
        setDate(formatDate(transaction.date));
        setPlace(transaction.place);
        setNote(transaction.note);
        setCategory(transaction.category);
        setAmount(transaction.amount);
        setAccount(transaction.account);
      })
      .catch(error => {
        console.error('There was an error fetching the transaction!', error);
      });
    fetchAccounts();
    fetchCategories();
  }, [id]);

  const fetchCategories = () => {
    axios.get<Category[]>(`${API_URL}api/categories`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
      });
  };

  const fetchAccounts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}api/accounts`);
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts', error);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    axios.put(`${API_URL}api/transactions/${id}`, { id: parseInt(id!), date, place, note, category, account, amount: parseFloat(amount) })
      .then(() => {
        navigate('/transactions');
      })
      .catch(error => {
        console.error('There was an error updating the transaction!', error);
      });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Edit Transaction
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: getTodayDate() }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Place"
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  select
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  fullWidth
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth
                  inputProps={{ min: "0" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  select
                  label="Account"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  fullWidth
                >
                  {accounts.map((acc) => (
                    <MenuItem key={acc.id} value={acc.accountName}>
                      {acc.accountName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" color="success" type="submit">
                  Save Changes
                </Button>
                <Button onClick={() => navigate(-1)} variant="contained" color="error">
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

export default EditTransaction;
