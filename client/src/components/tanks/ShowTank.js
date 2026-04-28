import { useEffect, useState } from "react";
import BarSide from "../ui/BarSide"
import { Button } from "@mui/material";
import { Link } from 'react-router-dom';
import { styled} from "@mui/material/styles";
import {  fetchProductsByTank, fetchTankById,updateProduct,deleteTank,updateTank } from "../../services/api";
import styles from "../../contexts/styles/ShowTank.module.css"
import  IrrigationComponent from "./IrrigationComponent.js";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTheme } from "../../contexts/ThemeContext";
const ShowTank = ()=>{
    const {darkMode}=useTheme()
    const [tank,setTank]=useState({})
    const [linkedProducts,setLinkedProducts]=useState([])
    const [editMode,setEditMode]=useState(false)
    const [editTank,setEditTank]=useState({});
    const ActionButton = styled(Button)({
    backgroundColor: "#2563eb",
    color: "#f7f7f7",
    fontWeight: "bold",
    fontSize: "0.75rem",   
    minWidth: "auto",
    height:"5vh",  
    width:"5vh",    
    "&:hover": {
        backgroundColor: "#1565c0",
    }
    });
    const updateCurrentTank=async()=>{
        try {
            const current = await updateTank(editTank._id,editTank)
            setTank(current)
            setEditMode(false)
        } catch (error) {
            
        }
    }
    const handleChange=(e)=>{
        const {name,value}=e.target
        setEditTank(prev=>({...prev,[name]:value}))
    }
    useEffect(()=>{
        setEditTank(tank)
    },[editMode])
    useEffect(()=>{
        console.log(editTank)
    },[editTank])
    const deleteCurrentTank = async()=>{
        try {
            if(!tank) return
            await deleteTank(tank._id);
        } catch (error) {
            console.error("Une erreur est survenu",error.message)
        }
    }
    const SelectedTank=localStorage.getItem("SelectedTank");
    useEffect(()=>{
        const loadTank=async ()=>{
            if (SelectedTank) {
                try {
                    const current_tank = await fetchTankById(SelectedTank);
                    setTank(current_tank);
                } catch (error) {  
                }
            }
        }
        const loadLinkedProduct=async ()=>{
            try {
                const linkedProducts = await fetchProductsByTank(SelectedTank)
                setLinkedProducts(linkedProducts);
            } catch (error) {
                
            }
        }
        loadLinkedProduct();
        loadTank();
    },[])
    const deleteLinkedProductLink=async (idProduct) =>{
        const product = linkedProducts.find(
            (product) => product._id == idProduct)
            console.log("le produit",product)
        if(product){
            try {
                console.log("le tank",tank)
                switch (tank.type) {
                    case "water":
                        product.waterTank=null  
                        break;
                    case "fertilizer":
                        product.fertilizerTank=null  
                        break;
                    default:
                        product.waterTank=null
                        product.fertilizerTank=null  
                        break;
                }
                await updateProduct(product._id,product)
                const updatedProducts = linkedProducts.filter(
                    product => product._id.toString() !== idProduct
                );
                setLinkedProducts(updatedProducts);
            } catch (error) {   
            }
        }
    }

    return (<>
        <BarSide/>
        <div className={`${styles.showTankContainer} ${darkMode?styles.dark:""}`}> 
            <div className={`${styles.headerTankContainer} ${darkMode?styles.dark:""}`}>
                <div className={styles.backBtnContainer}>
                    <ActionButton component={Link} to="/farm">
                        <ArrowBackIosIcon/>
                    </ActionButton>
                </div>
                <div className={styles.BtnContainer}>
                    <ActionButton onClick={deleteCurrentTank} component={Link} to="/farm">
                        <DeleteIcon/>
                    </ActionButton>
                </div>
                {editMode?<input className={styles.updateInput} name="name" value={editTank.name} onChange={handleChange}></input>:<h1>{tank.name}</h1>}
            </div>

            <div className={styles.coreTankContainer}>
                <div className={styles.informationTankContainer}>
                    <div className={styles.BtnContainer}>
                        {!editMode?
                            <ActionButton onClick={()=>setEditMode(true)}>
                                <EditIcon/>
                            </ActionButton>
                        :
                        <>
                            <ActionButton onClick={updateCurrentTank}>
                                <CheckIcon/>
                            </ActionButton>
                            <ActionButton onClick={()=>setEditMode(false)}>
                                <CloseIcon/>
                            </ActionButton>
                        </>
                        }
                    </div>
                    {editMode?
                        <div className={styles.informationDataTankContainer}>
                            <h2 className={`${darkMode?styles.dark:""}`}>Tank Information</h2>
                            <p>Capacity :</p> <input name="capacity" onChange={handleChange} className={styles.updateInput} value={editTank.capacity}/><input name="unit" onChange={handleChange} className={styles.updateInput} value={editTank.unit}/>
                            <p>Type : {tank.type}</p>
                            <p>Liquid type :</p> <input name="liquidType" onChange={handleChange} className={styles.updateInput} value={editTank.liquidType}/>
                            <p>
                                Creating Date : {new Date(tank.createdAt).toLocaleDateString("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        :
                        <div className={styles.informationDataTankContainer}>
                            <h2 className={`${darkMode?styles.dark:""}`}>Tank Information</h2>
                            <p>Capacity : {tank.capacity} {tank.unit}</p>
                            <p>Type : {tank.type}</p>
                            <p>Liquid type : {tank.liquidType}</p>
                            <p>
                                Creating Date : {new Date(tank.createdAt).toLocaleDateString("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    }
                </div>

                <div className={styles.IrrigationComponentContainer}>
                    <IrrigationComponent tank={tank} linkedProducts={linkedProducts}/>
                </div>
            </div>

            <div className={styles.partTitle}>
                <h2 className={`${darkMode?styles.dark:""}`}>Associate Product</h2>
            </div>

            <div className={styles.linkedProductContainer}>
                {linkedProducts.length > 0 ? linkedProducts.map((product) => (
                    <div className={`${styles.productCard} ${darkMode?styles.dark:""}`} key={product._id}>
                        <p>Product name : {product.name}</p>
                        <p>Product Type : {product.plant}</p>
                        <div className={styles.deleteLinkProductBtn}>
                            <ActionButton onClick={() => deleteLinkedProductLink(product._id)}>
                                <DeleteIcon/>
                            </ActionButton>
                        </div>
                    </div>
                )) :
                    <div className={styles.ProductReplaceText}>
                        <h3>Pas encore de produit assigné</h3>
                    </div>
                }
            </div>
        </div>
    </>)
}
export default ShowTank;