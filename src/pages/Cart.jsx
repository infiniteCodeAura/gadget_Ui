"use client"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
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
  List,
  ListItem,
  ListItemText,
} from "@mui/material"
import {
  Add,
  Remove,
  Delete,
  ShoppingCartOutlined,
  ArrowBack,
  Security,
} from "@mui/icons-material"

const BASE_URL = "http://192.168.0.106:9090"

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [cartSummary, setCartSummary] = useState({ totalQuantity: 0, totalPrice: 0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  /* ---------- fetch cart ---------- */
  const fetchCart = async () => {
    if (!token) return navigate("/login")

    try {
      const { data } = await axios.get(`${BASE_URL}/api/v3/user/cart/list`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Normalize response
      const items =
        data.item?.map((i) => ({
          id: i.productId,
          price: i.price,
          quantity: i.quantity,
          date: i.date,
        })) || []

      setCartItems(items)
      setCartSummary({
        totalQuantity: data.totalQuantity,
        totalPrice: data.totalPrice,
      })
    } catch (err) {
      console.error("Fetch cart error:", err)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  /* ---------- cart actions ---------- */
  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return handleRemove(itemId)
    try {
      await axios.put(
        `${BASE_URL}/user/cart/${itemId}/update`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCartItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i)))
    } catch (err) {
      console.error("Quantity update error:", err)
    }
  }

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`${BASE_URL}/product/delete/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCartItems((prev) => prev.filter((i) => i.id !== itemId))
    } catch (err) {
      console.error("Remove item error:", err)
    }
  }

  const handleFlush = async () => {
    try {
      await axios.delete(`${BASE_URL}/user/cart/flush`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCartItems([])
      setCartSummary({ totalQuantity: 0, totalPrice: 0 })
    } catch (err) {
      console.error("Flush cart error:", err)
    }
  }

  /* ---------- checkout ---------- */
  const handleCOD = async () => {
    if (!cartItems.length) return
    try {
      for (const item of cartItems) {
        await axios.post(
          `${BASE_URL}/api/v3/order/product/${item.id}`,
          { quantity: item.quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
      alert("Order placed via Cash on Delivery!")
      handleFlush()
    } catch (err) {
      console.error("COD error:", err)
    }
  }

  const handleOnline = () => alert("Online payment – update soon!")

  /* ---------- loading & empty ---------- */
  if (loading) return <Typography sx={{ p: 4 }}>Loading cart…</Typography>

  if (!cartItems.length) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <ShoppingCartOutlined sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Button variant="contained" component={Link} to="/products" startIcon={<ArrowBack />}>
          Continue Shopping
        </Button>
      </Container>
    )
  }

  /* ---------- render ---------- */
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Shopping Cart
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {cartSummary.totalQuantity} {cartSummary.totalQuantity === 1 ? "item" : "items"} in your cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper elevation={1}>
            {cartItems.map((item, idx) => (
              <Box key={item.id}>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    {/* Placeholder image */}
                    <Grid item xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        height="120"
                        image="/placeholder.svg"
                        alt="Product"
                        sx={{ objectFit: "contain", borderRadius: 1 }}
                      />
                    </Grid>

                    {/* Product info */}
                    <Grid item xs={12} sm={5}>
                      <Typography variant="h6">Product ID: {item.id}</Typography>
                      <Typography variant="h6" color="primary">
                        Rs {item.price.toLocaleString()}
                      </Typography>
                    </Grid>

                    {/* Quantity controls */}
                    <Grid item xs={12} sm={2}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton size="small" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                          <Remove />&nbsp; 
                        </IconButton>
                        <TextField sx={{ width: 70 }}
                          value={item.quantity}
                          type="number"
                          onChange={(e) => {
                            const val = Number.parseInt(e.target.value)
                            if (val >= 1) handleQuantityChange(item.id, val)
                          }}
                          inputProps={{ min: 1, style: { textAlign: "center", width: 50 } }}
                          size="large"
                        /> {item.quantity} 
                        <IconButton size="small" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                          <Add />
                        </IconButton>
                      </Box>
                    </Grid>

                    {/* Item total */}
                    <Grid item xs={12} sm={2}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </Typography>
                        <IconButton color="error" onClick={() => handleRemove(item.id)}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                {idx < cartItems.length - 1 && <Divider />}
              </Box>
            ))}

            <Box sx={{ p: 3, display: "flex", justifyContent: "space-between" }}>
              <Button variant="outlined" component={Link} to="/products" startIcon={<ArrowBack />}>
                Continue Shopping
              </Button>
              <Button variant="outlined" color="error" onClick={handleFlush}>
                Clear Cart
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="Total Quantity" />
                <Typography>{cartSummary.totalQuantity}</Typography>
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText primary="Total Price" />
                <Typography>Rs {cartSummary.totalPrice.toLocaleString()}</Typography>
              </ListItem>
            </List>

            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCOD}>
                Cash on Delivery
              </Button>
              <Button variant="outlined" fullWidth onClick={handleOnline}>
                Online Payment
              </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Security color="primary" fontSize="small" />
              <Typography variant="caption" sx={{ ml: 1 }}>
                Secure checkout
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Cart
