import {
    PropaneTank,
    GrassOutlined,
    AccountCircleOutlined,
    Sensors,
    Inventory,
    Dashboard,
    Logout,
} from '@mui/icons-material';
import styles from '../../contexts/styles/AdminBarSide.module.css';
import AdminSideBarCategory from './AdminSideBarCategory';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
const AdminBarSide = ({category})=>{
    const [selectedCategory,setSelectedCategory]=useState("Accounts");
    const navigate = useNavigate();
    useEffect(()=>{
        category(selectedCategory);
    },[selectedCategory])
    return(
        
        <div className={styles.adminBarSide}>
            <div className={styles.title}>
                <h3>🌿 Administrator Pannel E-FARM</h3>
            </div>
            <nav className={styles.nav}>
                <AdminSideBarCategory label={"Accounts"}  selectedCategory={selectedCategory} change={setSelectedCategory}>                
                    <AccountCircleOutlined/>
                    <p className={styles.label}>Account</p>
                </AdminSideBarCategory>
                <AdminSideBarCategory label={"Tanks"}  selectedCategory={selectedCategory} change={setSelectedCategory}>                
                    <PropaneTank/>
                    <p className={styles.label}>Tanks</p>
                </AdminSideBarCategory>
                <AdminSideBarCategory label={"Products"}  selectedCategory={selectedCategory} change={setSelectedCategory}>                
                    <Inventory/>
                    <p className={styles.label}>Products</p>
                </AdminSideBarCategory>
                <AdminSideBarCategory label={"Sensors"}  selectedCategory={selectedCategory} change={setSelectedCategory}>                
                    <Sensors/>
                    <p className={styles.label}>Sensors</p>
                </AdminSideBarCategory>
                <AdminSideBarCategory label={"Farms"}  selectedCategory={selectedCategory} change={setSelectedCategory}>                
                    <GrassOutlined/>
                    <p className={styles.label}>Farms</p>
                </AdminSideBarCategory> 
                <AdminSideBarCategory label={"Dashboard"} change={()=>(navigate("/board", { replace: true }))}>
                    <Dashboard/>
                    <p className={styles.label}>My User Dashboard</p>
                </AdminSideBarCategory> 
            </nav>
        </div>
    )
}
export default AdminBarSide;