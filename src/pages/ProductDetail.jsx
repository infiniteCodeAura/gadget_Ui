"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Chip,
  Rating,
  Divider,
  IconButton,
  TextField,
  Alert,
  Breadcrumbs,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  Add,
  Remove,
  CheckCircle,
  LocalShipping,
  Security,
  Replay,
  NavigateNext,
} from "@mui/icons-material"
import { products } from "../data/products.js"
import { useCart } from "../context/CartContext.jsx"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const product = products.find((p) => p.id === Number.parseInt(id))
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Product not found</Alert>
      </Container>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
        <Link color="inherit" href="/" onClick={() => navigate("/")}>
          Home
        </Link>
        <Link color="inherit" href="/products" onClick={() => navigate("/products")}>
          Products
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      {addedToCart && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Product added to cart successfully!
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Box
              component="img"
              src={product.images ? product.images[selectedImage] : product.image}
              alt={product.name}
              sx={{
                width: "100%",
                height: 400,
                objectFit: "contain",
                borderRadius: 1,
              }}
            />
          </Paper>

          {product.images && product.images.length > 1 && (
            <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>
              {product.images.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "contain",
                    border: selectedImage === index ? 2 : 1,
                    borderColor: selectedImage === index ? "primary.main" : "divider",
                    borderRadius: 1,
                    cursor: "pointer",
                    p: 1,
                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {product.brand}
            </Typography>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
              {product.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({product.reviews} reviews)
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
                ${product.price}
              </Typography>
              {product.originalPrice && (
                <>
                  <Typography variant="h6" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                    ${product.originalPrice}
                  </Typography>
                  <Chip label={`Save ${discount}%`} color="secondary" size="small" />
                </>
              )}
            </Box>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {product.description}
            </Typography>

            {/* Features */}
            {product.features && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Key Features
                </Typography>
                <List dense>
                  {product.features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Quantity and Add to Cart */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quantity
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  <Remove />
                </IconButton>
                <TextField
                  value={quantity}
                  onChange={(e) => {
                    const val = Number.parseInt(e.target.value)
                    if (val >= 1 && val <= 10) setQuantity(val)
                  }}
                  inputProps={{ min: 1, max: 10, style: { textAlign: "center" } }}
                  sx={{ width: 80 }}
                />
                <IconButton onClick={() => handleQuantityChange(1)} disabled={quantity >= 10}>
                  <Add />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  sx={{ flex: 1 }}
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <IconButton onClick={() => setIsFavorite(!isFavorite)} sx={{ border: 1, borderColor: "divider" }}>
                  {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
                <IconButton sx={{ border: 1, borderColor: "divider" }}>
                  <Share />
                </IconButton>
              </Box>
            </Box>

            {/* Product Guarantees */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <LocalShipping color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Free Shipping" secondary="On orders over $50" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Replay color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="30-Day Returns" secondary="Easy returns and exchanges" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Security color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="1-Year Warranty" secondary="Manufacturer warranty included" />
                </ListItem>
              </List>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ProductDetail
