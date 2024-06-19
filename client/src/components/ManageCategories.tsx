import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, ThemeProvider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { theme } from './theme';
import { API_URL } from './constants';

interface Category {
  id: number;
  name: string;
}

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [open, setOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get<Category[]>(`${API_URL}api/categories`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
      });
  };

  const handleAddCategory = () => {
    if (categoryName.trim() === '') return;

    axios.post(`${API_URL}api/categories`, { name: categoryName })
      .then(() => {
        setCategoryName('');
        fetchCategories();
      })
      .catch(error => {
        console.error('There was an error adding the category!', error);
      });
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      axios.delete(`${API_URL}api/categories/${deleteId}`)
        .then(() => {
          fetchCategories();
          setOpen(false);
          setDeleteId(null);
        })
        .catch(error => {
          console.error("There was an error deleting the categorie!", error);
        });
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Manage Categories
      </Typography>
      <TextField
        label="New Category"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="success" onClick={handleAddCategory} sx={{
          mb: 2,
        }}>
        Add Category
      </Button>
      <List>
        {categories.map((category) => (
          <ListItem key={category.id} secondaryAction={
            <IconButton 
            color='error' edge="end" aria-label="delete" onClick={() => handleDeleteClick(category.id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>
    </Container>
    <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this categorie?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm}
              color='error'
              autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
    </ThemeProvider>
  );
};

export default ManageCategories;
