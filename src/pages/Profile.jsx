/* Profile.jsx — React E-commerce Platform */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Badge,
} from '@mui/material';
import {
  Person,
  Email,
  LocationOn,
  Upload as UploadIcon,
  CheckCircle,
  Edit,
  ShoppingBag,
  Star,
  Add,
  CloudUpload,
} from '@mui/icons-material';

/* -------------------------------------------------- */
/* Axios instance                                     */
/* -------------------------------------------------- */
const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

// const navitate = useNavigation()

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;

  
});

/* -------------------------------------------------- */
/* Main component                                     */
/* -------------------------------------------------- */
const Profile = () => {
  /* ---------- states ---------- */
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  /* KYC */
  const [kycOpen, setKycOpen] = useState(false);
  const [kycForm, setKycForm] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    address: '',
    simOwner: null,
    ppPhoto: null,
  });

  /* addresses */
  const [addrOpen, setAddrOpen] = useState(false);
  const [addrForm, setAddrForm] = useState({ label: '', street: '', city: '', state: '', zip: '' });
  const [addresses, setAddresses] = useState([]);

  /* avatar */
  const avatarRef = useRef(null);

  /* per-field edit states */
  /* name */
  const [nameOpen, setNameOpen] = useState(false);
  const [nameForm, setNameForm] = useState({ firstName: '', lastName: '' });
  const [nameLoading, setNameLoading] = useState(false);
  /* email */
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '', password: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  /* password */
  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirm: '' });
  const [pwdLoading, setPwdLoading] = useState(false);

  /* seller uploads */
  const [photoUploadOpen, setPhotoUploadOpen] = useState(false);
  const [videoUploadOpen, setVideoUploadOpen] = useState(false);
  const [uploadProductId, setUploadProductId] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  /* ---------- fetch ---------- */
  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/user/profile');
      setProfile(data.data);
      setAddresses(data.data.addresses || []);
      setNameForm({ firstName: data.data.firstName || '', lastName: data.data.lastName || '' });
      setEmailForm({ email: data.data.email || '', password: '' });
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Failed to load profile', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ---------- handlers ---------- */
  /* 1. NAME */
  const handleNameSave = async () => {
    setNameLoading(true);
    try {
      await api.put('/user/profile/name', nameForm);
      setSnack({ open: true, msg: 'Name updated', severity: 'success' });
      setNameOpen(false);
      fetchProfile();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Update failed', severity: 'error' });
    } finally {
      setNameLoading(false);
    }
  };

  /* 2. EMAIL (with password) */
  const handleEmailSave = async () => {
    setEmailLoading(true);
    try {
      await api.put('/user/profile/email', emailForm);
      setSnack({ open: true, msg: 'Email updated', severity: 'success' });
      setEmailOpen(false);
      fetchProfile();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Update failed', severity: 'error' });
    } finally {
      setEmailLoading(false);
    }
  };

  /* 3. PASSWORD */
  const handlePwdSave = async () => {
    if (pwdForm.newPassword !== pwdForm.confirm) {
      setSnack({ open: true, msg: 'Passwords do not match', severity: 'error' });
      return;
    }
    setPwdLoading(true);
    try {
      await api.put('/user/profile/password', {
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.newPassword,
      });
      setSnack({ open: true, msg: 'Password changed', severity: 'success' });
      setPwdOpen(false);
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Change failed', severity: 'error' });
    } finally {
      setPwdLoading(false);
    }
  };

  /* KYC */
  const handleKycSubmit = async () => {
    const fd = new FormData();
    Object.keys(kycForm).forEach((k) => fd.append(k, kycForm[k]));
    try {
      await api.post('/user/kyc/verification', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSnack({ open: true, msg: 'KYC submitted', severity: 'success' });
      setKycOpen(false);
      fetchProfile();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'KYC failed', severity: 'error' });
    }
  };

  /* avatar */
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      await api.post('/user/profile/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSnack({ open: true, msg: 'Avatar updated', severity: 'success' });
      fetchProfile();
    } catch (err) {
      setSnack({ open: true, msg: 'Upload failed', severity: 'error' });
    }
  };

  /* address */
  const handleAddressAdd = async () => {
    try {
      await api.post('/buyer/address', addrForm);
      setSnack({ open: true, msg: 'Address added', severity: 'success' });
      setAddrOpen(false);
      fetchProfile();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Add failed', severity: 'error' });
    }
  };

  /* seller photo upload */
  const handlePhotoUpload = async () => {
    if (!uploadFile || !uploadProductId) return;
    setUploadLoading(true);
    const fd = new FormData();
    fd.append('photo', uploadFile);
    try {
      await api.post(`/upload/product/${uploadProductId}/photo`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSnack({ open: true, msg: 'Photo uploaded', severity: 'success' });
      setPhotoUploadOpen(false);
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Upload failed', severity: 'error' });
    } finally {
      setUploadLoading(false);
      setUploadFile(null);
    }
  };

  /* seller video upload */
  const handleVideoUpload = async () => {
    if (!uploadFile || !uploadProductId) return;
    setUploadLoading(true);
    const fd = new FormData();
    fd.append('video', uploadFile);
    try {
      await api.post(`/upload/product/${uploadProductId}/video`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSnack({ open: true, msg: 'Video uploaded', severity: 'success' });
      setVideoUploadOpen(false);
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Upload failed', severity: 'error' });
    } finally {
      setUploadLoading(false);
      setUploadFile(null);
    }
  };

  /* ---------- guards ---------- */
  if (loading) return <CircularProgress sx={{ mt: 10, mx: 'auto', display: 'block' }} />;
  if (!profile) return null;

  const { firstName, lastName, email: userEmail, role, category, avatar, verified, verifiedAs } = profile;

  /* ---------- render ---------- */
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        My Profile
      </Typography>
      <Grid container spacing={4}>
        {/* left card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton color="primary" onClick={() => avatarRef.current?.click()}>
                  <CloudUpload fontSize="small" />
                </IconButton>
              }
            >
              <Avatar src={avatar || ''} sx={{ width: 100, height: 100, mx: 'auto' }} />
            </Badge>

            {/* Name */}
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={2}>
              <Typography variant="h5">{firstName} {lastName}</Typography>
              <IconButton size="small" onClick={() => setNameOpen(true)}>
                <Edit fontSize="small" />
              </IconButton>
            </Box>

            {/* Email */}
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={1}>
              <Typography variant="body2" color="text.secondary">{userEmail}</Typography>
              <IconButton size="small" onClick={() => setEmailOpen(true)}>
                <Edit fontSize="small" />
              </IconButton>
            </Box>

            {/* Password */}
            <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => setPwdOpen(true)}>
              Change password
            </Button>

            <Box mt={2}>
              <Chip label={role} color="primary" /> <Chip label={category} color="secondary" />
            </Box>
            {verified && (
              <Box mt={1}>
                <Chip icon={<CheckCircle />} label={`Verified ${verifiedAs}`} color="success" />
              </Box>
            )}
          </Paper>

          {!verified && (
            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                KYC Verification
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Complete KYC to unlock selling features.
              </Typography>
              <Button variant="contained" onClick={() => setKycOpen(true)}>
                Complete KYC
              </Button>
            </Paper>
          )}
        </Grid>

        {/* right content */}
        <Grid item xs={12} md={8}>
          {/* analytics */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Analytics
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: 'Orders', value: profile.totalOrders || 0 },
                { label: 'Spent', value: `$${profile.totalSpent || 0}` },
                { label: 'Avg Order', value: `$${profile.avgOrderValue || 0}` },
                { label: 'Fav Cat', value: profile.favoriteCategory || '-' },
              ].map((item) => (
                <Grid item xs={6} sm={3} key={item.label}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6">{item.value}</Typography>
                      <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* addresses (buyers only) */}
          {role === 'buyer' && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Addresses</Typography>
                <Button startIcon={<Add />} onClick={() => setAddrOpen(true)}>
                  Add
                </Button>
              </Box>
              {addresses.length ? (
                addresses.map((a) => (
                  <Box key={a._id} mb={1}>
                    <Typography variant="body2">
                      {a.label} — {a.street}, {a.city}, {a.zip}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No addresses saved
                </Typography>
              )}
            </Paper>
          )}

          {/* seller info */}
          {role === 'seller' && (
            <>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Seller Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  You have {profile.productCount || 0} products listed
                  {category === 'Basic' && ' (Basic limit: 5)'}
                  {category === 'Pro' && ' (Pro limit: 50)'}
                  {category === 'Ultimate' && ' (Ultimate: unlimited)'}
                </Typography>
                <Button variant="contained" href="/dashboard">
                  Go to Dashboard
                </Button>
                <Button
                  variant="outlined"
                  sx={{ ml: 2 }}
                  onClick={() => {
                    setUploadProductId('');
                    setUploadFile(null);
                    setPhotoUploadOpen(true);
                  }}
                >
                  Upload Product Photo
                </Button>
                <Button
                  variant="outlined"
                  sx={{ ml: 1 }}
                  onClick={() => {
                    setUploadProductId('');
                    setUploadFile(null);
                    setVideoUploadOpen(true);
                  }}
                >
                  Upload Product Video
                </Button>
              </Paper>
            </>
          )}
        </Grid>
      </Grid>

      {/* ---------- DIALOGS ---------- */}
      {/* Name */}
      <Dialog open={nameOpen} onClose={() => setNameOpen(false)}>
        <DialogTitle>Edit Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            fullWidth
            value={nameForm.firstName}
            onChange={(e) => setNameForm({ ...nameForm, firstName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={nameForm.lastName}
            onChange={(e) => setNameForm({ ...nameForm, lastName: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNameOpen(false)}>Cancel</Button>
          <Button onClick={handleNameSave} disabled={nameLoading}>
            {nameLoading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email (with password) */}
      <Dialog open={emailOpen} onClose={() => setEmailOpen(false)}>
        <DialogTitle>Edit Email</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={emailForm.email}
            onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            value={emailForm.password}
            onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailOpen(false)}>Cancel</Button>
          <Button onClick={handleEmailSave} disabled={emailLoading}>
            {emailLoading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password */}
      <Dialog open={pwdOpen} onClose={() => setPwdOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            value={pwdForm.oldPassword}
            onChange={(e) => setPwdForm({ ...pwdForm, oldPassword: e.target.value })}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={pwdForm.newPassword}
            onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={pwdForm.confirm}
            onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPwdOpen(false)}>Cancel</Button>
          <Button onClick={handlePwdSave} disabled={pwdLoading}>
            {pwdLoading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* KYC */}
      <Dialog open={kycOpen} onClose={() => setKycOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>KYC Verification</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {['firstName', 'lastName', 'mobileNumber', 'email', 'address'].map((f) => (
              <Grid item xs={12} sm={6} key={f}>
                <TextField
                  label={f.charAt(0).toUpperCase() + f.slice(1)}
                  fullWidth
                  value={kycForm[f]}
                  onChange={(e) => setKycForm({ ...kycForm, [f]: e.target.value })}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" component="label" fullWidth>
                SIM Owner Photo
                <input hidden type="file" onChange={(e) => setKycForm({ ...kycForm, simOwner: e.target.files[0] })} />
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" component="label" fullWidth>
                Profile Photo
                <input hidden type="file" onChange={(e) => setKycForm({ ...kycForm, ppPhoto: e.target.files[0] })} />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setKycOpen(false)}>Cancel</Button>
          <Button onClick={handleKycSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Add Address */}
      <Dialog open={addrOpen} onClose={() => setAddrOpen(false)}>
        <DialogTitle>Add Address</DialogTitle>
        <DialogContent>
          {['label', 'street', 'city', 'state', 'zip'].map((f) => (
            <TextField
              key={f}
              margin="dense"
              label={f.charAt(0).toUpperCase() + f.slice(1)}
              fullWidth
              value={addrForm[f]}
              onChange={(e) => setAddrForm({ ...addrForm, [f]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddrOpen(false)}>Cancel</Button>
          <Button onClick={handleAddressAdd}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Upload Photo Dialog */}
      <Dialog open={photoUploadOpen} onClose={() => setPhotoUploadOpen(false)}>
        <DialogTitle>Upload Product Photo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Product ID"
            fullWidth
            value={uploadProductId}
            onChange={(e) => setUploadProductId(e.target.value)}
          />
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Choose Photo
            <input
              hidden
              type="file"
              accept="image/*"
              ref={photoInputRef}
              onChange={(e) => setUploadFile(e.target.files[0])}
            />
          </Button>
          {uploadFile && <Typography variant="body2" sx={{ mt: 1 }}>{uploadFile.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoUploadOpen(false)}>Cancel</Button>
          <Button onClick={handlePhotoUpload} disabled={uploadLoading}>
            {uploadLoading ? <CircularProgress size={20} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Video Dialog */}
      <Dialog open={videoUploadOpen} onClose={() => setVideoUploadOpen(false)}>
        <DialogTitle>Upload Product Video</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Product ID"
            fullWidth
            value={uploadProductId}
            onChange={(e) => setUploadProductId(e.target.value)}
          />
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Choose Video
            <input
              hidden
              type="file"
              accept="video/*"
              ref={videoInputRef}
              onChange={(e) => setUploadFile(e.target.files[0])}
            />
          </Button>
          {uploadFile && <Typography variant="body2" sx={{ mt: 1 }}>{uploadFile.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVideoUploadOpen(false)}>Cancel</Button>
          <Button onClick={handleVideoUpload} disabled={uploadLoading}>
            {uploadLoading ? <CircularProgress size={20} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity}>{snack.msg}</Alert>
      </Snackbar>

      {/* hidden file input for avatar */}
      <input type="file" hidden ref={avatarRef} onChange={handleAvatarUpload} accept="image/*" />
    </Container>
  );
};

export default Profile;