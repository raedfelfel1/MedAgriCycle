
import React, { useState } from 'react';
import Products from '../products/Products';
import Sensor from '../sensors/Sensor';
import { Tabs, Tab, Box, Typography } from '@mui/material';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box p={2}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const ProductSensorTabs = ({farmId}) => {
  const [value, setValue] = useState(0); // 0: Produit, 1: Capteur

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Produit" />
        <Tab label="Capteur" />
      </Tabs>

      <TabPanel value={value} index={0}>
        {/* Contenu de l'onglet Produit */}
        
        <Products farmId={farmId}/>
      </TabPanel>

      <TabPanel value={value} index={1}>
        {/* Contenu de l'onglet Capteur */}

       <Sensor/>
      </TabPanel>
    </Box>
  );
};

export default ProductSensorTabs;
