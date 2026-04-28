import React, { useState,useEffect } from "react";
import "../../contexts/styles/ProductCard.css";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { updateProduct, deleteProduct } from "../../services/api";
import PreviewIcon from '@mui/icons-material/Preview';
import { useNavigate } from 'react-router-dom';


const AlertComponent = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductCard = ({ filteredProduct, onProductsChange, fertilizerTanks,waterTanks }) => {
  const navigate = useNavigate();
  const [editableId, setEditableId] = useState(null);
  const [editData, setEditData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!Array.isArray(filteredProduct)) {
    return <div>Chargement des produits...</div>;
  }

  const handleEditClick = (product) => {
    setEditableId(product._id);
    setEditData({ ...product });
  };

  const handleConfirmClick = async () => {
    try {
      await updateProduct(editableId, editData);
      setSnackbar({
        open: true,
        message: "Produit modifié avec succès ✅",
        severity: "success",
      });
      setEditableId(null);
      if (onProductsChange) onProductsChange();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Erreur lors de la modification ❌",
        severity: "error",
      });
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteProduct(id);
      setSnackbar({
        open: true,
        message: "Produit supprimé avec succès 🗑️",
        severity: "info",
      });
      if (onProductsChange) onProductsChange();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Erreur lors de la suppression ❌",
        severity: "error",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value!=""?value:null }));
  };

  return (
    <div className="product-container">
      {filteredProduct.map((product) => {
        const isEditing = editableId === product._id;

        return (
          <div key={product._id} className="product-card">
            {/* Catégorie et Nom côte à côte */}
            <div className="info-row">
              <div className="info-item">
                {isEditing ? (
                  <div className="field">
                    <label>Catégorie</label>
                    <input
                      type="text"
                      name="category"
                      value={editData.category || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <span>{product.category}</span>
                )}
              </div>

              <div className="info-item">
                {isEditing ? (
                  <div className="field">
                    <label>Nom du produit</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <span className="product-title">{product.name}</span>
                )}
              </div>
            </div>

            {/* Conditions de culture */}
            <div className="info-row">
              <div className="info-item">
                {isEditing ? (
                  <div className="field">
                    <label>Température min (°C)</label>
                    <input
                      type="number"
                      name="minTemperature"
                      value={editData.minTemperature || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <span>Temp. min : {product.minTemperature}°C</span>
                )}
              </div>

              <div className="info-item">
                {isEditing ? (
                  <div className="field">
                    <label>Température max (°C)</label>
                    <input
                      type="number"
                      name="maxTemperature"
                      value={editData.maxTemperature || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <span>Temp. max : {product.maxTemperature}°C</span>
                )}
              </div>
            </div>

            <div className="info-row">
              <div className="info-item">
                {isEditing ? (
                  <div className="field">
                    <label>Humidité min (%)</label>
                    <input
                      type="number"
                      name="minHumidite"
                      value={editData.minHumidite || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <span>Humidité min : {product.minHumidite}%</span>
                )}
              </div>

              <div className="info-item">
                {isEditing ? (
                  <div className="field">
                    <label>Humidité max (%)</label>
                    <input
                      type="number"
                      name="maxHumidite"
                      value={editData.maxHumidite || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <span>Humidité max : {product.maxHumidite}%</span>
                )}
              </div>
            </div>

            <div className="info-row">
              <div className="info-item">
                {isEditing ? (
                  <div className="field">
                    <label>pH min</label>
                    <input
                      type="number"
                      step="0.1"
                      name="minPh"
                      value={editData.minPh || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <span>pH min : {product.minPh}</span>
                )}
              </div>

              <div className="info-item">
                {isEditing ? (
                  <div className="field">
                    <label>pH max</label>
                    <input
                      type="number"
                      step="0.1"
                      name="maxPh"
                      value={editData.maxPh || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <span>pH max : {product.maxPh}</span>
                )}
              </div>
            </div>
            <div className="info-item">
                {isEditing ? (
                  <div className="field">
                    <label>Réservoir d'eau</label>

                    <select name="waterTank" value={editData.waterTank || ""} onChange={handleInputChange}>
                        <option value="">Aucun</option>

                      {waterTanks.map((tank)=>
                        <option key={tank._id} value={tank._id}>{tank.name}</option>
                      )}
                    </select>
                  </div>
                ) : (
                  <span>Réservoir d'eau : {waterTanks.find(tank => tank._id === product.waterTank)?.name || "Aucun"}
                  </span>
                )}
            </div>
            <div className="info-item">
                {isEditing ? (
                  <div className="field">
                    <label>Réservoir d'engrais</label>

                    <select name="fertilizerTank" value={editData.fertilizerTank || ""} onChange={handleInputChange}>
                        <option value="">Aucun</option>

                      {fertilizerTanks.map((tank)=>
                        <option key={tank._id} value={tank._id}>{tank.name}</option>
                      )}
                    </select>
                  </div>
                ) : (
                  <span>Réservoir d'engrais : {fertilizerTanks.find(tank => tank._id === product.fertilizerTank)?.name || "Aucun"}
                  </span>
                )}
            </div>
            {/* Date d'ajout (lecture seule) */}
            <div className="info-row">
              <div className="info-item">
                <CalendarTodayIcon fontSize="small" />
                <span>
                  {new Date(product.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <hr className="separator" />

            {/* Actions */}
            <div className="action-icons">
              {!isEditing ? (
                <EditIcon
                  className="icon edit"
                  fontSize="small"
                  onClick={() => handleEditClick(product)}
                />
              ) : (
                <CheckCircleIcon
                  className="icon confirm"
                  fontSize="small"
                  onClick={handleConfirmClick}
                />
              )}
              <PreviewIcon className="icon locate" fontSize="small" onClick={()=>navigate("/showProduct",{state:{id:product._id}})}/>
              <DeleteIcon
                className="icon delete"
                fontSize="small"
                onClick={() => handleDeleteClick(product._id)}
              />
            </div>
          </div>
        );
      })}

      {/* Snackbar notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <AlertComponent
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </AlertComponent>
      </Snackbar>
    </div>
  );
};

export default ProductCard;
