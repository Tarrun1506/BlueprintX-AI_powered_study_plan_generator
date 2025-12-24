import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
    Toolbar, Typography, Container, Box, Button, Paper,
    IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    // Navigation items
    const navItems = [
        ...(isAuthenticated ? [
            { label: 'Upload Syllabus', path: '/upload' },
            { label: 'My Library', path: '/history' },
        ] : []),
        ...(!isAuthenticated && !isAuthPage ? [{ label: 'About', path: '/about' }] : []),
    ];

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                BlueprintX
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton component={RouterLink} to={item.path} sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {!isAuthenticated && !isAuthPage && (
                    <ListItem disablePadding>
                        <ListItemButton component={RouterLink} to="/login" sx={{ textAlign: 'center' }}>
                            <ListItemText primary="Log In" />
                        </ListItemButton>
                    </ListItem>
                )}
                {isAuthPage && (
                    <ListItem disablePadding>
                        <ListItemButton component={RouterLink} to="/" sx={{ textAlign: 'center' }}>
                            <ListItemText primary="Back to Dashboard" />
                        </ListItemButton>
                    </ListItem>
                )}
                {isAuthenticated && (
                    <ListItem disablePadding>
                        <ListItemButton onClick={logout} sx={{ textAlign: 'center', color: 'error.main' }}>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Paper component="header" elevation={1} square sx={{ bgcolor: 'background.paper' }}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' }, color: 'text.primary' }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, mr: 2, display: { xs: 'none', sm: 'block' } }}>
                            <Button
                                component={RouterLink}
                                to="/"
                                color="primary"
                                sx={{ textTransform: 'none', fontSize: '1.25rem', fontWeight: 'bold' }}
                            >
                                BlueprintX
                            </Button>
                        </Typography>

                        <Typography
                            variant="h6"
                            component={RouterLink}
                            to="/"
                            sx={{
                                flexGrow: 1,
                                display: { xs: 'block', sm: 'none' },
                                textAlign: 'center',
                                color: 'primary.main',
                                fontWeight: 'bold',
                                textDecoration: 'none'
                            }}
                        >
                            BlueprintX
                        </Typography>

                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.label}
                                    component={RouterLink}
                                    to={item.path}
                                    sx={{ color: 'text.primary', mr: 1 }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                            {isAuthenticated ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={logout}
                                    startIcon={<LogoutIcon />}
                                    sx={{ ml: 1, borderRadius: 2 }}
                                >
                                    Logout
                                </Button>
                            ) : isAuthPage ? (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    component={RouterLink}
                                    to="/"
                                    sx={{ ml: 1, borderRadius: 2 }}
                                >
                                    Back to Dashboard
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component={RouterLink}
                                    to="/login"
                                    startIcon={<LoginIcon />}
                                    sx={{ ml: 1, borderRadius: 2 }}
                                >
                                    Log In
                                </Button>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </Paper>

            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, py: 4, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    {children}
                </Container>
            </Box>

            <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3, mt: 'auto' }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} BlueprintX - Your AI Study Partner
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Layout;
