import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import '../../contexts/styles/CategoryFilter.css';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="category-filter-container">
      <TextField
        select
        fullWidth
        variant="outlined"
        /*label="Filtrer par catégorie"*/
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="category-select"
      >
        <MenuItem value="all">Catégories</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default CategoryFilter;