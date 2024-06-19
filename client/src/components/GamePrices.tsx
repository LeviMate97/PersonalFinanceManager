import React, { useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Box } from '@mui/material';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { API_URL } from './constants';

interface CexGame {
  name: string;
  platform: string;
  imageUrl: string;
  price: string;
}

const GamePrices: React.FC = () => {
  const [games, setGames] = useState<CexGame[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);

  const findGame = (searchValue: string = '') => {
    setLoading(true);
    axios.get<CexGame[]>(`${API_URL}api/CexGame/scrape/?searchValue=${searchValue}`)
      .then(response => {
        setGames(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the results!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = () => {
    setSearchAttempted(true);
    findGame(searchValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Cex Games
        </Typography>
        <Typography mb={2}>
        Web scrapes product details from the Dutch CeX website, known for selling used video games and other items. (Try for example: "Need for Speed")
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              marginBottom: '16px',
              marginRight: '8px',
              width: '300px',
            }}
          />
          <Button
            sx={{ height: '56px', marginBottom: '16px' }}
            variant="contained"
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <ClipLoader size={150} color={theme.palette.primary.main} loading={loading} />
          </Box>
        ) : (
          <>
            {searchAttempted && games.length === 0 ? (
              <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
                Product not found
              </Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Platform</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {games.map((game) => (
                    <TableRow key={game.name}>
                      <TableCell>
                        <Box
                          component="img"
                          src={game.imageUrl}
                          alt={game.name}
                          sx={{
                            width: '200px',
                            height: '100%',
                            borderRadius: '8px',
                          }}
                        />
                      </TableCell>
                      <TableCell>{game.name}</TableCell>
                      <TableCell>{game.platform}</TableCell>
                      <TableCell>{game.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default GamePrices;
