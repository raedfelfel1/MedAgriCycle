import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteFarm } from '../../services/api';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

const DeleteFarmButton = ({ farms_id, onDeleteSuccess }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleDeleteFarm = async () => {
        console.log(farms_id);
        try {
            await deleteFarm(farms_id);
            setSnackbar({
                open: true,
                message: 'Ferme supprimée avec succès',
                severity: 'success'
            });
            onDeleteSuccess(farms_id); // Callback après suppression
        } catch (error) {
            console.error('Erreur:', error.message);
            setSnackbar({
                open: true,
                message: error.message || 'Erreur lors de la suppression de la ferme',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <Stack direction="row" spacing={1}>
                <IconButton 
                    aria-label="delete-farm" 
                    onClick={handleDeleteFarm}
                    color="error"
                >
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

export default DeleteFarmButton;