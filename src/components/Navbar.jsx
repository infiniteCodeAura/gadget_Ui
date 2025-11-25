"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme as useMUITheme,
  Switch,
  FormControlLabel,
} from "@mui/material"
import {
  Menu as MenuIcon,
  ShoppingCart,
  Person,
  Home,
  Inventory,
  ContactMail,
  Login,
  PersonAdd,
  Brightness4,
  Brightness7,
  Logout,
} from "@mui/icons-material"
import { useCart } from "../context/CartContext.jsx"
import { useTheme } from "../context/ThemeContext.jsx"

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { getCartItemsCount } = useCart()
  const { darkMode, toggleDarkMode } = useTheme()
  const muiTheme = useMUITheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"))
  const navigate = useNavigate()
  const location = useLocation()

  /* determine login status once */
  const token = localStorage.getItem("token")
  const isLoggedIn = !!token

  // Hide navbar on dashboard
  if (location.pathname === "/dashboard") {
    return null;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const menuItems = [
    { text: "Home", path: "/", icon: <Home /> },
    { text: "Products", path: "/products", icon: <Inventory /> },
    { text: "Contact", path: "/contact", icon: <ContactMail /> },
    { text: "Profile", path: "/profile", icon: <Person /> },
  ]

  /* add auth items only when NOT logged in */
  if (!isLoggedIn) {
    menuItems.push(
      { text: "Login", path: "/login", icon: <Login /> },
      { text: "Sign Up", path: "/signup", icon: <PersonAdd /> }
    )
  } else {
    menuItems.push({ text: "Logout", path: "#", icon: <Logout />, action: handleLogout })
  }

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Typography variant="h6" sx={{ px: 2, mb: 2, fontWeight: "bold", color: "primary.main" }}>
        GadgetLoop
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={item.action ? "div" : Link}
            to={item.action ? undefined : item.path}
            onClick={() => {
              handleDrawerToggle()
              if (item.action) item.action()
            }}
            sx={{
              color: "inherit",
              textDecoration: "none",
              backgroundColor: location.pathname === item.path ? "action.selected" : "transparent",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ px: 2, mt: 2 }}>
        <FormControlLabel
          control={
            <Switch checked={darkMode} onChange={toggleDarkMode} icon={<Brightness7 />} checkedIcon={<Brightness4 />} />
          }
          label="Dark Mode"
        />
      </Box>
    </Box>
  )

  return (
    <>
      <AppBar position="fixed" elevation={2}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
              fontSize: { xs: "1.1rem", md: "1.5rem" },
            }}
          >
            GadgetLoop
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/products">
                Products
              </Button>
              <Button color="inherit" component={Link} to="/contact">
                Contact
              </Button>
              <Button color="inherit" component={Link} to="/profile">
                Profile
              </Button>
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isMobile && (
              <IconButton color="inherit" onClick={toggleDarkMode}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            )}

            <IconButton color="inherit" onClick={() => navigate("/cart")}>
              <Badge badgeContent={getCartItemsCount()} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {!isMobile &&
              (isLoggedIn ? (
                <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
                  Logout
                </Button>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button color="inherit" component={Link} to="/login" variant="outlined" size="small">
                    Login
                  </Button>
                  <Button color="secondary" component={Link} to="/signup" variant="contained" size="small">
                    Sign Up
                  </Button>
                </Box>
              ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Navbar