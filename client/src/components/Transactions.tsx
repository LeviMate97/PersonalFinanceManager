import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider, useMediaQuery, TextField } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { theme } from './theme';
import { API_URL } from './constants';

interface Transaction {
  id: number;
  date: string;
  note: string;
  place: string;
  category: string;
  amount: number;
  positive: number;
  account: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'asc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  id: keyof Transaction;
  label: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'date',
    label: 'Date',
  },
  {
    id: 'place',
    label: 'Place',
  },
  {
    id: 'note',
    label: 'Note',
  },
  {
    id: 'category',
    label: 'Category',
  },
  {
    id: 'amount',
    label: 'Amount',
  },
  {
    id: 'account',
    label: 'Account',
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Transaction) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Transaction) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };







  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            sx={{
              fontWeight: 'bold'
            }}
            key={headCell.id}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          padding={'normal'}
          sx={{
            fontWeight: 'bold'
          }}>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Transaction>('date');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    axios.get<Transaction[]>(`${API_URL}api/transactions`)
      .then(response => {
        setTransactions(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the transactions!", error);
      });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.account.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredTransactions, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [filteredTransactions, order, orderBy, page, rowsPerPage],
  );

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Transaction,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredTransactions.length) : 0;

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      axios.delete(`${API_URL}api/transactions/${deleteId}`)
        .then(() => {
          fetchTransactions();
          setOpen(false);
          setDeleteId(null);
        })
        .catch(error => {
          console.error("There was an error deleting the transaction!", error);
        });
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-transaction/${id}`);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Transactions
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-start', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/add-transaction/income"
            color='success'
            fullWidth={isSmallScreen}
          >
            Add Income
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<AddIcon />}
            component={Link}
            to="/add-transaction/expense"
            fullWidth={isSmallScreen}
          >
            Add Expense
          </Button>
        </Box>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search transactions"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
        />
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <TableContainer>
              <Table
                sx={{ minWidth: 800, tableLayout: 'fixed' }}
                aria-labelledby="tableTitle"
                size={isSmallScreen ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {visibleRows.map((row, index) => {
                    return (
                      <TableRow
                        key={row.id}
                        hover
                      >
                        <TableCell>{formatDate(row.date)}</TableCell>
                        <TableCell>{row.place}</TableCell>
                        <TableCell>{row.note}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.positive === 0 ? '- $' + row.amount : '+ $' + row.amount}</TableCell>
                        <TableCell>{row.account}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleEdit(row.id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color='error' onClick={() => handleDeleteClick(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (73) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTransactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this transaction?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm}
              color='error'
              autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default Transactions;
