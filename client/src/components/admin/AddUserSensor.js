import { useEffect, useState } from 'react';
import styles from '../../contexts/styles/AddUserSensor.module.css';
import { fetchSensors,updateSensor} from '../../services/api';
import {Add,Remove} from '@mui/icons-material';
import {
    Button,
  TextField,
} from '@mui/material';
const AddUserSensor=({user})=>{
    const [sensors,setSensors]=useState([]);
    const [searchList,setSearchList]=useState([]);
    const [selectedList,setSelectedList]=useState([])
    const loadSensors = async()=>{
        try {
            const sensorsList = await fetchSensors();
            const available= sensorsList.filter(sensor=>sensor.user==null && sensor.product==null);
            console.log("available",available)
            setSensors(available);
            setSearchList(available);
        } catch (error) {
            console.error(`erreur : ${error}`);
        }
    }
    const addSensorsToUser=async ()=>{
        selectedList.map(async(sensor)=>{
            sensor.user=user;
            try {
                await updateSensor(sensor._id,sensor);
                loadSensors();
            } catch (error) {
                console.error("Erreur",error.message);
            } 
        })
    }
    const filterSensor=(search)=>{
        const liste=search!=""?sensors.filter(sensor=>sensor.sensor_id.includes(search)):sensors
        setSearchList(liste);
    }
    useEffect(()=>{   
        loadSensors();
    },[])
    useEffect(()=>{   
            console.log(selectedList)
        },[selectedList])
    return(
        <>
            <div className={styles.AddUserSensorContainer}>
                <div className={styles.search}>
                    <TextField label="Search by MAC address" onChange={(search)=>filterSensor(search.target.value)}></TextField>
                </div>
                <div className={styles.main}>
                    {searchList.map(sensor=>
                        <div key={sensor.sensor_id} className={`${styles.sensorContainer}`}>
                            <div className={`${styles.sensorField} ${selectedList.includes(sensor.sensor_id)?styles.selected:""}`}>
                                {sensor.sensor_id}
                            </div>
                            <div className={styles.btn}>
                                {!selectedList.includes(sensor)?<Add onClick={()=>setSelectedList(prev=>prev.some(current=>current._id === sensor._id) ? prev : [...prev,sensor])}/>
                                :<Remove onClick={()=>setSelectedList(prev=>prev.filter(current=>current._id !== sensor._id))}/>}
                            </div>
                        </div>
                    )}
                    <div className={styles.submit}>
                        <Button onClick={addSensorsToUser}>Ajouter à l'utilisateur</Button>
                    </div>
                </div>
            </div>
        </>
    );
}
export default AddUserSensor