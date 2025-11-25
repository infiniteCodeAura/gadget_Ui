import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Logout, Home, Person } from "@mui/icons-material";

const DashboardNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Seller Dashboard
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button color="inherit" component={Link} to="/" startIcon={<Home />}>
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/profile" startIcon={<Person />}>
                        Profile
                    </Button>
                    <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default DashboardNavbar;
