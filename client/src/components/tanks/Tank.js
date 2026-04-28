import Button from '@mui/material/Button';
import { styled } from "@mui/material/styles";
import { fetchTanksByFarm } from '../../services/api';
import { useEffect, useState } from 'react';
import styles from "../../contexts/styles/Tank.module.css"
import { Link, Navigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from "../../contexts/ThemeContext";

const ActionButton = styled(Button)({
  backgroundColor: "#00FF00",
  color: "#108110",
  fontWeight: "bold",
  fontSize: "0.75rem",   
  minWidth: "auto",
  height:"5vh",  
  width:"5vh",    
  "&:hover": {
    backgroundColor: "#108110",
    color: "#00FF00",
  }
});

const Tank = ({tankType,farmId}) => {
    const {darkMode}=useTheme()
    const [tankOfFarm,setTankOfFarm]=useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(()=>{
        try {
            if(farmId){
            const loadTanks=(async ()=>{
                let loadTanks = await fetchTanksByFarm(farmId);
                if(loadTanks?.message){
                    setTankOfFarm([])
                }
                else{
                switch (tankType) {
                    case "WATER":
                        loadTanks=loadTanks.filter((tank)=> tank.type == "water" || tank.type == "water_fertilizer");
                        break;
                    case "FERTILIZER":
                        loadTanks=loadTanks.filter((tank)=> tank.type == "fertilizer" || tank.type == "water_fertilizer");
                        break;
                    default:
                        throw new Error("Vous n'avez pas spécifier un type correct de tank");
                }
                setTankOfFarm(loadTanks)}
            })
            loadTanks()}
        }catch (error) {
            console.error("pas de tanks")
            setTankOfFarm([])
            setError("Pas de tank")
        }
        finally {
            setLoading(false);
        }
    },[farmId])
    let component=(
        <>
            <div>
                Veuillez spécifier le type de tank à afficher
            </div>
        </>
    );
    if (loading) {
        component= <div>Chargement...</div>;
    }
    else{
        if(tankType=="FERTILIZER" || tankType=="WATER"){
            component =(
                <>
                    <div className={styles.tankComponent}>
                        <div className={styles.headerTankComponent}>
                            <div>
                                <p>Réservoirs d'{tankType == "WATER" ? "eau" : "engrais"}</p>
                            </div>
                            <div className={styles.btnContainer}>
                                <ActionButton
                                    component={Link}
                                    to="/addTank"
                                    onClick={() => {
                                        localStorage.setItem(
                                            "tankType",
                                            tankType == "FERTILIZER" ? "fertilizer" : "water"
                                        );
                                    }}
                                >
                                    <AddIcon/>
                                </ActionButton>
                            </div>
                        </div>

                        <div className={`${styles.tankCardContainer} ${darkMode?styles.dark:""}`}>
                            {tankOfFarm.map((tank) => (
                                <div className={`${styles.tankCard} ${darkMode?styles.darkContainer:""}`} key={tank._id}>
                                    <Button
                                        component={Link}
                                        to="/showTank"
                                        onClick={() => {
                                            localStorage.setItem("SelectedTank", tank._id);
                                        }}
                                    >
                                        <p>{tank.name}</p>
                                        <VisibilityIcon/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )
        }
    }
    return component
}
export default Tank;