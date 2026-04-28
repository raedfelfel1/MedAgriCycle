import {
    KeyboardArrowUp,
    KeyboardArrowDown,
    Delete,
    Info,
} from '@mui/icons-material';
import { Children } from 'react';
import React, { useState, useEffect } from 'react';
import styles from '../../contexts/styles/Card.module.css';
import { Button } from '@mui/material';
const Card = ({children,placeholder,show,activeCard,id,deleteData,category,showUser,label=false})=>{
    const [editMode,setEditMode]=useState(false);
    const [isVisible,setIsVisible]=useState(label)
    useEffect(()=>{
        setIsVisible(id==activeCard)
    },[activeCard])
    return(
        <div className={`${styles.categoryContainer} ${!label?styles.pointer:""}`}  onClick={()=>(!label?showUser({id:id}):"")}>
            {!label?<div onClick={()=>{ show(id); setIsVisible(!isVisible);}} className={styles.basicCategoryInformation}>
                {placeholder}
                <div className={styles.toggleBtn}>
                    {!isVisible?<KeyboardArrowDown/>
                    :<KeyboardArrowUp/>}
                </div>
            </div>:<div className={styles.basicCategoryInformation}>{placeholder}</div>}
            <div className={`${styles.details} ${isVisible?styles.show:''}`}>
                <div className={`${styles.categoryDetailsInformation} ${label?styles.label:""}`}>
                    {Children.map(children, child => (
                        <div className={styles.field}>{child}</div>
                    ))}
                </div> 
            </div>
        </div>
    )
}
export default Card;