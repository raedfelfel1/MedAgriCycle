import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import '../../contexts/styles/SearchBar.css';

const SearchBar = ({ onSearch,placeholder="Rechercher un produit..." }) => {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar-container">
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{height:20}} />
            </InputAdornment>
          ),
          classes: {
            root: 'search-input'
          }
        }}
      />
    </div>
  );
};

export default SearchBar;