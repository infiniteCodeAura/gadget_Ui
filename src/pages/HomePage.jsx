"use client"
import { Link } from "react-router-dom"
import { Container, Typography, Button, Box, Grid, Card, Paper, useTheme } from "@mui/material"
import { ArrowForward, TrendingUp, LocalShipping, Security, Support } from "@mui/icons-material"
import { products, categories } from "../data/products.js"
import ProductCard from "../components/ProductCard.jsx"

const HomePage = () => {
  const theme = useTheme()

  // Get featured products (first 4 products)
  const featuredProducts = products.slice(0, 4)

  // Get trending products (products with high ratings)
  const trendingProducts = products.filter((p) => p.rating >= 4.7).slice(0, 4)

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  lineHeight: 1.2,
                }}
              >
                Discover the Latest in Tech
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                }}
              >
                Premium gadgets and electronics at unbeatable prices. From smartphones to laptops, find everything you
                need.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  component={Link}
                  to="/products"
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: "grey.100",
                    },
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/products?category=smartphones"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  View Smartphones
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: { xs: 300, md: 400 },
                }}
              >
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Latest Tech Gadgets"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "12px",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "transparent",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <LocalShipping sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Free Shipping
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Free shipping on orders over $50. Fast and reliable delivery.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "transparent",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Security sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Secure Payment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your payment information is processed securely and safely.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "transparent",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Support sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                24/7 Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get help whenever you need it with our dedicated support team.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
            Shop by Category
          </Typography>
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={6} sm={4} md={2} key={category.id}>
                <Card
                  component={Link}
                  to={`/products?category=${category.id}`}
                  sx={{
                    textDecoration: "none",
                    textAlign: "center",
                    p: 2,
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <Box sx={{ fontSize: 48, mb: 1, color: "primary.main" }}>
                    <span className="material-icons" style={{ fontSize: "inherit" }}>
                      {category.icon}
                    </span>
                  </Box>
                  <Typography variant="h6" color="text.primary">
                    {category.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h3" component="h2">
            Featured Products
          </Typography>
          <Button
            component={Link}
            to="/products"
            endIcon={<ArrowForward />}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            View All
          </Button>
        </Box>
        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Trending Products */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TrendingUp color="primary" />
              <Typography variant="h3" component="h2">
                Trending Now
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/products"
              endIcon={<ArrowForward />}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              View All
            </Button>
          </Box>
          <Grid container spacing={3}>
            {trendingProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Stay Updated
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Get the latest tech news and exclusive deals delivered to your inbox.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/signup"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "grey.100",
                },
              }}
            >
              Subscribe Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
