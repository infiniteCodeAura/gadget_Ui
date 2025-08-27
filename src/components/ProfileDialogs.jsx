import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  Grid,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CloudUpload,
  PhotoCamera,
} from '@mui/icons-material';

// Update Name Dialog
export const UpdateNameDialog = ({ 
  open, 
  onClose, 
  initialData, 
  onSubmit, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Name</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={handleChange('firstName')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange('lastName')}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading || !formData.firstName || !formData.lastName}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Update Email Dialog
export const UpdateEmailDialog = ({ 
  open, 
  onClose, 
  initialEmail, 
  onSubmit, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    email: initialEmail || '',
    password: '',
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Email</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="New Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              required
              helperText="Enter your current password to confirm email change"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading || !formData.email || !formData.password}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Updating...' : 'Update Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Update Password Dialog
export const UpdatePasswordDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const togglePasswordVisibility = (field) => () => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPasswords.old ? 'text' : 'password'}
              value={formData.oldPassword}
              onChange={handleChange('oldPassword')}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility('old')}>
                      {showPasswords.old ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange('newPassword')}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility('new')}>
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Password must be at least 8 characters long"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading || !formData.oldPassword || !formData.newPassword || formData.newPassword.length < 8}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Upload Profile Image Dialog
export const UploadImageDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  loading,
  currentImage 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile);
    }
  };

  const handleClose = () => {
    if (previewUrl && previewUrl !== currentImage) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(currentImage || '');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Profile Image</DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Avatar
            src={previewUrl}
            sx={{ width: 150, height: 150, mx: 'auto', mb: 3 }}
          />
          
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCamera />}
              sx={{ mb: 2 }}
            >
              Choose Image
            </Button>
          </label>
          
          {selectedFile && (
            <Typography variant="body2" color="text.secondary">
              Selected: {selectedFile.name}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading || !selectedFile}
          startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// KYC Verification Dialog (Multi-step)
export const KycDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  loading,
  initialData 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    mobileNumber: initialData?.mobileNumber || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    simOwner: null,
    ppPhoto: null,
  });

  const steps = ['Personal Information', 'Document Upload'];

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleFileChange = (field) => (event) => {
    const file = event.target.files[0];
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const isStep1Valid = () => {
    return formData.firstName && formData.lastName && formData.mobileNumber && 
           formData.email && formData.address;
  };

  const isStep2Valid = () => {
    return formData.simOwner && formData.ppPhoto;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>KYC Verification</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange('mobileNumber')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange('address')}
                required
              />
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed grey', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  SIM Owner Document
                </Typography>
                <input
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                  id="sim-owner-upload"
                  type="file"
                  onChange={handleFileChange('simOwner')}
                />
                <label htmlFor="sim-owner-upload">
                  <Button variant="outlined" component="span" startIcon={<CloudUpload />}>
                    Upload SIM Owner
                  </Button>
                </label>
                {formData.simOwner && (
                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    ✓ {formData.simOwner.name}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed grey', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Passport Photo
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="pp-photo-upload"
                  type="file"
                  onChange={handleFileChange('ppPhoto')}
                />
                <label htmlFor="pp-photo-upload">
                  <Button variant="outlined" component="span" startIcon={<CloudUpload />}>
                    Upload PP Photo
                  </Button>
                </label>
                {formData.ppPhoto && (
                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    ✓ {formData.ppPhoto.name}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}
        {activeStep === 0 ? (
          <Button 
            onClick={handleNext} 
            variant="contained"
            disabled={!isStep1Valid()}
          >
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading || !isStep2Valid()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Submitting...' : 'Submit KYC'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};