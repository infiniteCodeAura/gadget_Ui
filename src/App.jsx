"use client"
import { Routes, Route } from "react-router-dom"
import { CssBaseline, Box } from "@mui/material"
import { useTheme } from "./context/ThemeContext.jsx"
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import HomePage from "./pages/HomePage.jsx"
import ProductList from "./pages/ProductList.jsx"
import ProductDetail from "./pages/ProductDetail.jsx"
import Cart from "./pages/Cart.jsx"
import Profile from "./pages/Profile.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import Contact from "./pages/Contact.jsx"
import NotFound from "./pages/NotFound.jsx"
import Dashboard from "./pages/Dashboard.jsx"

function App() {
  const { theme } = useTheme()

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <CssBaseline />
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>

      <Footer />
    </Box>
  )
}

export default App
