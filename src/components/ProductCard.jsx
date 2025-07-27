"use client"

import React from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  IconButton,
} from "@mui/material"
import { ShoppingCart, Favorite, FavoriteBorder } from "@mui/icons-material"
import { useCart } from "../context/CartContext.jsx"

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const [isFavorite, setIsFavorite] = React.useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  const handleFavoriteToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Card
      component={Link}
      to={`/products/${product.id}`}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
        position: "relative",
        "&:hover": {
          "& .product-actions": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <Chip
          label={`-${discount}%`}
          color="secondary"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 1,
            fontWeight: "bold",
          }}
        />
      )}

      {/* Favorite Button */}
      <IconButton
        onClick={handleFavoriteToggle}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          bgcolor: "rgba(255,255,255,0.9)",
          "&:hover": {
            bgcolor: "rgba(255,255,255,1)",
          },
        }}
      >
        {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
      </IconButton>

      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: "contain", p: 2 }}
      />

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {product.brand}
        </Typography>

        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Rating value={product.rating} precision={0.1} size="small" readOnly />
          <Typography variant="body2" color="text.secondary">
            ({product.reviews})
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
            ${product.price}
          </Typography>
          {product.originalPrice && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
              ${product.originalPrice}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions
        className="product-actions"
        sx={{
          p: 2,
          pt: 0,
          opacity: { xs: 1, md: 0 },
          transform: { xs: "translateY(0)", md: "translateY(10px)" },
          transition: "all 0.2s ease-in-out",
        }}
      >
        <Button
          variant="contained"
          startIcon={<ShoppingCart />}
          fullWidth
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProductCard
