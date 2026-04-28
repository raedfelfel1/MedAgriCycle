import React, { useState, useEffect } from "react";
import { Box,Slider,Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import styles from "../../contexts/styles/IrrigationComponent.module.css";
import {  fetchTankHistoryByTank,createTankHistory } from "../../services/api";
import TankContainer from "./TankContainer";
import { useTheme } from "../../contexts/ThemeContext";
const IrrigationComponent = ({tank,linkedProducts}) => {
  const {darkMode}=useTheme()
  const [waterLevel, setWaterLevel] = useState(0);
  const [data,setData]=useState({quantity:5});
  const [tankHistoric,setTankHistoric]=useState([]);
  const[showTankHistory,setShowTankHistory]=useState(<></>)
  const Action = tank.type=="water"?["fill", "irrigate"]:tank.type=="fertilizer"?["fill", "fertilize"]:["fill","water_fertilizer"];
  // =============================
  // Styled Water Tank
  // =============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };
  // =============================
  // UI
  // =============================
  useEffect(()=>{
    const loadHistorics=async()=>{
      try {
            if(!tank?._id) return
            const historics =await fetchTankHistoryByTank(tank._id);
            setTankHistoric(historics)
            setWaterLevel(historics.length?historics[historics.length-1].newLevel:0)
        } catch (error) {
            console.error("Une erreur est survenu",error.message)
        }
    }
    loadHistorics()
  },[tank])
  const sendAction=async()=>{
    const {productId,action,quantity}=data;
    const product=action=="fill"?null:productId
    try{
      if(!action||!quantity){
        throw new Error(`Invalid data: ${JSON.stringify(data)}`);
      }
      if(!Action.includes(action)){
        throw new Error("Unknown action");
      }
      let newLevel=waterLevel;
      console.log("action",action)
      const isConsumptionAction=["irrigate","fertilize","water_fertilizer"].includes(action);
      if(isConsumptionAction){
        newLevel-=quantity;
      }else{
        newLevel+=quantity;
      }
      if(newLevel<0||newLevel>tank.capacity){
        throw new Error("Tank level cannot be negative or exceed tank capacity");
      }

      setWaterLevel(newLevel);

      const dataToSend=await createTankHistory(
        tank._id,
        product,
        quantity,
        newLevel,
        action,
      );
      setTankHistoric(prev =>[...prev,dataToSend]);
    } catch(error){
      console.error("Error:",error.message);
    }
  };
  useEffect(()=>{
    setShowTankHistory(<>
      {
      tankHistoric.length>0?
      tankHistoric.map((historic)=>(
      <div key={historic._id} className={`${styles.dataCard} ${darkMode?styles.dark:""}`}>
        <p>
          {historic.action} ( {historic.quantity} {tank.unit} )  on : {
            new Date(historic.timestamp).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
        </p>
      </div>
      ))
      :
      <div className={styles.noDataFound}>
        <p>No information available</p>
      </div>
      }
      </>)
  },[tankHistoric])
  return (
    <>
      <div className={styles.IrrigationComponent}>
        <div>
          <div className={`${styles.waterTankContainer} ${darkMode?styles.dark:""}`}>
            <TankContainer waterLevel={waterLevel} type ={tank.type}>
              <div className={styles.waterLevelIndicator}>
                <h3>{waterLevel}%</h3>
              </div>
            </TankContainer>
            <div>
              <p>Capacity : {waterLevel} / {tank.capacity}{tank.unit}</p>
            </div>
          </div>
          <div className={`${styles.selectorContainer} ${darkMode?styles.dark:""}`}>
            {/* ["fill", "irrigate", "fertilize", "empty", "maintenance"] */}
            <select defaultValue={"default"} onChange={handleChange} name="action" required>
              <option value="default" disabled>Select a action</option>
              {Action.map((act)=>(
                <option value={act}>{act}</option>
              ))}
            </select>
            <select defaultValue={"default"} onChange={handleChange} name="productId" required>
              <option value="default" disabled>Select a product</option>
              {linkedProducts.map((product)=>(
                <option key={product._id} value={product._id}>{product.name}</option>
              ))}
            </select>
            <Slider
              name="quantity"
              value={data.quantity}
              onChange={(change)=>(handleChange(change))}
              aria-labelledby="irrigation-slider"
              min={0}
              max={data.action=="fill"?Math.max(tank.capacity-waterLevel):Math.min(tank.capacity, waterLevel)}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={sendAction}
              size="large"
              fullWidth
              className={styles.IrrigateButton}
            >
            {data?.action?`${data.action} of ${data.quantity} ${tank.unit}`:"Select a action"}
            </Button>
          </div>
        </div>
        <div className={`${styles.historicContainer} ${darkMode?styles.dark:""}`}>
          <div className={styles.title}>
            <h2 className={`${darkMode?styles.dark:""}`}>historic</h2>  
          </div>
          <div className={styles.contentHistoricDataContainer}>
            {showTankHistory}
          </div>
        </div>
      </div>
    </>
  );
};

export default IrrigationComponent;
