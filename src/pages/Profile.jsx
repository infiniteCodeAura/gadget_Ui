"use client"

import React, { useState } from "react"
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Upload,
  CheckCircle,
  Warning,
  ShoppingBag,
  Star,
  Edit,
  Save,
  Cancel,
} from "@mui/icons-material"

const Profile = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, Silicon Valley, CA 94000",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  const [kycData, setKycData] = useState({
    fullName: "John Doe",
    address: "123 Tech Street, Silicon Valley, CA 94000",
    documentType: "Driver License",
    documentNumber: "DL123456789",
    documentFile: null,
    status: "verified", // 'pending', 'verified', 'rejected'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)
  const [kycDialogOpen, setKycDialogOpen] = useState(false)

  // Dummy analytics data
  const analytics = {
    totalOrders: 12,
    totalSpent: 2847.99,
    averageOrderValue: 237.33,
    favoriteCategory: "Smartphones",
    memberSince: "January 2023",
  }

  const recentOrders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      total: 1199.0,
      status: "delivered",
      items: ["iPhone 15 Pro Max"],
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      total: 399.0,
      status: "shipped",
      items: ["Sony WH-1000XM5"],
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      total: 1299.0,
      status: "processing",
      items: ["Dell XPS 13 Plus"],
    },
  ]

  const handleSaveProfile = () => {
    setUser(editedUser)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedUser(user)
    setIsEditing(false)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setKycData({ ...kycData, documentFile: file })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "success"
      case "shipped":
        return "info"
      case "processing":
        return "warning"
      default:
        return "default"
    }
  }

  const getKycStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "success"
      case "pending":
        return "warning"
      case "rejected":
        return "error"
      default:
        return "default"
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
            <Avatar src={user.avatar} sx={{ width: 100, height: 100, mx: "auto", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Member since {analytics.memberSince}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Button
                variant={isEditing ? "outlined" : "contained"}
                startIcon={isEditing ? <Cancel /> : <Edit />}
                onClick={isEditing ? handleCancelEdit : () => setIsEditing(true)}
                sx={{ mr: 1 }}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
              {isEditing && (
                <Button variant="contained" startIcon={<Save />} onClick={handleSaveProfile}>
                  Save
                </Button>
              )}
            </Box>
          </Paper>

          {/* KYC Status */}
          <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              KYC Verification
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Chip
                label={kycData.status.toUpperCase()}
                color={getKycStatusColor(kycData.status)}
                icon={kycData.status === "verified" ? <CheckCircle /> : <Warning />}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {kycData.status === "verified"
                ? "Your identity has been verified successfully."
                : "Complete your KYC verification to unlock all features."}
            </Typography>
            <Button variant="outlined" onClick={() => setKycDialogOpen(true)} disabled={kycData.status === "verified"}>
              {kycData.status === "verified" ? "Verified" : "Complete KYC"}
            </Button>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Personal Information */}
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={isEditing ? editedUser.name : user.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={isEditing ? editedUser.email : user.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={isEditing ? editedUser.phone : user.phone}
                  onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  value={isEditing ? editedUser.address : user.address}
                  onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Analytics Dashboard */}
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Analytics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center" }}>
                    <ShoppingBag color="primary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h4" color="primary">
                      {analytics.totalOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Orders
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="success.main">
                      ${analytics.totalSpent}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Spent
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="info.main">
                      ${analytics.averageOrderValue}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Order Value
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center" }}>
                    <Star color="warning" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body1" color="text.primary">
                      {analytics.favoriteCategory}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Favorite Category
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Recent Orders */}
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <List>
              {recentOrders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <ShoppingBag />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="subtitle1">Order {order.id}</Typography>
                          <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {order.date} • ${order.total} • {order.items.join(", ")}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentOrders.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* KYC Dialog */}
      <Dialog open={kycDialogOpen} onClose={() => setKycDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>KYC Verification</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please provide the following information to complete your identity verification.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={kycData.fullName}
                onChange={(e) => setKycData({ ...kycData, fullName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={kycData.address}
                onChange={(e) => setKycData({ ...kycData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Document Type"
                value={kycData.documentType}
                onChange={(e) => setKycData({ ...kycData, documentType: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Document Number"
                value={kycData.documentNumber}
                onChange={(e) => setKycData({ ...kycData, documentNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ border: "2px dashed", borderColor: "divider", p: 3, textAlign: "center" }}>
                <input
                  accept="image/*,.pdf"
                  style={{ display: "none" }}
                  id="document-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="document-upload">
                  <IconButton color="primary" component="span">
                    <Upload />
                  </IconButton>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {kycData.documentFile ? kycData.documentFile.name : "Upload Document (Image or PDF)"}
                  </Typography>
                </label>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setKycDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setKycDialogOpen(false)}>
            Submit for Verification
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Profile
