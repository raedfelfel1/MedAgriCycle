import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchProductById,fetchSensorHistory,fetchSensorsByProduct } from "../../services/api";
import BarSide from "../ui/BarSide";
import styles from '../../contexts/styles/ShowProduct.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button } from "@mui/material";
import { Gauge,gaugeClasses, GaugeValueText  } from '@mui/x-charts/Gauge';
const ShowProduct=()=>{
    const location = useLocation();
    const navigate = useNavigate();
    const id = location.state?.id;
    
    const [product,setProduct]=useState(null);
    const [sensor,setSensor]=useState([])
    const [sensorData,setSensorData]=useState(null)
    const NO_PRINT=["_id","__v","id","farm","fertilizerTank","waterTank","name"]
    const loadProduct= async()=>{
        try {
            const data= await fetchProductById(id)
            setProduct(data.data)
        } catch (error) {
            console.error(`Error : ${error.message}`)
        }
    }
    const loadSensor=async()=>{
        try {
            const sensor =await fetchSensorsByProduct(id)
            setSensor(sensor)
        } catch (error) {
            console.error(`Error : ${error.message}`)
        }
    }
    const loadLastDataOfSensor=async()=>{
        if(!sensor[0]) return
        try {
            const data = await fetchSensorHistory(sensor[0]?._id,"live")
            setSensorData(data);
        } catch (error) {
            console.error(`Error : ${error.message}`)
        }
    }
    useEffect(()=>{
        if(!id){
            navigate("/informationsProduit")
            return
        }
        loadSensor();
        loadProduct();
    },[])
    useEffect(()=>{
        if(!sensor[0]) return;
        loadLastDataOfSensor()
        const interval = setInterval(() => {
            const data = loadLastDataOfSensor()
            setSensorData(data);
        }, 5000);
        return () => clearInterval(interval);
    },[sensor])
    return(
        <>
            <BarSide/>
            <div className={styles.showProduct}>
                <div className={styles.navigation}>
                    {product?.name}
                    <div className={styles.backBtnContainer}>
                        <Button onClick={()=>navigate("/informationsProduit")}>
                            <CloseIcon/>
                        </Button>
                    </div>
                </div>
                <div className={styles.coreContainer}>
                    <div className={styles.currentData}>
                        <div className={styles.gauge}>
                            <p>ph</p>
                            <Gauge
                                value={sensorData?.[0]?.ph??0}
                                startAngle={-90}
                                endAngle={90}
                                height={200}
                                valueMax={14}
                                sx={{
                                    GaugeValueText: {
                                    fontSize: 40,
                                    transform: 'translate(0px, 0px)',
                                    },
                                    '& .MuiGauge-valueArc': {
                                        fill: '#f87171',
                                    },
                                    
                                }}
                                text={`${sensorData?.[0]?.ph??0}`}
                            />
                        </div>
                        <div className={styles.gauge}>
                            <p>temperature</p>
                            <Gauge
                                value={sensorData?.[0]?.temperature??0}
                                startAngle={-90}
                                endAngle={90}
                                height={200}
                                valueMax={50}
                                sx={{
                                    GaugeValueText: {
                                    fontSize: 40,
                                    transform: 'translate(0px, 0px)',
                                    },
                                    '& .MuiGauge-valueArc': {
                                        fill: '#60a5fa',
                                    },
                                }}
                                text={`${sensorData?.[0]?.temperature??0}`}
                            />
                        </div>
                        <div className={styles.gauge}>
                            <p>humidity</p>
                            <Gauge
                                value={sensorData?.[0]?.humidity??0}
                                startAngle={-90}
                                endAngle={90}
                                height={200}
                                valueMax={1}
                                sx={{
                                    GaugeValueText: {
                                    fontSize: 40,
                                    transform: 'translate(0px, 0px)',
                                    },
                                    '& .MuiGauge-valueArc': {
                                        fill: '#34d399',
                                    },
                                }}
                                text={`${(sensorData?.[0]?.humidity??0)*100}`}
                            />
                        </div>
                        <div className={styles.gauge}>
                            <p>conductivity</p>
                            <Gauge
                                value={sensorData?.[0]?.conductivity??0}
                                startAngle={-90}
                                endAngle={90}
                                height={200}
                                valueMax={100}
                                sx={{
                                    GaugeValueText: {
                                    fontSize: 40,
                                    transform: 'translate(0px, 0px)',
                                    },
                                    '& .MuiGauge-valueArc': {
                                        fill: "#fc08c7",
                                    },
                                }}
                                text={`${sensorData?.[0]?.conductivity??0}`}
                            />
                        </div>
                    </div>
                    <div className={styles.productInformation}>
                        {Object.entries(product||{}).map(([key,value])=>{
                            if(NO_PRINT.includes(key)) return
                            return <div key={key} className={styles.field}>{key} 
                            : {key=="createdAt"?new Date(value).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }):value}</div>
                        })}
                        <div className={styles.field}>Sensor : {sensor[0]?.sensor_id?sensor[0]?.sensor_id:"No sensor link"}</div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ShowProduct;
