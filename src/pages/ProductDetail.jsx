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
  Avatar,
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
  Send,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext.jsx";

const BASE_URL    = "http://localhost:9090";
const ORDER_BASE_URL = "http://localhost:9090";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  /* ---------- product ---------- */
  const [product, setProduct]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity]         = useState(1);
  const [isFavorite, setIsFavorite]     = useState(false);
  const [addedToCart, setAddedToCart]   = useState(false);

  /* ---------- comments / replies ---------- */
  const [comments, setComments]         = useState([]);
  const [newComment, setNewComment]     = useState("");
  const [replyText, setReplyText]       = useState({});
  const [replyingTo, setReplyingTo]     = useState(null);

  /* ---------- token verification ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    axios
      .get("http://localhost:9090/api/v1/user/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch(() => {
        alert("Session expired. Please login again.");
        navigate("/login");
      });
  }, [id, navigate]);

  /* ---------- fetch product ---------- */
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/v0/product/view/${id}`)
      .then(({ data }) => setProduct(data.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  /* ---------- fetch comments ---------- */
  const fetchComments = () =>
    axios
      .get(`${BASE_URL}/api/v3/product/${id}/comment`)
      .then(({ data }) => setComments(data.comments || []))
      .catch(() => setComments([]));

  useEffect(() => {
    if (product) fetchComments();
  }, [product]);

  /* ---------- images ---------- */
  const images = useMemo(() => {
    if (!product) return ["/placeholder.svg"];
    const srcs = product.images || product.medias || [];
    if (!srcs.length) return ["/placeholder.svg"];
    return srcs.map((img) =>
      String(img).startsWith("http") ? img : `${BASE_URL}/${img}`
    );
  }, [product]);

  /* ---------- cart helpers ---------- */
  const handleAddToCart = async () => {
    if (!product) return;
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    await axios.post(
      `${ORDER_BASE_URL}/api/v3/product/add/cart/${product._id}`,
      { quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  } catch (err) {
    console.error("Add to cart error:", err);
    alert("Failed to add to cart");
  }
  };



  const handlePlaceOrder = async () => {
      const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    if (!product) return;
    try {
      await axios.post(
        `${ORDER_BASE_URL}/api/v3/order/product/${product._id}`,
        { quantity }, {
        headers: { Authorization: `Bearer ${token}` },
      }
      );
      alert("Order placed successfully!");
    } catch {}
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) setQuantity(newQuantity);
  };

  /* ---------- comment helpers ---------- */
  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`${BASE_URL}/api/v3/product/${id}/comment`, {
        comment: newComment,
      });
      setNewComment("");
      fetchComments();
    } catch {}
  };

  const postReply = async (commentId) => {
    const text = replyText[commentId]?.trim();
    if (!text) return;
    try {
      await axios.post(
        `${BASE_URL}/api/v3/product/comment/${commentId}/reply`,
        { replyComment: text }
      );
      setReplyText({ ...replyText, [commentId]: "" });
      setReplyingTo(null);
      fetchComments();
    } catch {}
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

  const discount =
    product.originalPrice && product.price < product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
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
              sx={{ width: "100%", height: 400, objectFit: "contain", borderRadius: 1 }}
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
              ({product.reviews || 0} reviews)
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
              Rs {product.price}
            </Typography>
            {product.originalPrice && (
              <>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through" }}
                >
                  Rs {product.originalPrice}
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
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
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handlePlaceOrder}
                disabled={product.quantity <= 0}
                sx={{ flex: 1 }}
              >
                Place Order
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

      {/* ---------- COMMENTS SECTION ---------- */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Customer Questions & Answers
        </Typography>

        {/* Add comment */}
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask a question or leave a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && postComment()}
          />
          <Button variant="contained" onClick={postComment}>
            <Send />
          </Button>
        </Box>

        {/* Comments list */}
        {comments.map((c) => (
          <Paper key={c._id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
              <Typography variant="subtitle2" fontWeight="bold">
                {c.user?.name || "Anonymous"}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {c.comment}
            </Typography>

            {/* Replies */}
            {c.replies?.map((r) => (
              <Box key={r._id} sx={{ pl: 4, mt: 1, borderLeft: 2, borderColor: "divider" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Avatar sx={{ width: 24, height: 24, mr: 1 }} />
                  <Typography variant="caption" fontWeight="bold">
                    {r.user?.name || "Anonymous"}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {r.replyComment}
                </Typography>
              </Box>
            ))}

            {/* Reply form */}
            {replyingTo === c._id ? (
              <Box sx={{ display: "flex", gap: 1, mt: 1, pl: 4 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Write a reply..."
                  value={replyText[c._id] || ""}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [c._id]: e.target.value })
                  }
                  onKeyPress={(e) => e.key === "Enter" && postReply(c._id)}
                />
                <Button size="small" onClick={() => postReply(c._id)}>
                  Reply
                </Button>
                <Button size="small" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </Box>
            ) : (
              <Button
                size="small"
                sx={{ mt: 1 }}
                onClick={() => {
                  setReplyingTo(c._id);
                  setReplyText({ ...replyText, [c._id]: "" });
                }}
              >
                Reply
              </Button>
            )}
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default ProductDetail;