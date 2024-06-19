import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
          main: '#118AB2',
          contrastText: '#FFFFFF'
        },
        secondary: {
          main: '#FFD166',
          contrastText: '#FFFFFF'
        },
        error: {
            main: '#EF476F',
            contrastText: '#FFFFFF'
        },
        success: {
            main: '#A1DD70',
            contrastText: '#FFFFFF'
        }
      },
      typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
          fontSize: '2.5rem',
          fontWeight: 500,
        },
        h2: {
          fontSize: '2rem',
          fontWeight: 500,
        },
        body1: {
          fontSize: '1rem',
        },
        button: {
          fontSize: '1rem',
          fontWeight: 600,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '8px',
            },
          },
        },
      },
});
