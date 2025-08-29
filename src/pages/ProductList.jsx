/* HomePage.jsx – product listing with search, brand, price range, pagination */
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
} from '@mui/material';

const PAGE_SIZE = 20;

/* ---------- helper ---------- */
const paramsToObject = (searchParams) => {
  const obj = {};
  searchParams.forEach((val, key) => { obj[key] = val; });
  return obj;
};

/* ---------- debounce hook ---------- */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ---------- main component ---------- */
const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /* states */
  const [products, setProducts]      = useState([]);
  const [totalProducts, setTotal]    = useState(0);
  const [loading, setLoading]        = useState(true);

  /* query values */
  const page     = Number(searchParams.get('page')) || 1;
  const search   = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const brand    = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  /* debounced search for smoother UX */
  const debouncedSearch = useDebounce(search);

  /* ---------- fetch products ---------- */
  const fetchProducts = useCallback(() => {
    setLoading(true);

    const params = new URLSearchParams({
      page,
      limit: PAGE_SIZE,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(category       && { category }),
      ...(brand          && { brand }),
      ...(minPrice       && { minPrice }),
      ...(maxPrice       && { maxPrice }),
    });

    axios
      .get('http://192.168.0.106:9090/api/v0/products', { params })
      .then(({ data }) => {
        setProducts(data.products || []);
        setTotal(data.totalProducts || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, category, brand, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ---------- change helpers ---------- */
  const handlePageChange = (_, value) =>
    setSearchParams({ ...paramsToObject(searchParams), page: value });

  const handleFilterChange = (key, value) => {
    const newParams = { ...paramsToObject(searchParams), [key]: value, page: 1 };
    if (!value && value !== 0) delete newParams[key];
    setSearchParams(newParams);
  };

  /* ---------- render ---------- */
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Filter bar */}
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
          <Typography variant="caption">Price Range ($)</Typography>
          <Slider
            value={[minPrice ? Number(minPrice) : 0, maxPrice ? Number(maxPrice) : 2000]}
            onChange={(_, val) => {
              const [min, max] = val;
              handleFilterChange('minPrice', min || '');
              handleFilterChange('maxPrice', max === 2000 ? '' : max);
            }}
            valueLabelDisplay="auto"
            min={0}
            max={2000}
            step={50}
          />
        </Box>
      </Box>

      {/* Active filter chips */}
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
            onDelete={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', ''); }}
          />
        )}
      </Box>

      {/* Products grid */}
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
                  // image={p.medias?.[0] || '/placeholder.svg'}
                  image={p.medias?.[0] 
  ? `http://localhost:9090/${p.medias[0]}` 
  : '/placeholder.svg'}
                  alt={p.productName}
                />
                {console.log(p.medias)}
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

      {/* Pagination */}
      {totalProducts > PAGE_SIZE && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(totalProducts / PAGE_SIZE)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default HomePage;