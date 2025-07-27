"use client"
import { Link, useNavigate } from "react-router-dom"
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  IconButton,
  TextField,
  Divider,
  CardMedia,
  Alert,
  List,
  ListItem,
  ListItemText,
} from "@mui/material"
import { Add, Remove, Delete, ShoppingCartOutlined, ArrowBack, LocalShipping, Security } from "@mui/icons-material"
import { useCart } from "../context/CartContext.jsx"

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const subtotal = getCartTotal()
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    // In a real app, this would integrate with a payment processor
    alert("Checkout functionality would be implemented here!")
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <ShoppingCartOutlined sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you haven't added any items to your cart yet.
        </Typography>
        <Button variant="contained" size="large" component={Link} to="/products" startIcon={<ArrowBack />}>
          Continue Shopping
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper elevation={1}>
            {cartItems.map((item, index) => (
              <Box key={item.id}>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        height="120"
                        image={item.image}
                        alt={item.name}
                        sx={{ objectFit: "contain", borderRadius: 1 }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <Typography variant="h6" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {item.brand}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${item.price}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton size="small" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                          <Remove />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          onChange={(e) => {
                            const val = Number.parseInt(e.target.value)
                            if (val >= 1) handleQuantityChange(item.id, val)
                          }}
                          inputProps={{
                            min: 1,
                            style: { textAlign: "center", width: "50px" },
                          }}
                          size="small"
                        />
                        <IconButton size="small" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                          <Add />
                        </IconButton>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                        <IconButton color="error" onClick={() => removeFromCart(item.id)}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                {index < cartItems.length - 1 && <Divider />}
              </Box>
            ))}

            <Box sx={{ p: 3, bgcolor: "background.paper" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button variant="outlined" component={Link} to="/products" startIcon={<ArrowBack />}>
                  Continue Shopping
                </Button>
                <Button variant="outlined" color="error" onClick={clearCart}>
                  Clear Cart
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 3, position: "sticky", top: 100 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>

            <List>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemText primary="Subtotal" />
                <Typography>${subtotal.toFixed(2)}</Typography>
              </ListItem>

              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemText
                  primary="Shipping"
                  secondary={shipping === 0 ? "Free shipping on orders over $50" : "Standard shipping"}
                />
                <Typography>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</Typography>
              </ListItem>

              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemText primary="Tax" />
                <Typography>${tax.toFixed(2)}</Typography>
              </ListItem>

              <Divider sx={{ my: 2 }} />

              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Total
                    </Typography>
                  }
                />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  ${total.toFixed(2)}
                </Typography>
              </ListItem>
            </List>

            <Button variant="contained" size="large" fullWidth onClick={handleCheckout} sx={{ mt: 2, mb: 3 }}>
              Proceed to Checkout
            </Button>

            {/* Security Features */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Security color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                Secure checkout with SSL encryption
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocalShipping color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {shipping === 0 ? "Free shipping applied" : "Add $" + (50 - subtotal).toFixed(2) + " for free shipping"}
              </Typography>
            </Box>

            {subtotal < 50 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Add ${(50 - subtotal).toFixed(2)} more to get free shipping!
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Cart
