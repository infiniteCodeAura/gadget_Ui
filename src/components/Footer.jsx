import { Box, Container, Grid, Typography, Link, IconButton, Divider } from "@mui/material"
import { Facebook, Twitter, Instagram, LinkedIn, Email, Phone, LocationOn } from "@mui/icons-material"

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              GadgetLoop
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              Your trusted destination for premium technology and electronic products. Discover the latest gadgets and
              innovations.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton size="small" sx={{ color: "inherit" }}>
                <Facebook />
              </IconButton>
              <IconButton size="small" sx={{ color: "inherit" }}>
                <Twitter />
              </IconButton>
              <IconButton size="small" sx={{ color: "inherit" }}>
                <Instagram />
              </IconButton>
              <IconButton size="small" sx={{ color: "inherit" }}>
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Home
              </Link>
              <Link href="/products" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Products
              </Link>
              <Link href="/contact" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Contact
              </Link>
              <Link href="/profile" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                My Account
              </Link>
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Categories
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/products?category=smartphones" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Smartphones
              </Link>
              <Link href="/products?category=laptops" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Laptops
              </Link>
              <Link href="/products?category=tablets" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Tablets
              </Link>
              <Link href="/products?category=wearables" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Wearables
              </Link>
              <Link href="/products?category=audio" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Audio
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Contact Info
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  support@gadgetloop.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  123 Tech Street, Silicon Valley, CA 94000
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.2)" }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 GadgetLoop. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
              Terms of Service
            </Link>
            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
              Return Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
