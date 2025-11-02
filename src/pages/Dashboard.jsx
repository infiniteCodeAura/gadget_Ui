/* ProductDashboard.jsx – Seller CRUD & Upload – v1 role, v2 product */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, CircularProgress, Snackbar, Alert,
  Paper, Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Chip, Pagination,
  InputAdornment
} from '@mui/material';
import { Add, Edit, Visibility, Delete, Upload, Search } from '@mui/icons-material';

/* ---------- Axios instances ---------- */
const v1Api = axios.create({ baseURL: 'http://localhost:9090/api/v1', withCredentials: true });
const v2Api = axios.create({ baseURL: 'http://localhost:9090/api/v2', withCredentials: true });

const token = localStorage.getItem('token');
if (token) {
  [v1Api, v2Api].forEach((inst) =>
    inst.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    })
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  /* dialogs */
  const [dialogs, setDialogs] = useState({ add: false, edit: false, view: false, delete: false, photo: false, video: false });
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ productName: '', description: '', price: '', category: '', brand: '', quantity: '' });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const limit = 20;

  /* ---------- fetch role + products ---------- */
  const fetchProducts = async (page = 1, search = '') => {
    setLoading(true);
    try {
      /* role check – v1 */
      const { data: profile } = await v1Api.get('/user/profile');
      if (profile.data.role !== 'seller') { navigate('/'); return; }
      setRole('seller');

      /* products – v2 */
      const endpoint = search
        ? `/product/search?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`
        : `/product/list?page=${page}&limit=${limit}`;
      const res = await v2Api.get(endpoint);
      console.log(res.data.data);
      setProducts(res.data?.data || []);
      setTotalProducts(res.data?.data?.total || 0);
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Server error', severity: 'error' });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchProducts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  /* ---------- helpers ---------- */
  const openDialog = (type, product = null) => {
    setSelected(product);
    if (product) setFormData(product);
    setDialogs(prev => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type) => {
    setDialogs(prev => ({ ...prev, [type]: false }));
    setFormData({ productName: '', description: '', price: '', category: '', brand: '', quantity: '' });
    setImageFile(null); setVideoFile(null); setSelected(null);
  };

  const handleSave = async (method) => {
    const fd = new FormData();
    Object.keys(formData).forEach(k => fd.append(k, formData[k]));
    if (imageFile) fd.append('image', imageFile);
    try {
      if (method === 'add') await v2Api.post('/product/add', fd);
      if (method === 'edit') await v2Api.put(`/product/edit/${selected._id}`, fd);
      setSnackbar({ open: true, message: 'Saved', severity: 'success' });
      closeDialog(method === 'add' ? 'add' : 'edit');
      fetchProducts();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Error', severity: 'error' });
    }
  };

  const handleArchive = async (id) => {
    try {
      await v2Api.put(`/product/delete/${id}`);
      setSnackbar({ open: true, message: 'Archived', severity: 'success' });
      fetchProducts();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Error', severity: 'error' });
    }
  };

  const handleFileUpload = async (type) => {
    const file = type === 'photo' ? imageFile : videoFile;
    if (!file || !selected) return;
    const fd = new FormData();
    fd.append(type, file);
    try {
      await v2Api.post(`/upload/product/${selected._id}/${type}`, fd);
      setSnackbar({ open: true, message: `${type} uploaded`, severity: 'success' });
      closeDialog(type); fetchProducts();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Error', severity: 'error' });
    }
  };
console.log(handleFileUpload());
  if (!token) return null;
  if (loading) return <CircularProgress sx={{ mt: 10, mx: 'auto', display: 'block' }} />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Products
      </Typography>

      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="h6">Total: {totalProducts}</Typography>
        <TextField
          placeholder="Search own products..."
          size="small"
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
        <Button variant="contained" startIcon={<Add />} onClick={() => openDialog('add')}>
          Add Product
        </Button> 
      </Paper>

      {!products.length && !loading && (
        <Typography align="center" variant="h6" sx={{ mt: 5 }}>
          No products yet. Click “Add Product” to create one.
        </Typography>
      )}

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>Image</TableCell> */}
              <TableCell>Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(p => (
              <TableRow key={p._id} hover>
                <TableCell>
                  <img src={p.medias?.[0] || '/placeholder.svg'} alt={p.productName} width={60} style={{ borderRadius: 4 }} />
                </TableCell>
                <TableCell>{p.productName}</TableCell>
                <TableCell>{p.brand}</TableCell>
                <TableCell><Chip label={p.category} size="small" /></TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell align="center">
                  <IconButton title="View" onClick={() => openDialog('view', p)}><Visibility /></IconButton>
                  <IconButton title="Edit" onClick={() => openDialog('edit', p)}><Edit /></IconButton>
                  <IconButton title="Upload Photo" onClick={() => openDialog('photo', p)}><Upload /></IconButton>
                  <IconButton title="Upload Video" onClick={() => openDialog('video', p)}><Upload /></IconButton>
                  <IconButton title="Archive" onClick={() => handleArchive(p._id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalProducts > limit && (
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(totalProducts / limit)}
            page={currentPage}
            onChange={(_, p) => setCurrentPage(p)}
            color="primary"
          />
        </Box>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogs.add || dialogs.edit} onClose={() => closeDialog(dialogs.add ? 'add' : 'edit')} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogs.add ? 'Add Product' : 'Edit Product'}</DialogTitle>
        <DialogContent>
          {['productName', 'description', 'price', 'category', 'brand', 'quantity'].map(f => (
            <TextField
              key={f}
              margin="dense"
              label={f.charAt(0).toUpperCase() + f.slice(1)}
              fullWidth
              value={formData[f]}
              onChange={e => setFormData({ ...formData, [f]: e.target.value })}
            />
          ))}
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            {imageFile ? imageFile.name : 'Choose image'}
            <input hidden type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeDialog(dialogs.add ? 'add' : 'edit')}>Cancel</Button>
          <Button onClick={() => handleSave(dialogs.add ? 'add' : 'edit')}>
            {dialogs.add ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      {dialogs.view && selected && (
        <Dialog open={dialogs.view} onClose={() => closeDialog('view')} maxWidth="md" fullWidth>
          <DialogTitle>Product Details</DialogTitle>
          <DialogContent>
          
            <img src={`http://localhost:9090/${selected.medias?.[0]}` || '/placeholder.svg'} alt={selected.productName} style={{ width: '100%', borderRadius: 8 }} />
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5">{selected.productName}</Typography>
              <Typography>Brand: {selected.brand}</Typography>
              <Typography>Category: {selected.category}</Typography>
              <Typography>Price: ${selected.price}</Typography>
              <Typography>Quantity: {selected.quantity}</Typography>
              <Typography sx={{ mt: 1 }}>{selected.description}</Typography>
            </Box>
          </DialogContent>
          <DialogActions><Button onClick={() => closeDialog('view')}>Close</Button></DialogActions>
        </Dialog>
      )}

      {/* Photo Upload */}
      {dialogs.photo && selected && (
        <Dialog open={dialogs.photo} onClose={() => closeDialog('photo')} maxWidth="xs" fullWidth>
          <DialogTitle>Upload Photo</DialogTitle>
          <DialogContent>
            <Button variant="outlined" component="label" fullWidth>
              {imageFile ? imageFile.name : 'Choose image'}
              <input hidden type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => closeDialog('photo')}>Cancel</Button>
            <Button onClick={() => handleFileUpload('photo')} disabled={!imageFile}>Upload</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Video Upload */}
      {dialogs.video && selected && (
        <Dialog open={dialogs.video} onClose={() => closeDialog('video')} maxWidth="xs" fullWidth>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogContent>
            <Button variant="outlined" component="label" fullWidth>
              {videoFile ? videoFile.name : 'Choose video'}
              <input hidden type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => closeDialog('video')}>Cancel</Button>
            <Button onClick={() => handleFileUpload('video')} disabled={!videoFile}>Upload</Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;