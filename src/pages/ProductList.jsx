/* HomePage.jsx */
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Pagination,
  Skeleton,
  Chip,
  Slider,
  Alert,
} from '@mui/material';

/* -------------------------------------------------- */
const PAGE_SIZE = 15;

/* Put your back-end base URL here.  */
const API_BASE = 'http://localhost:9090';

/* -------------------------------------------------- */
const paramsToObject = (searchParams) => {
  const obj = {};
  searchParams.forEach((val, key) => (obj[key] = val));
  return obj;
};

/* -------------------------------------------------- */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* -------------------------------------------------- */
const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ------------- query values ------------- */
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  /* ------------- local state ------------- */
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(search);

  /* ------------- fetch ------------- */
  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      page,
      ...(debouncedSearch && { name: debouncedSearch }),
      ...(category && { category }),
      ...(brand && { brand }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
    });

    axios
      .get(`${API_BASE}/api/v0/product/search`, { params }) // <- no trailing space
      .then(({ data }) => {
        setProducts(data.products || data.data || []);
        setTotal(data.total || data.totalProducts || 0); // Corrected property access based on backend change
      })
      .catch((e) => {
        console.error(e);
        // setError('Product not found or some error occurred.'); // Don't show error for empty results
        setProducts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, category, brand, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ------------- change helpers ------------- */
  const handlePageChange = (_, value) =>
    setSearchParams({ ...paramsToObject(searchParams), page: value });

  const handleFilterChange = (key, value) => {
    const newParams = { ...paramsToObject(searchParams), [key]: value, page: 1 };
    if (!value && value !== 0) delete newParams[key];
    setSearchParams(newParams);
  };

  /* ------------- render ------------- */
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* -------- filter bar -------- */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          sx={{ minWidth: 220 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={brand}
            label="Brand"
            onChange={(e) => handleFilterChange('brand', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {['dell', 'apple', 'samsung', 'xiaomi', 'sony'].map((b) => (
              <MenuItem key={b} value={b}>{b}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {['mobile', 'laptop', 'tablet', 'accessory'].map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ minWidth: 180 }}>
          <Typography variant="caption">Price Range (Rs)</Typography>
          <Slider
            value={[minPrice ? Number(minPrice) : 0, maxPrice ? Number(maxPrice) : 20000]}
            onChange={(_, val) => {
              const [min, max] = val;
              handleFilterChange('minPrice', min || '');
              handleFilterChange('maxPrice', max === 20000 ? '' : max);
            }}
            valueLabelDisplay="auto"
            min={0}
            max={20000}
            step={500}
          />
        </Box>
      </Box>

      {/* -------- active filter chips -------- */}
      <Box sx={{ mb: 2 }}>
        {search && (
          <Chip label={`Search: ${search}`} onDelete={() => handleFilterChange('search', '')} sx={{ mr: 1 }} />
        )}
        {brand && (
          <Chip label={`Brand: ${brand}`} onDelete={() => handleFilterChange('brand', '')} sx={{ mr: 1 }} />
        )}
        {category && (
          <Chip label={`Category: ${category}`} onDelete={() => handleFilterChange('category', '')} sx={{ mr: 1 }} />
        )}
        {(minPrice || maxPrice) && (
          <Chip
            label={`Price: ${minPrice || 0} - ${maxPrice || '∞'}`}
            onDelete={() => {
              handleFilterChange('minPrice', '');
              handleFilterChange('maxPrice', '');
            }}
          />
        )}
      </Box>

      {/* -------- error -------- */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* -------- products grid -------- */}
      <Typography variant="h5" gutterBottom>
        Products ({totalProducts})
      </Typography>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Typography>No products found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    p.medias?.[0]
                      ? `${API_BASE}/${p.medias[0]}`
                      : '/placeholder.svg'
                  }
                  alt={p.productName}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" noWrap>
                    {p.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {p.brand} • {p.category}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    Rs {p.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/product/${p._id}`}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* -------- pagination -------- */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil(totalProducts / PAGE_SIZE) || 1}
          page={page}
          onChange={handlePageChange}
          color="primary"
          disabled={totalProducts <= PAGE_SIZE}
        />
      </Box>
    </Container>
  );
};

export default HomePage;