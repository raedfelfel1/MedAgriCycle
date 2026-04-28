import React, { useState, useEffect, useRef } from 'react';
import BarSide from '../components/ui/BarSide';
import '../contexts/styles/Report.css';
import AdvancementChart from '../components/ui/AdvancementChart';

import CombinedChart from '../components/ui/CombinedChart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaCaretDown } from 'react-icons/fa';
import { fetchFarmsByUser, fetchRecommendations,uploadRapport,fetchProductsByFarm,fetchSensorsByProduct} from '../services/api';
import { Button, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Report = () => {
  const [showDropdown, setShowDropdown] = useState(true);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const reportRef = useRef();
  const userId = localStorage.getItem('userId');
  
  
    const [products,setProducts]=useState([]);
    const [selectedProduct,setSelectedProduct]=useState(null);
  
    const [sensors,setSensors]=useState(null);
    const [selectedsensor,setSelectedSensors]=useState(null);
  
    const [hour,setHour]=useState('24');
  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  // Charger les fermes de l'utilisateur
  useEffect(() => {
    if (!userId) {
      setError("Utilisateur non identifié");
      setLoading(false);
      return;
    }
  
    const loadFarms = async () => {
      try {
        setLoading(true);
        const userFarms = await fetchFarmsByUser(userId);
        setFarms(userFarms);
  
        if (userFarms.length > 0) {
          setSelectedFarm(userFarms[0]._id);
        setProducts([]);
  
        } else {
          setError("Aucune ferme trouvée pour cet utilisateur");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des fermes:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
  
    loadFarms();
  }, [userId]);
  
  
  useEffect(() => {
    if (!selectedFarm) return;
  
    const loadProducts = async () => {
      try {
        setLoading(true);
  
        setProducts([]);
        setSelectedProduct(null);
        setSelectedSensors(null);
  
        const products = await fetchProductsByFarm(selectedFarm);
  
        if (products.data.length > 0) {
          setSelectedProduct(products.data[0]._id);
        }
  
        setProducts(products.data);
      } catch (error) {
        setError("Erreur lors du chargement des produits");
      } finally {
        setLoading(false);
      }
    };
  
    loadProducts();
  }, [selectedFarm]);
  
  
  useEffect(() => {
    
    const loadSensors = async () => {
      if (!selectedProduct) return;
      try {
        setLoading(true);
  
        setSelectedSensors(null);
        const sensors = await fetchSensorsByProduct(selectedProduct);
        if (sensors.length > 0) {
          setSelectedSensors(sensors[0]._id);
        }
  
  
      } catch (error) {
        setError("Erreur lors du chargement des capteurs");
      } finally {
        setLoading(false);
      }
    };
  
    loadSensors();
  }, [selectedProduct,hour]);

  // Charger les recommandations pour la ferme sélectionnée
  useEffect(() => {
    if (!selectedFarm) return;

    const loadRecommendations = async () => {
      try {
        const recs = await fetchRecommendations(userId);
        setRecommendations(recs);
      } catch (err) {
        console.error('Erreur lors du chargement des recommandations :', err);
      }
    };

    loadRecommendations();
  }, [selectedFarm]);
//   const handleDownloadAndUpload = async () => {
//   const element = reportRef.current; // ton élément HTML à transformer en PDF

//   // 1. Générer image à partir de l'élément
//   const canvas = await html2canvas(element, { scale: 2, useCORS: true,  scrollY: -window.scrollY });
//   const imgData = canvas.toDataURL("image/png");

//   // 2. Créer le PDF
  
//   const pdf = new jsPDF("p", "mm", "a4");
//   const pageWidth = pdf.internal.pageSize.getWidth();
//   const pageHeight = pdf.internal.pageSize.getHeight();
//   const imgProps = pdf.getImageProperties(imgData);
//   const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

//   let heightLeft = pdfHeight;
//     let position = 0;


//   pdf.addImage(imgData, "PNG", 0, position, pageWidth, pdfHeight);

//   // 3. Télécharger localement
//   heightLeft -= pageHeight;

//     while (heightLeft > 0) {
//       position = heightLeft - pdfHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, 'PNG', 0, position, pageWidth, pdfHeight);
//       heightLeft -= pageHeight;
//     }

//   pdf.save(`Rapport_${new Date().toLocaleDateString()}.pdf`);

//   // 4. Envoyer au backend pour stockage
//   const pdfBlob = pdf.output("blob");
//   const file = new File([pdfBlob], `Rapport_${new Date().toISOString()}.pdf`);
//   await uploadRapport(file, selectedFarm._id); // selectedFarm._id = id de ta ferme
// };
const handleDownloadAndUpload = async () => {
  const element = reportRef.current;

  if (!element) return;

  // 🔥 On enlève temporairement le scroll pour capturer toute la hauteur
  const originalOverflow = element.style.overflow;
  const originalHeight = element.style.height;

  element.style.overflow = "visible";
  element.style.height = "auto";

  // 1️⃣ Capture toute la hauteur réelle
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    scrollY: -window.scrollY,
    height: element.scrollHeight,
    windowHeight: element.scrollHeight
  });

  element.style.overflow = originalOverflow;
  element.style.height = originalHeight;

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  const fileName = `Rapport_${new Date().toLocaleDateString()}.pdf`;
  pdf.save(fileName);

  const pdfBlob = pdf.output("blob");
  const file = new File([pdfBlob], fileName);
  await uploadRapport(file, selectedFarm._id);
};
  {/* 
  // Générer PDF du rapport
  const downloadPDF = async () => {
    const element = reportRef.current;

    // On capture le contenu entier, même si scroll
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pageWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Rapport_${new Date().toLocaleDateString()}.pdf`);
  };

  */}

  return (
    <>
      <BarSide />

      <div className="board-container" ref={reportRef}>
        <h2>📄 Rapport complet des capteurs & recommandations</h2>

        {/* Sélecteur de ferme */}
        {/* <div className="farm-selector">
          {showDropdown ? (
            <select
              value={selectedFarm?._id || ''}
              onChange={(e) => {
                const farm = farms.find((f) => f._id === e.target.value);
                setSelectedFarm(farm);
                setShowDropdown(false);
              }}
            >
              <option value="">Sélectionnez une ferme</option>
              {farms.map((farm) => (
                <option key={farm._id} value={farm._id}>
                  {farm.name}
                </option>
              ))}
            </select>
          ) : (
            <div
              className="farm-icon"
              onClick={() => setShowDropdown(true)}
              title="Changer de ferme"
            >
              🌾 {selectedFarm?.name} <FaCaretDown />
            </div>
          )}
        </div> */}
        <FormControl fullWidth sx={{ mb: 3, maxWidth: 400 }}>
  <InputLabel id="farm-select-label" sx={{ 
    fontSize: '16px',
    transform: 'translate(14px, 14px) scale(1)',
    '&.Mui-focused, &.MuiFormLabel-filled': {
      transform: 'translate(14px, -9px) scale(0.75)'
    }
  }}>
  </InputLabel>
  <Select
    labelId="farm-select-label"
    id="farm-select"
    value={selectedFarm || ''}
    label="Sélectionnez une ferme"
    onChange={(e) => setSelectedFarm(e.target.value)}
    sx={{
      height: 48, 
      fontSize: '16px',
      '& .MuiSelect-select': {
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center'
      }
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          maxHeight: 300, // Hauteur maximale du menu déroulant
          '& .MuiMenuItem-root': {
            fontSize: '15px',
            padding: '10px 16px',
            minHeight: 'auto'
          }
        }
      }
    }}
  >
    {farms.map((farm) => (
      <MenuItem 
        key={farm._id} 
        value={farm._id}
        sx={{
          fontSize: '15px',
          padding: '10px 16px'
        }}
      >
        {farm.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
  {/* select product of farm */}
<FormControl fullWidth sx={{ mb: 3, maxWidth: 400 }}>

  <Select
    labelId="product-select-label"
    id="product-select"
    value={selectedProduct || 'null'}
    label="Sélectionnez un produit"
    onChange={(e) => setSelectedProduct(e.target.value)}
    sx={{
      height: 48,
      fontSize: '16px',
      '& .MuiSelect-select': {
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
      },
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          maxHeight: 300,
          '& .MuiMenuItem-root': {
            fontSize: '15px',
            padding: '10px 16px',
            minHeight: 'auto',
          },
        },
      },
    }}
    >
    {products.length === 0 ? (
      <MenuItem disabled value="null">Aucun produit disponible</MenuItem>
    ) : (
    products.map((product) => (
      <MenuItem
        key={product._id}
        value={product._id}
        sx={{
        fontSize: '15px',
        padding: '10px 16px',
        }}
        >
        {product.name}
      </MenuItem>
    ))
    )}
  </Select>
</FormControl>
<FormControl fullWidth sx={{ mb: 3, maxWidth: 400 }}>
  <Select
    labelId="hour-select-label"
    id="hour-select"
    value={hour || ''}
    label="Sélectionnez un produit"
    onChange={(e) => setHour(e.target.value)}
    sx={{
    height: 48,
    fontSize: '16px',
    '& .MuiSelect-select': {
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      },
    }}
    MenuProps={{
      PaperProps: {
      sx: {
        maxHeight: 300,
        '& .MuiMenuItem-root': {
          fontSize: '15px',
          padding: '10px 16px',
          minHeight: 'auto',
        },
      },
      },
    }}
    >
    <MenuItem value="24">jour</MenuItem>
    <MenuItem value="168">semaine</MenuItem>
    <MenuItem value="720">mois</MenuItem>
    <MenuItem value="8766">année</MenuItem>
    <MenuItem value="live">temps réel</MenuItem>
  </Select>
</FormControl>
        {/* Section Graphiques */}
        <div className="charts-grid">
          <div className="chart-card">
            <AdvancementChart sensorId={selectedsensor} key={`${selectedsensor}-${hour}`} type={"temperature"} hour={hour} time={15000}/>
          </div>
          <div className="chart-card">
            <AdvancementChart sensorId={selectedsensor} key={`${selectedsensor}-${hour}`} type={"humidity"} hour={hour} time={15000}/>
          </div>
          <div className="chart-card">
            <AdvancementChart sensorId={selectedsensor} key={`${selectedsensor}-${hour}`} type={"Ph"} hour={hour} time={15000}/>
          </div>
          <div className='chart-card'>
            <AdvancementChart sensorId={selectedsensor} key={`${selectedsensor}-${hour}`} type={"conductivity"} hour={hour} time={15000}/>
          </div>
          <div className="chart-card full-width">
            <CombinedChart sensorId={selectedsensor} key={`${selectedsensor}-${hour}`} hour={hour} time={15000}/>
          </div>
        </div>

        {/* Tableau des recommandations */}
        <div className="recommendations-section">
          <h3>📌 Recommandations (dernières 24h)</h3>
          <table className="recommendations-table">
            <colgroup>
              <col style={{ width: '10%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '60%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Ferme</th>
                <th>Date</th>
                <th>Culture</th>
                <th>Recommandation</th>
              </tr>
            </thead>
            <tbody>
              <h2>
                pas charger voir report.js ligne 474
              </h2>
              {/* Liste des reco */}
              {/* {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <tr key={index}>
                    <td>{rec.farm?.name || selectedFarm?.name || '—'}</td>
                    <td>{new Date(rec.createdAt).toLocaleString()}</td>
                    <td>{rec.productName || '—'}</td>
                    <td>{rec.message}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    Aucune recommandation trouvée
                  </td>
                </tr>
              )} */}
            </tbody>
          </table>
        </div>

        {/* Boutons d'actions */}
        <div className="report-actions">
          <button className="btn-download" onClick={handleDownloadAndUpload}>
            📥 Télécharger PDF
          </button>
          <button className="btn-print" onClick={() => window.print()}>
            🖨️ Imprimer
          </button>
        </div>
      </div>
    </>
  );
};

export default Report;

