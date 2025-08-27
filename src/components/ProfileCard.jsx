import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Box,
  Grid,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Edit,
  Email,
  Phone,
  LocationOn,
  Lock,
  CheckCircle,
  Verified,
  CameraAlt,
} from '@mui/icons-material';

const ProfileCard = ({ 
  user, 
  onEditName, 
  onEditEmail, 
  onEditPassword, 
  onUploadImage, 
  onKycUpdate 
}) => {
  const getKycStatus = () => {
    if (user.isVerified) {
      return (
        <Chip
          label={`Verified as ${user.verifiedAs || 'User'}`}
          color="success"
          icon={<CheckCircle />}
          variant="outlined"
        />
      );
    }
    return (
      <Button
        variant="outlined"
        color="warning"
        startIcon={<Verified />}
        onClick={onKycUpdate}
        size="small"
      >
        Complete KYC
      </Button>
    );
  };

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', mr: 3 }}>
            <Avatar
              src={user.avatar}
              sx={{ 
                width: 120, 
                height: 120, 
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={onUploadImage}
            >
              {!user.avatar && `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
            </Avatar>
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'primary.main',
                color: 'white',
                width: 32,
                height: 32,
                '&:hover': { bgcolor: 'primary.dark' }
              }}
              onClick={onUploadImage}
            >
              <CameraAlt sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {user.email}
            </Typography>
            {getKycStatus()}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Profile Information */}
        <Grid container spacing={3}>
          {/* Name Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 2, 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 1,
              position: 'relative'
            }}>
              <Typography variant="h6" gutterBottom color="primary">
                Name
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>First Name:</strong> {user.firstName || 'Not provided'}
              </Typography>
              <Typography variant="body1">
                <strong>Last Name:</strong> {user.lastName || 'Not provided'}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Edit />}
                sx={{ mt: 2 }}
                onClick={onEditName}
              >
                Edit Name
              </Button>
            </Box>
          </Grid>

          {/* Email Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 2, 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 1,
              position: 'relative'
            }}>
              <Typography variant="h6" gutterBottom color="primary">
                <Email sx={{ mr: 1, verticalAlign: 'middle' }} />
                Email
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {user.email || 'Not provided'}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Edit />}
                onClick={onEditEmail}
              >
                Change Email
              </Button>
            </Box>
          </Grid>

          {/* Mobile Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 2, 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 1 
            }}>
              <Typography variant="h6" gutterBottom color="primary">
                <Phone sx={{ mr: 1, verticalAlign: 'middle' }} />
                Mobile Number
              </Typography>
              <Typography variant="body1">
                {user.mobileNumber || 'Not provided'}
              </Typography>
            </Box>
          </Grid>

          {/* Password Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 2, 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 1 
            }}>
              <Typography variant="h6" gutterBottom color="primary">
                <Lock sx={{ mr: 1, verticalAlign: 'middle' }} />
                Password
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                ••••••••
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Lock />}
                onClick={onEditPassword}
              >
                Change Password
              </Button>
            </Box>
          </Grid>

          {/* Address Section */}
          <Grid item xs={12}>
            <Box sx={{ 
              p: 2, 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 1 
            }}>
              <Typography variant="h6" gutterBottom color="primary">
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                Address
              </Typography>
              <Typography variant="body1">
                {user.address || 'Not provided'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;