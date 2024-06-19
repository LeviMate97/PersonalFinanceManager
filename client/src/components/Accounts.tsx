import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, ThemeProvider } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { theme } from './theme';
import { API_URL } from './constants';

interface Account {
  id: number;
  accountName: string;
  accountAmount: string;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const createSnapshot = () => {
    axios.post(`${API_URL}api/transactions/snapshot`,)
      .catch(error => {
        console.error('There was an error adding the transaction!', error);
      });
  };

  const fetchTransactions = () => {
    axios.get<Account[]>(`${API_URL}api/accounts`)
      .then(response => {
        setAccounts(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the transactions!", error);
      });
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      axios.delete(`${API_URL}api/accounts/${deleteId}`)
        .then(() => {
          fetchTransactions();
          setOpen(false);
          setDeleteId(null);
        })
        .catch(error => {
          console.error("There was an error deleting the account!", error);
        });
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-account/${id}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Accounts
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          component={Link}
          to="/add-account"
          sx={{
            mb: 2,
          }}
        >
          Add New Accounts
        </Button>
        <Table>
          <TableHead>
            <TableRow
            >
              <TableCell sx={{
                fontWeight: 'bold'
              }}>Account Name</TableCell>
              <TableCell sx={{
                fontWeight: 'bold'
              }}>Account Amount</TableCell>
              <TableCell sx={{
                fontWeight: 'bold'
              }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.accountName}</TableCell>
                <TableCell>${account.accountAmount}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(account.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color='error'
                    onClick={() => handleDeleteClick(account.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => createSnapshot()}
          sx={{
            mt: 2,
            mb: 2,
          }}
        >
          Take Balance Snapshot
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color='error' autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default Accounts;
