import React, { useState, useEffect } from 'react';
import '../../contexts/styles/Interface.css';
import Products from '../products/Products';
import HeaderSection from './HeaderSection';
import NavigationBottom from './NavigationBottom';
import ProductSensorTabs from './ProductSensorTabs';
import { fetchFarmsByUser } from '../../services/api';
import Tank from '../tanks/Tank';
const Interface = ({ selectedFarmId,setSelectedFarmId }) => {
  const [farms, setFarms] = useState([]);


  useEffect(() => {
    const loadFarms = async () => {
      try {
        const data = await fetchFarmsByUser(localStorage.getItem('userId'));
        setFarms(data);
      } catch (err) {
        console.error("Erreur chargement fermes:", err);
        setFarms([]);
      }
    };
    loadFarms();
  }, []);

  const selectedFarm = farms.find(farm => farm._id === selectedFarmId);
  return (
<div className="body">
  <div className="head-section section">
  <HeaderSection
  selectedFarm={selectedFarm} />
  </div>

  <div className="horizontal-split">
  {/* <div className="vertical-split top-left section"> */}
  <Tank tankType={"WATER"} farmId={selectedFarmId}/>

  {/* <TopLeftSection /> ph température etc de la ferme qui sert plus vrm*/}
  {/* <div className="vertical-divider"></div> */}
  {/* </div> */}
  {/* <div className="vertical-split top-right section"> */}
  <Tank tankType={"FERTILIZER"} farmId={selectedFarmId} />
  {/* <TopRightSection /> partie qui redirige vers recommandations */}
  {/* </div> */}
  </div>

  {/* <Products farmId={selectedFarmId}/> */}
  {/*<Sensor/>*/}
  <ProductSensorTabs farmId={selectedFarmId}/>
  <NavigationBottom onFarmSelect={setSelectedFarmId} selectedFarmId={selectedFarmId}/>
</div>
  );
};

export default Interface;
