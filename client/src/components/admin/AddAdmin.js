import { AddModerator, Clear, Password } from "@mui/icons-material"
import styles from '../../contexts/styles/AddAdmin.module.css';
import { useEffect, useState } from "react";

const AddAdmin = ({admin}) =>{
    const [isOpen,setIsOpen]=useState(false);
    const [newAdmin,setNewAdmin]=useState(null);
    const [send,setSend]=useState(false);
    const defaultAdmin =()=>{
        setNewAdmin({
                firstName:`ADMIN-${Date.now()}`,
                lastName:`ADMIN-${Date.now()}`,
                userRole:"ADMIN",
            })
    }
    const addField =(key,value)=>{
        const validField=["phone","email","password"]
        if(validField.includes(key)){
            setNewAdmin(prev=>({...prev,[key]:value}))
        }
    }
    useEffect(()=>{
        if(!newAdmin){
            defaultAdmin()
        }
    },[])
    useEffect(()=>{
        if(newAdmin){
            const {phone,email,password}=newAdmin;
            if(phone && email && password){
                admin(newAdmin);
            }
            else{
                admin({error:"One or more fields are unset"})
            }
        }
        defaultAdmin();
        setSend(false)
    },[send])
    return(
        <div className={styles.addAdminMainContainer}>
            <div className={styles.btnContainer}>
                {isOpen?<>
                    <div className={styles.clickable} onClick={()=>{setIsOpen(!isOpen); setSend(true);}}>
                        <AddModerator/>
                    </div>
                    <div className={styles.clickable} onClick={()=>{setIsOpen(!isOpen); defaultAdmin();}}>
                        <Clear/>
                    </div>
                </>
                :
                <div className={styles.clickable} onClick={()=>{setIsOpen(!isOpen); }}>
                    <AddModerator />
                </div>
                }
            </div>
            {isOpen?
                <div className={styles.inputContainer}>
                    <input name="phone" onChange={(e)=>addField(e.target.name,e.target.value)} placeholder="Phone"/>
                    <input name="email" onChange={(e)=>addField(e.target.name,e.target.value)} placeholder="Email"/>
                    <input name="password" onChange={(e)=>addField(e.target.name,e.target.value)} placeholder="Password"/>
                </div>
            :""}
        </div>
    )
}
export default AddAdmin;