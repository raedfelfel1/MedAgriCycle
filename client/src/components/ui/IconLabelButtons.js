import * as React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';



export default function IconLabelButtons() {
    const navigate=useNavigate();
       const handleClickAdd=()=>{
       //Redirection vers le formulaire d'ajout des produits
     navigate('/ajoutProduit');
     }
  return (
    <Stack direction="row" spacing={2} display="flex" justifyContent="flex-end" sx={{ alignItems:"center",
    marginRight: 1}}>
      <Button variant="contained" sx={{top:10}} startIcon={<AddIcon />  } onClick={handleClickAdd}>
        Ajouter un produit
      </Button>
    </Stack>
  );
}