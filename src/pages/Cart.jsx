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
  Card,
  CardContent,
  CardMedia,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material"
import {
  Add,
  Remove,
  Delete,
  ShoppingCartOutlined,
  ArrowBack,
  Security,
  Image,
} from "@mui/icons-material"

const BASE_URL = "http://localhost:9090"

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [cartSummary, setCartSummary] = useState({ totalQuantity: 0, totalPrice: 0 })
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" })
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  /* ---------- fetch cart ---------- */
  const fetchCart = async () => {
    if (!token) {
      return navigate("/login");
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/v3/user/cart/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      // Log the response for debugging
      console.log("Cart API Response:", response.data);

      // Normalize different possible response shapes from backend.
      // The API sometimes returns { cart: { items: [...] , totalPrice, totalQuantity } }
      // or { item: [...], totalPrice, totalQuantity }.
      const cartObj = response.data?.cart ?? response.data;
      const rawItems = Array.isArray(cartObj?.items)
        ? cartObj.items
        : Array.isArray(cartObj?.item)
          ? cartObj.item
          : Array.isArray(cartObj)
            ? cartObj
            : [];

      if (rawItems && rawItems.length) {
        const items = rawItems.map((item) => ({
          id: item._id || item.productId || item.id,
          productId: item.productId || item._id || item.id,
          name: item.productName || item.name || "",
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 0,
          image: item.image || "",
        }));

        setCartItems(items);
        setCartSummary({
          totalQuantity: cartObj.totalQuantity ?? items.reduce((sum, it) => sum + it.quantity, 0),
          totalPrice: cartObj.totalPrice ?? items.reduce((sum, it) => sum + it.price * it.quantity, 0),
        });
      } else {
        setCartItems([]);
        setCartSummary({ totalQuantity: 0, totalPrice: 0 });
      }
    } catch (err) {
      console.error("Fetch cart error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setCartItems([]);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to load cart. Please try again.", severity: "error" })
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  /* ---------- cart actions ---------- */
  const handleQuantityChange = async (itemId, isIncrement) => {
    try {
      console.log("Updating quantity:", { itemId, isIncrement }); // For debugging
      const response = await axios.post(
        `${BASE_URL}/api/v3/user/cart/${itemId}/update`,
        {
          inc: isIncrement ? 1 : 0,
          dec: isIncrement ? 0 : 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("Update response:", response.data); // For debugging
      await fetchCart(); // Refresh cart after update
    } catch (err) {
      console.error("Update quantity error:", err.response?.data || err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to update quantity", severity: "error" })
    }
  };

  const handleRemove = async (itemId) => {
    try {
      console.log("Removing item:", itemId); // For debugging
      await axios.post(
        `${BASE_URL}/api/v3/product/delete/cart/${itemId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      await fetchCart(); // Refresh cart after deletion
    } catch (err) {
      console.error("Remove item error:", err.response?.data || err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to remove item", severity: "error" })
    }
  };

  const handleFlush = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/v3/user/cart/flush`, {
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
      setSnackbar({ open: true, message: "Order placed via Cash on Delivery!", severity: "success" })
      handleFlush()
    } catch (err) {
      console.error("COD error:", err)
    }
  }

  const handleOnline = async () => {
    if (!cartItems.length) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v3/payment/khalti/initiate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
      }
    } catch (err) {
      console.error("Online payment error:", err);

      // Extract error details from response
      const errorData = err.response?.data?.error;
      const errorMessage = err.response?.data?.message;

      // Check for specific Khalti validation errors
      if (errorData?.error_key === "validation_error" && errorData?.detail?.includes("Amount should be between")) {
        setSnackbar({
          open: true,
          message: "Payment amount must be between Rs 10 and Rs 1000. Please adjust your cart total or contact support.",
          severity: "warning"
        });
      } else if (errorData?.detail?.includes("Invalid token")) {
        setSnackbar({
          open: true,
          message: "Payment gateway authentication failed. Please contact support.",
          severity: "error"
        });
      } else if (errorMessage) {
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error"
        });
      } else {
        setSnackbar({
          open: true,
          message: "Payment initiation failed. Please try again or use Cash on Delivery.",
          severity: "error"
        });
      }
    }
  }

  /* ---------- loading & empty ---------- */
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={40} />
        <Typography sx={{ mt: 2 }}>Loading your cart...</Typography>
      </Container>
    );
  }

  if (!cartItems || !cartItems.length) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Paper elevation={1} sx={{ p: 4 }}>
          <ShoppingCartOutlined sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography color="text.secondary" paragraph>
            Looks like you haven't added any items yet.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/products"
            startIcon={<ArrowBack />}
            size="large"
          >
            Browse Products
          </Button>
        </Paper>
      </Container>
    )
  }

  /* ---------- render ---------- */
  return (
    <>
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
                        {/* <CardMedia
                        component="img"
                        height="120"
                        image="/placeholder.svg"
                        alt="Product"
                        sx={{ objectFit: "contain", borderRadius: 1 }}
                      /> */}
                        <Image fontSize="large" color="disabled" sx={{ fontSize: 80 }} />
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
                        <Box sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          p: 1
                        }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, false)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove />
                          </IconButton>
                          <Typography sx={{ minWidth: 40, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, true)}
                            disabled={item.quantity >= 6}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </Grid>

                      {/* Item total */}
                      <Grid item xs={12} sm={2}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                          <Typography variant="" sx={{ fontWeight: "bold" }}>
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Cart
