import React from 'react';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';

const UpdateButton =()=>{

    return(
        <>
        <Stack direction="row" spacing={1}>
      <IconButton aria-label="update">
        <EditIcon />
      </IconButton>
        </Stack>
        </>
    );
};

export default UpdateButton;