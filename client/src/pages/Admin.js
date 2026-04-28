import React, { useState, useEffect } from 'react';
import styles from '../contexts/styles/Admin.module.css';
import { 
    fetchUsers,fetchFarms,fetchTanks,fetchSensors,fetchProducts
    ,deleteUser,updateUser,createUser
    ,deleteTank,updateTank
    ,deleteProduct,updateProduct
    ,deleteSensor, updateSensor 
    ,deleteFarm,updateFarm
 } from '../services/api';
import AdminBarSide from '../components/admin/AdminBarSide';
import Informations from '../components/admin/Informations';
import AddAdmin from '../components/admin/AddAdmin';
import { ArrowBackIos, Dashboard } from '@mui/icons-material';
import ShowUser from '../components/admin/ShowUser';
import { useNavigate} from 'react-router-dom';

const Admin = ()=>{
    const navigate = useNavigate();
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    const [category,setCategory]=useState(null)
    const [categoryList,setCategoryList]=useState(null)
    const [usersList,setUsersList]=useState([]);
    const [farmsList,setFarmsList]=useState([]);
    const [sensorsList,setSensorsList]=useState([]);
    const [productsList,setProductsList]=useState([]);
    const [tanksList,setTanksList]=useState([]);
    const [message,setMessage]=useState(null);
    const [deleteData,setDeletedData]=useState(null);
    const [editData,setEditData]=useState(null);
    const [change,setChange]=useState(false)
    const [searchUser,setSearchUser]=useState("");
    const [searchList,setSearchList]=useState([]);
    const [optionSearch,setOptionSearch]=useState("");
    const [fieldSearch,setFieldSearch]=useState("");
    const [newAdmin,setNewAdmin]=useState(null)
    const [userInformation,setUserInformation]=useState(null);
    const [userData,setUserData]=useState(null)
    useEffect(()=>{
        console.log("userInfo??",userInformation)
        if(!userInformation) return

            // from user
            const user=usersList.find(user=>user._id==userInformation.id)
            // console.log("user :",user)
            const farms=farmsList.filter(farm=>farm.owner._id==user._id)
            // console.log("farms :",farms)
            const tanks = tanksList.filter(tank=>farms.some(farm=>tank.linkedFarm==farm._id))
            // console.log("tanks :",tanks)
            const products = productsList.filter(product=>farms.some(farm=>farm._id==product.farm))
            // console.log("products :",products)
            const sensors= sensorsList.filter(sensor=>products.some(product=>product._id==sensor.product))
            // console.log("sensors :",sensors)
            setUserData({
                user:user,
                farms:farms,
                tanks:tanks,
                products:products,
                sensors:sensors,
            })
    },[userInformation,editData,change])
    const addAdmin = async(data)=>{
        try {
            console.log("la data",data)
            if(!emailRegex.test(data.email) || !phoneRegex.test(data.phone)){
                throw new Error("Invalid or empty fields");
            }
            const res = await createUser(data)
            setUsersList(prev=>([...prev,res]))
            setChange(true)
            setMessage("create user successful")
        } catch (error) {
            setMessage(`${error.message}`)
        }
    }
    useEffect(()=>{
        if(newAdmin){
            addAdmin(newAdmin);
        }
    },[newAdmin])
    const fetchUsersList = async()=>{
        try {
            const users = await fetchUsers();
            setUsersList(users)
            setSearchList(users)
            // init default value
            setCategory("Accounts")
            setCategoryList(users)
        } catch (error) {
            
        }
    }
    const fetchFarmsList = async()=>{
        try {
            const farms = await fetchFarms();
            setFarmsList(farms)
        } catch (error) {
            
        }
    }
    const fetchSensorsList = async()=>{
        try {
            const sensors = await fetchSensors();
            setSensorsList(sensors)
        } catch (error) {
            
        }
    }
    const fetchTanksList = async()=>{
        try {
            const tanks = await fetchTanks();
            setTanksList(tanks)
        } catch (error) {
            
        }
    }
    const fetchProductsList = async()=>{
        try {
            const products = await fetchProducts();
            setProductsList(products.data)
        } catch (error) {
            
        }
    }
    const removeUser = async(data)=>{
        try {
            const res = await deleteUser(data)
            setUsersList(usersList.filter((user)=>user._id!=deleteData.data.id))
            setChange(true)
            setMessage("delete user successful")
        } catch (error) {
            setMessage(`${error.message}`)
        }
    }
    
    const removeTank = async(data)=>{
        try {
            const res = await deleteTank(data)
            setTanksList(tanksList.filter((tank)=>tank._id!=deleteData.data.id))
            setChange(true)
            setMessage("delete Tank successful")
        } catch (error) {
            setMessage("error :",error.message)
        }
    }
    
    const removeProduct = async(data)=>{
        try {
            const res = await deleteProduct(data)
            setProductsList(productsList.filter((product)=>product._id!=deleteData.data.id))
            setChange(true)
            setMessage("delete product successful")
        } catch (error) {
            setMessage("error :",error.message)
        }
    }
    
    const removeSensor = async(data)=>{
        try {
            const res = await deleteSensor(data)
            setSensorsList(sensorsList.filter((sensor)=>sensor._id!=deleteData.data.id))
            setChange(true)
            setMessage("delete sensor successful")
        } catch (error) {
            setMessage("error :",error.message)
        }
    }
    
    const removeFarm = async(data)=>{
        try {
            const res = await deleteFarm(data)
            setFarmsList(farmsList.filter((farm)=>farm._id!=deleteData.data.id))
            setChange(true)
            setMessage("delete farm successful")
        } catch (error) {
            setMessage("error :",error.message)
        }
    }
    const modifyUser = async(data)=>{
        try {
            console.log("la data modif",data)
            if(!emailRegex.test(data.email) || !phoneRegex.test(data.phone) || !nameRegex.test(data.firstName) || !nameRegex.test(data.lastName)){
                throw new Error("Invalid or empty fields");
            }
            const res = await updateUser(data.id,data)
            setUsersList(prev=>prev.map(user=>
                    user._id == editData.data.id?
                    {...user,...editData.data}:
                    user
                ))
            setChange(true)
            setMessage("update user successful")
        } catch (error) {
            setMessage(`${error.message}`)
        }
    }
    useEffect(()=>{
        console.log("change",change)
        setCategoryList(usersList)
        setChange(false)
    },[change])
    useEffect(()=>{
        console.log("userInformation",userInformation)

    },[userInformation])
    const modifyTank = async(data)=>{
            try {
                const type=["water","fertilizer"];
                const liquidType=[
                    "eau douce",
                    "eau de pluie",
                    "eau recyclée",
                    "eaux usées",
                    "azote",
                    "phosphate",
                    "potassium",
                    "organique"]
                // if(!type.includes(data.type) || !liquidType.includes(data.liquidType)){
                //     console.log("erreur ici")
                //     throw new Error("Invalid or empty fields");
                // }
                const res = await updateTank(data._id,data)
                setTanksList(prev=>prev.map(tank=>
                    tank._id == editData.data.id?
                    {...tank,...editData.data}:
                    tank
                ))
                setChange(true)
                setMessage("update Tank successful")
            } catch (error) {
                setMessage(`${error.message}`)
            }
    }
    const modifyProduct = async(data)=>{
        console.log("modify",data)
            try {
                if(!data.name){
                    throw new Error("Invalid or empty fields");
                }
                const res = await updateProduct(data._id,data)
                setProductsList(prev=>prev.map(product=>
                    product._id == editData.data.id?
                    {...product,...editData.data}:
                    product
                ))
                setChange(true)
                setMessage("update Product successful")
            } catch (error) {
                setMessage(`${error.message}`)
            }
    }
    const modifySensor = async(data)=>{
             // add a field validator
            try {
                const res = await updateSensor(data.id,data)
                setSensorsList(prev=>prev.map(sensor=>
                            sensor._id == editData.data.id?
                            {...sensor,...editData.data}:
                            sensor
                ))

                setChange(true)
                setMessage("update Sensor successful")
            } catch (error) {
                        setMessage(`${error.message}`)
            }
    }
    const modifyFarm = async(data)=>{
            try {
                if(!data.name || !data.location){
                    throw new Error("Invalid or empty fields");
                }
                const res = await updateFarm(data.id,data)
                setFarmsList(prev=>prev.map(farm=>
                    farm._id == editData.data.id?
                    {...farm,...editData.data}:
                    farm
                ))
                setChange(true)
                setMessage("update Farm successful")
                console.log("update Farm successful")

            } catch (error) {
                setMessage(`${error.message}`)
            }
    }
    useEffect(()=>{
        fetchUsersList();
        fetchProductsList();
        fetchTanksList();
        fetchSensorsList();
        fetchFarmsList();
    },[])
    useEffect(()=>{
        setTimeout(() => {
            setMessage(null);
        }, 15000);
    },[message])
    useEffect(()=>{
        switch (deleteData?.category) {
            case "Accounts":
                removeUser(deleteData.data.id)
                break;
            case "Tanks":
                removeTank(deleteData.data.id)
                break;
            case "Products":
                removeProduct(deleteData.data.id)
                break;
            case "Sensors":
                removeSensor(deleteData.data.id)
                break;
            case "Farms":
                removeFarm(deleteData.data.id)
                break;
            default:
                break;
        }
    },[deleteData])
    useEffect(()=>{
        console.log("switch",editData)
        switch (editData?.category) {
            case "Accounts":
                const user = {...usersList.find(user=>user._id==editData.data.id),...editData.data}
                if(user){
                    modifyUser(user)
                }
                break;
            case "Tanks":
                const tank = {...tanksList.find(tank=>tank._id==editData.data.id),...editData.data}
                console.log("le tank",tank)
                if(tank){
                    modifyTank(tank);
                }
                break;
            case "Products":
                const product = {...productsList.find(product=>product._id==editData.data.id),...editData.data}
                console.log("le produit",product)
                if(product){
                    modifyProduct(product)
                }
                setChange(true)
                break;
            case "Sensors":
                const sensor = {...sensorsList.find(sensor=>sensor._id==editData.data.id),...editData.data}
                if(sensor){
                    modifySensor(sensor)
                }
                break;
            case "Farms":
                const farm = {...farmsList.find(farm=>farm._id==editData.data.id),...editData.data}
                console.log("farm trouvé",farm)

                if(farm){
                    console.log("yes")
                    modifyFarm(farm)
                }
                break;
            default:
                break;
        }
    },[editData])
    useEffect(()=>{
        if(categoryList && categoryList.length>0){
            const Exclude= ['__v'];
            setOptionSearch(Object.keys(categoryList[0])?.map(item=>{
                if(Exclude.includes(item)) return // list of invalid key
                return <option key={item} name={item} >{item}</option>
            }))
        }
    },[categoryList])
    useEffect(()=>{
        if(categoryList && categoryList.length>0){ 
            const filteredLists = categoryList.filter((data) =>{
                return fieldSearch=="Aucun filtre"?true:searchUser?String(data[fieldSearch] ?? "")?.toLowerCase()?.includes(searchUser?.toLowerCase()):true;
            })
            setSearchList(filteredLists)
        }
    },[fieldSearch,searchUser,categoryList])
    return( 
    <>
        <div className={styles.adminPan}>
            <div className={styles.main}>
                {!userInformation?
                    <>
                        <div className={styles.actionBtn}>
                            <div  className={styles.back} onClick={()=>(navigate("/board", { replace: true }))}>
                                <Dashboard/>
                                <p>Back to My User Dashboard</p>
                            </div>
                            <AddAdmin admin={setNewAdmin}/>
                        </div>
                        <div className={styles.filtersBtns}>
                            <select  className={styles.btnSelect} onChange={(elmt)=>{setFieldSearch(elmt.target.value);}}>
                                <option name={"choice"}>Aucun filtre</option>
                                {optionSearch!=null?optionSearch:""}
                            </select>
                            <input className={styles.btnInput} type="text" onChange={(elmt)=>{setSearchUser(elmt.target.value); console.log("select",elmt.target.value);}} value={searchUser} name="search"/>
                        </div>
                        <Informations showUser={setUserInformation} categoryLabel={category} DeleteData={setDeletedData}   categoryList={searchList}/> 
                    </>
                    :<>
                        {userData && <ShowUser updated={setEditData} data={userData} toggle={setUserInformation} deleted={setDeletedData}/>}
                    </>
                }
                {message!=null?<div className={styles.popUp}>
                    {message}
                </div>:""}                    
            </div>
        </div>
    </>)
}
export default Admin;