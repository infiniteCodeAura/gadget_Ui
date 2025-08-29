"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from "@mui/material";
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
} from "@mui/icons-material";
import { useCart } from "../context/CartContext.jsx";

const BASE_URL = "http://localhost:9090";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  /* ---------- local state ---------- */
  const [product, setProduct]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity]         = useState(1);
  const [isFavorite, setIsFavorite]     = useState(false);
  const [addedToCart, setAddedToCart]   = useState(false);

  /* ---------- fetch ---------- */
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/v0/product/view/${id}`)
      .then(({ data }) => {
        setProduct(data.data);
        setSelectedImage(0);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  /* ---------- image list ---------- */
  const images = useMemo(() => {
    if (!product) return [];

    // 1) Array of filenames
    if (Array.isArray(product.images) && product.images.length) {
      return product.images.map((img) =>
        img.startsWith("http") ? img : `${BASE_URL}/${img}`
      );
    }

    // 2) Single comma-separated string
    if (typeof product.images === "string" && product.images.trim()) {
      return product.images.split(",").map((img) =>
        img.trim().startsWith("http") ? img.trim() : `${BASE_URL}/${img.trim()}`
      );
    }

    // 3) medias field fallback (same rules)
    if (Array.isArray(product.medias) && product.medias.length) {
      return product.medias.map((m) =>
        m.startsWith("http") ? m : `${BASE_URL}/${m}`
      );
    }

    // 4) placeholder
    return ["/placeholder.svg"];
  }, [product]);

  /* ---------- helpers ---------- */
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) setQuantity(newQuantity);
  };

  /* ---------- loading & 404 ---------- */
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={60} />
        <Skeleton variant="text" width="40%" height={40} />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Product not found</Alert>
      </Container>
    );
  }

  /* ---------- derived data ---------- */
  const discount =
    product.originalPrice && product.price < product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  /* ---------- render ---------- */
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
        <MuiLink color="inherit" onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
          Home
        </MuiLink>
        <MuiLink color="inherit" onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
          Products
        </MuiLink>
        <Typography color="text.primary">{product.productName}</Typography>
      </Breadcrumbs>

      {addedToCart && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Product added to cart successfully!
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Box
              component="img"
              src={images[selectedImage]}
              alt={product.productName}
              sx={{
                width: "100%",
                height: 400,
                objectFit: "contain",
                borderRadius: 1,
              }}
            />
          </Paper>

          {images.length > 1 && (
            <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>
              {images.map((img, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={img}
                  alt={`${product.productName} ${idx + 1}`}
                  onClick={() => setSelectedImage(idx)}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "contain",
                    border: selectedImage === idx ? 2 : 1,
                    borderColor: selectedImage === idx ? "primary.main" : "divider",
                    borderRadius: 1,
                    cursor: "pointer",
                    p: 1,
                    "&:hover": { borderColor: "primary.main" },
                  }}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {product.brand}
          </Typography>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
            {product.productName}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Rating value={product.rating || 4.5} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary">
              ( {product.reviews || 0} reviews )
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
              Rs{product.price}
            </Typography>
            {product.originalPrice && (
              <>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through" }}
                >
                  ${product.originalPrice}
                </Typography>
                <Chip label={`Save ${discount}%`} color="secondary" size="small" />
              </>
            )}
          </Box>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
            {product.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Quantity & Add to Cart */}
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
                  const val = Number.parseInt(e.target.value);
                  if (val >= 1 && val <= 10) setQuantity(val);
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
                disabled={product.quantity <= 0}
                sx={{ flex: 1 }}
              >
                {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
              <IconButton
                onClick={() => setIsFavorite(!isFavorite)}
                sx={{ border: 1, borderColor: "divider" }}
              >
                {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
              <IconButton sx={{ border: 1, borderColor: "divider" }}>
                <Share />
              </IconButton>
            </Box>
          </Box>

          {/* Guarantees */}
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
                <ListItemText primary="30-Day Returns" secondary="Easy returns & exchanges" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <Security color="primary" />
                </ListItemIcon>
                <ListItemText primary="1-Year Warranty" secondary="Manufacturer warranty" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;