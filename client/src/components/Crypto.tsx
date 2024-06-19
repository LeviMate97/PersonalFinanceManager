import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Avatar,
} from '@mui/material';
import { styled, ThemeProvider } from '@mui/system';
import { theme } from './theme';

interface CryptoData {
  id: string;
  image: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  low_24h: number;
  high_24h: number;
  market_cap_rank: number;
}

const headCells = [
  { id: 'market_cap_rank', label: 'Rank', numeric: true, width: '10%' },
  { id: 'image', label: '', numeric: false, width: '5%' },
  { id: 'name', label: 'Coin', numeric: false, width: '20%' },
  { id: 'current_price', label: 'Price (USD)', numeric: true, width: '15%' },
  { id: 'price_change_percentage_24h', label: '24h % Change', numeric: true, width: '15%' },
  { id: 'low_24h', label: 'Low 24h', numeric: true, width: '15%' },
  { id: 'high_24h', label: 'High 24h', numeric: true, width: '15%' },
];

const AnimatedTableCell = styled(TableCell)({
  transition: 'background-color 0.5s ease, color 0.5s ease',
});

const CustomPaper = styled(Paper)({
  padding: '16px',
  borderRadius: '12px',
  boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
});

const CryptoPrice: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&page=1&sparkline=false');
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        const data: CryptoData[] = await response.json();
        setCryptoData(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching cryptocurrency data');
        setLoading(false);
      }
    };

    fetchCryptoData();
    const intervalId = setInterval(fetchCryptoData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedCryptoData = [...cryptoData].sort((a, b) => a.market_cap_rank - b.market_cap_rank);

  const visibleRows = sortedCryptoData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cryptoData.length) : 0;

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Cryptocurrency Prices
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          ) : (
            <CustomPaper sx={{ width: '100%' }}>
              <TableContainer>
                <Table sx={{ minWidth: 800 }} aria-labelledby="tableTitle" size={'medium'}>
                  <TableHead>
                    <TableRow>
                      {headCells.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          align={headCell.numeric ? 'right' : 'left'}
                          sx={{ fontWeight: 'bold', width: headCell.width }}
                        >
                          {headCell.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visibleRows.map((coin) => (
                      <TableRow key={coin.id} hover>
                        <AnimatedTableCell align="right">{coin.market_cap_rank}</AnimatedTableCell>
                        <AnimatedTableCell component="th" scope="row">
                          <Avatar alt={coin.name} src={coin.image} sx={{ width: 28, height: 28 }} />
                        </AnimatedTableCell>
                        <AnimatedTableCell align="left">{coin.name}</AnimatedTableCell>
                        <AnimatedTableCell align="right">${coin.current_price.toLocaleString()}</AnimatedTableCell>
                        <AnimatedTableCell align="right" style={{ color: coin.price_change_percentage_24h >= 0 ? theme.palette.success.main : theme.palette.error.main }}>
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </AnimatedTableCell>
                        <AnimatedTableCell align="right">${coin.low_24h.toLocaleString()}</AnimatedTableCell>
                        <AnimatedTableCell align="right">${coin.high_24h.toLocaleString()}</AnimatedTableCell>
                      </TableRow>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: (73) * emptyRows }}>
                        <TableCell colSpan={8} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={cryptoData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </CustomPaper>
          )}
        </Box>
        <Typography>Prices are delayed due to the limitations of the free tier API.</Typography>
      </Container>
    </ThemeProvider>
  );
};

export default CryptoPrice;
