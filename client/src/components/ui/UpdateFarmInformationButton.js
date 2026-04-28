import React from 'react';
import "../../contexts/styles/UpdateFarmInformationButton.css";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';

const UpdateFarmInformationButton =()=>{

   const navigate=useNavigate();
  const goToUpdateFarmInformation=()=>{
    navigate('/updateFarm');
  };

    return(<>
       <Stack direction="row" spacing={1}>
      <IconButton aria-label="update" onClick={goToUpdateFarmInformation}>
        <EditIcon />
      </IconButton>
        </Stack>
    </>);
};

export default UpdateFarmInformationButton;