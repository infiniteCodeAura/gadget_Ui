"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import {
  Container,
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Drawer,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Search, FilterList, Clear } from "@mui/icons-material"
import { products, categories, brands } from "../data/products.js"
import ProductCard from "../components/ProductCard.jsx"

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // Filter states
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [priceRange, setPriceRange] = useState([0, 3000])
  const [sortBy, setSortBy] = useState("name")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter((product) => product.brand === selectedBrand)
    }

    // Price filter
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, sortBy])

  // Update URL params when category changes
  useEffect(() => {
    if (selectedCategory) {
      setSearchParams({ category: selectedCategory })
    } else {
      setSearchParams({})
    }
  }, [selectedCategory, setSearchParams])

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedBrand("")
    setPriceRange([0, 3000])
    setSortBy("name")
    setSearchParams({})
  }

  const activeFiltersCount = [
    searchTerm,
    selectedCategory,
    selectedBrand,
    priceRange[0] > 0 || priceRange[1] < 3000,
  ].filter(Boolean).length

  const FiltersContent = () => (
    <Box sx={{ p: 3, minWidth: { xs: 280, md: 300 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">Filters</Typography>
        {activeFiltersCount > 0 && (
          <Button size="small" startIcon={<Clear />} onClick={handleClearFilters}>
            Clear All
          </Button>
        )}
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Category Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Category</InputLabel>
        <Select value={selectedCategory} label="Category" onChange={(e) => setSelectedCategory(e.target.value)}>
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Brand Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Brand</InputLabel>
        <Select value={selectedBrand} label="Brand" onChange={(e) => setSelectedBrand(e.target.value)}>
          <MenuItem value="">All Brands</MenuItem>
          {brands.map((brand) => (
            <MenuItem key={brand} value={brand}>
              {brand}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Price Range */}
      <Typography gutterBottom>
        Price Range: ${priceRange[0]} - ${priceRange[1]}
      </Typography>
      <Slider
        value={priceRange}
        onChange={(e, newValue) => setPriceRange(newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={3000}
        step={50}
        sx={{ mb: 3 }}
      />

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Active Filters:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {searchTerm && <Chip label={`Search: ${searchTerm}`} onDelete={() => setSearchTerm("")} size="small" />}
            {selectedCategory && (
              <Chip
                label={categories.find((c) => c.id === selectedCategory)?.name}
                onDelete={() => setSelectedCategory("")}
                size="small"
              />
            )}
            {selectedBrand && <Chip label={selectedBrand} onDelete={() => setSelectedBrand("")} size="small" />}
            {(priceRange[0] > 0 || priceRange[1] < 3000) && (
              <Chip
                label={`$${priceRange[0]} - $${priceRange[1]}`}
                onDelete={() => setPriceRange([0, 3000])}
                size="small"
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  )

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover our complete collection of premium tech products
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Desktop Filters */}
        {!isMobile && (
          <Grid item md={3}>
            <Paper elevation={1}>
              <FiltersContent />
            </Paper>
          </Grid>
        )}

        {/* Products Section */}
        <Grid item xs={12} md={9}>
          {/* Mobile Filter Button & Sort */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isMobile && (
                <Button variant="outlined" startIcon={<FilterList />} onClick={() => setMobileFiltersOpen(true)}>
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
              )}
              <Typography variant="body2" color="text.secondary">
                {filteredProducts.length} products found
              </Typography>
            </Box>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort by</InputLabel>
              <Select value={sortBy} label="Sort by" onChange={(e) => setSortBy(e.target.value)}>
                <MenuItem value="name">Name A-Z</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} lg={4} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Try adjusting your filters or search terms
              </Typography>
              <Button variant="contained" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <FiltersContent />
      </Drawer>
    </Container>
  )
}

export default ProductList
