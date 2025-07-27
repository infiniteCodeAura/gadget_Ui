"use client"
import { Link, useNavigate } from "react-router-dom"
import { Container, Typography, Button, Box, Paper, Grid } from "@mui/material"
import { Home, ArrowBack, Search, ShoppingBag } from "@mui/icons-material"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={1} sx={{ p: 6, textAlign: "center" }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "4rem", md: "6rem" },
              fontWeight: "bold",
              color: "primary.main",
              mb: 2,
            }}
          >
            404
          </Typography>
          <Typography variant="h4" component="h1" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: "auto" }}>
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong
            URL.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <img
            src="/placeholder.svg?height=300&width=400"
            alt="404 Error"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
            }}
          />
        </Box>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="contained" startIcon={<Home />} component={Link} to="/" fullWidth size="large">
              Go Home
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(-1)} fullWidth size="large">
              Go Back
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<ShoppingBag />}
              component={Link}
              to="/products"
              fullWidth
              size="large"
            >
              Shop Now
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button variant="outlined" startIcon={<Search />} component={Link} to="/products" fullWidth size="large">
              Search Products
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, pt: 4, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" gutterBottom>
            Popular Categories
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
            <Button variant="text" component={Link} to="/products?category=smartphones" size="small">
              Smartphones
            </Button>
            <Button variant="text" component={Link} to="/products?category=laptops" size="small">
              Laptops
            </Button>
            <Button variant="text" component={Link} to="/products?category=tablets" size="small">
              Tablets
            </Button>
            <Button variant="text" component={Link} to="/products?category=wearables" size="small">
              Wearables
            </Button>
            <Button variant="text" component={Link} to="/products?category=audio" size="small">
              Audio
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default NotFound
