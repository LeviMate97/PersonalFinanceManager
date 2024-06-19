import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import CategoryIcon from '@mui/icons-material/Category';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useMediaQuery } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);


export default function MiniDrawer() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <Box sx={{ display: isAuthRoute ? 'none' : 'flex' }}>
            <CssBaseline />
            <Drawer variant="permanent" open={matches}>
                <Divider />
                <List>
                    <ListItem component={Link} to="/" disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                color: "black",
                                minHeight: 48,
                                justifyContent: matches ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: matches ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" sx={{ opacity: matches ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem component={Link} to="/transactions" disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                color: "black",
                                minHeight: 48,
                                justifyContent: matches ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: matches ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Transactions" sx={{ opacity: matches ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem component={Link} to="/manage-categories" disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                color: "black",
                                minHeight: 48,
                                justifyContent: matches ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: matches ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <CategoryIcon />
                            </ListItemIcon>
                            <ListItemText primary="Manage Categories" sx={{ opacity: matches ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem component={Link} to="/accounts" disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                color: "black",
                                minHeight: 48,
                                justifyContent: matches ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: matches ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <AccountBalanceIcon />
                            </ListItemIcon>
                            <ListItemText primary="Accounts" sx={{ opacity: matches ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem component={Link} to="/crypto" disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                color: "black",
                                minHeight: 48,
                                justifyContent: matches ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: matches ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <CurrencyBitcoinIcon />
                            </ListItemIcon>
                            <ListItemText primary="Crypto" sx={{ opacity: matches ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem component={Link} to="/game-prices" disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                color: "black",
                                minHeight: 48,
                                justifyContent: matches ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: matches ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <VideogameAssetIcon />
                            </ListItemIcon>
                            <ListItemText primary="Game Prices" sx={{ opacity: matches ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem component={Link} to="/chat-bot" disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                color: "black",
                                minHeight: 48,
                                justifyContent: matches ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: matches ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <ChatIcon />
                            </ListItemIcon>
                            <ListItemText primary="ChatGPT" sx={{ opacity: matches ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}
                <Divider />
                <List>
                    <ListItem component={Link} to="/user-dashboard" disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                color: "black",
                                minHeight: 48,
                                justifyContent: matches ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: matches ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Profile" sx={{ opacity: matches ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem onClick={logout} component={Link} to="/login" disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                color: "black",
                                minHeight: 48,
                                justifyContent: matches ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: matches ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" sx={{ opacity: matches ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    );
}
