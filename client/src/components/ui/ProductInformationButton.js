import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

const ProductInformationButton =()=>{

    return(
                <>
        <Stack direction="row" spacing={1}>
      <IconButton aria-label="update" >
        < VisibilityIcon/> Afficher
      </IconButton>
        </Stack>
        </>
    );
};

export default ProductInformationButton;