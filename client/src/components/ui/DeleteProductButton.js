import React,{useState} from 'react';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteProduct } from '../../services/api';
import { Snackbar} from '@mui/material';
import Alert from '@mui/material/Alert';

const DeleteButton =({product_id,onDeleteSuccess})=>{
   const productId=product_id;
    const handleDeleteProduct = async () => {
  try {
    await deleteProduct(productId);
    // Mettre à jour l'état/local storage/etc.
    console.log('Produit supprimé avec succès');
    
    setSnackbar({
      open: true,
      message: 'Produit supprimé avec succès',
      severity: 'success'
    });
    //onProductDeleted(deletedFarm);
    onDeleteSuccess(product_id); // Appel du callback après suppression réussie
  } catch (error) {
    console.error('Erreur:', error.message);
    setSnackbar({
      open: true,
      message: error.message || 'Erreur lors de la création de la ferme',
      severity: 'error'
    });
  }
};

const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      severity: 'success'
    });

    const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

    return(
        <>
        <Stack direction="row" spacing={1}>
      <IconButton aria-label="delete" onClick={handleDeleteProduct}>
        <DeleteIcon />
      </IconButton>
         </Stack>

         <Snackbar
                           open={snackbar.open}
                           autoHideDuration={6000}
                           onClose={handleCloseSnackbar}
                         >
                           <Alert
                             elevation={6}
                             variant="filled"
                             onClose={handleCloseSnackbar}
                             severity={snackbar.severity}
                           >
                             {snackbar.message}
                           </Alert>
                         </Snackbar>
        </>
    );
};

export default DeleteButton;