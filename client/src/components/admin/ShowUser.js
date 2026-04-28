import { ArrowBackIos, Cancel, CheckCircle, Delete, Edit} from "@mui/icons-material"
import { useEffect, useState } from "react"
import styles from '../../contexts/styles/ShowUser.module.css';
import AdminBarSide from "./AdminBarSide";
import AddUserSensor from "./AddUserSensor";

const ShowUser=({data,toggle,updated,deleted})=>{

    const [idEdit,setIdEdit]=useState(null)
    const [updateData,setUpdateData]=useState(null)
    const [editData,setEditData]=useState({})
    const [category,setCategory]=useState("Accounts")
    const resetEditData = ()=>{
        setEditData({})
    }
    const NOPRINT=["_id","__v","user_id","linkedFarm","farm","waterTank","fertilizerTank","id","location","product","owner","password","user"]
    const NOCHANGE=["__v","_id","createdAt","installed_at"]
    const handleChange = (e) => {
        const { name, value } = e.target;
        if(NOCHANGE.includes(name)) return
        if(name=="latitude" || name=="longitude"){
            console.log("à faire")
        }
        else{
            setEditData(prev => ({ ...prev, [name]: value }));
        }
    };
    const update=(value)=>{
        setUpdateData({category:value,data:editData})
    }
    useEffect(()=>{
        updated(updateData);
    },[updateData])
    useEffect(()=>{
        console.log("editData",editData)
    },[editData])
    return(
        <>
            <div className={styles.showUserContainer}>
                <AdminBarSide category={setCategory}/>
                <div className={styles.display}>
                    <div className={styles.navigation}>
                        <div className={styles.back} onClick={()=>{toggle(null)}}>
                            <ArrowBackIos/>
                        </div>
                            <div className={styles.userFullName}>    
                                <p>{data?.user.firstName}</p>
                                <p>{data?.user.lastName}</p>
                            </div>
                    </div>
                    <div className={styles.main}>
                        {category=="Accounts"?
                        <>
                            <div className={styles.sectionContainerUser}>
                                <div className={styles.sectionUser}>
                                    {Object.entries(data?.user || {}).map(([key,value])=>{
                                        return(NOPRINT.includes(key)?"":
                                        <div key={key} className={styles.dataField}>
                                                <p>{key} :</p>
                                                {idEdit==data.user._id && !NOCHANGE.includes(key)?<input defaultValue={value} name={key} onChange={handleChange}/>:
                                                <p>{NOCHANGE.includes(key)?
                                                    new Date(value).toLocaleDateString('fr-FR', {
                                                                                        year: 'numeric',
                                                                                        month: 'long',
                                                                                        day: 'numeric'
                                                                                    })
                                                    :value?value:"Non renseigné"}
                                                </p>
                                                }
                                            </div>
                                        )
                                    })}
                                    <div className={styles.actionBtn}>
                                        {idEdit==data.user._id?
                                        <>
                                            <CheckCircle className={styles.pointer} onClick={()=>{update("Accounts");setIdEdit(null); resetEditData();}}/>
                                            <Cancel className={styles.pointer} onClick={()=>{setIdEdit(null); resetEditData()}}/></>:
                                            <Edit className={styles.pointer} onClick={()=>{setIdEdit(data.user._id); setEditData({id:data.user._id})}}/>}
                                            <Delete className={styles.pointer} onClick={()=>{deleted({data:{id:data.user._id},category:"Accounts"}); toggle(null)}}/>
                                    </div>
                                </div>
                            </div>
                            <AddUserSensor user={data.user._id}/>
                        </>
                        :category=="Tanks"?
                        <>
                            <div className={styles.sectionContainer}>
                                {data.tanks.map((tank)=>(
                                    <div key={tank._id} className={`${styles.section}`}>
                                        {Object.entries(tank).map(([key,value])=>{
                                        return(NOPRINT.includes(key)?"":
                                        <div key={key} className={styles.dataField}>
                                            <p>{key} :</p>
                                            {idEdit==tank._id && !NOCHANGE.includes(key)?<input defaultValue={value} name={key} onChange={handleChange}/>:
                                            <p>{NOCHANGE.includes(key)?
                                                new Date(value).toLocaleDateString('fr-FR', {
                                                                                    year: 'numeric',
                                                                                    month: 'long',
                                                                                    day: 'numeric'
                                                                                })
                                                :value?value:"Non renseigné"}
                                            </p>
                                            }
                                        </div>
                                        )
                                        })} 
                                        <div className={styles.actionBtn}>
                                            {idEdit==tank._id?
                                            <>
                                                <CheckCircle className={styles.pointer} onClick={()=>{update("Tanks");setIdEdit(null); resetEditData();}}/>
                                                <Cancel className={styles.pointer} onClick={()=>{setIdEdit(null); resetEditData()}}/>
                                            </>:
                                                <Edit className={styles.pointer} onClick={()=>{setIdEdit(tank._id); setEditData({_id:tank._id}); console.log(tank._id)}}/>}
                                                <Delete className={styles.pointer} onClick={()=>{deleted({data:{id:tank._id},category:"Tanks"})}}/>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                        :category=="Products"?
                        <>
                            <div className={styles.sectionContainer}>
                                {data.products?.map((product)=>(
                                    <div key={product._id}  className={`${styles.section}`}>
                                        {Object.entries(product).map(([key,value])=>{
                                        return(NOPRINT.includes(key)?"":
                                        <div key={key} className={styles.dataField}>
                                            <p>{key} :</p>
                                            {idEdit==product._id && !NOCHANGE.includes(key)?<input defaultValue={value} name={key} onChange={handleChange}/>:
                                            <p>{NOCHANGE.includes(key)?
                                                new Date(value).toLocaleDateString('fr-FR', {
                                                                                    year: 'numeric',
                                                                                    month: 'long',
                                                                                    day: 'numeric'
                                                                                })
                                                :value?value:"Non renseigné"}
                                            </p>
                                            }
                                        </div>

                                        )
                                        })} 
                                        <div className={styles.actionBtn}>
                                            {idEdit==product._id?
                                            <>
                                                <CheckCircle className={styles.pointer} onClick={()=>{update("Products");setIdEdit(null); resetEditData();}}/>
                                                <Cancel className={styles.pointer} onClick={()=>{setIdEdit(null); resetEditData()}}/>
                                            </>:
                                                <Edit className={styles.pointer} onClick={()=>{setIdEdit(product._id); setEditData({_id:product._id}); console.log(product._id)}}/>}
                                                <Delete className={styles.pointer} onClick={()=>{deleted({data:{id:product._id},category:"Products"})}}/>

                                        </div>
                                    </div>
                                ))} 
                            </div>
                        </>
                        :category=="Sensors"?
                        <>
                            <div className={styles.sectionContainer}>
                                {data.sensors?.map((sensor)=>(
                                    <div key={sensor._id} className={`${styles.section}`}>
                                        {Object.entries(sensor).map(([key,value])=>{
                                        return(NOPRINT.includes(key)?"":
                                        <div key={key} className={styles.dataField}>
                                            <p>{key} :</p>
                                            {idEdit==sensor._id && !NOCHANGE.includes(key)?<input defaultValue={value} name={key} onChange={handleChange}/>:
                                            <p>{NOCHANGE.includes(key)?
                                                new Date(value).toLocaleDateString('fr-FR', {
                                                                                    year: 'numeric',
                                                                                    month: 'long',
                                                                                    day: 'numeric'
                                                                                })
                                                :value?value:"Non renseigné"}
                                            </p>
                                            }
                                        </div>
                                        )
                                        })} 
                                        <div className={styles.actionBtn}>
                                            {idEdit==sensor._id?
                                            <>
                                                <CheckCircle className={styles.pointer} onClick={()=>{update("Sensors");setIdEdit(null); resetEditData();}}/>
                                                <Cancel className={styles.pointer} onClick={()=>{setIdEdit(null); resetEditData()}}/>
                                            </>:
                                                <Edit className={styles.pointer} onClick={()=>{setIdEdit(sensor._id); setEditData({id:sensor._id}); console.log(sensor._id)}}/>}
                                                <Delete className={styles.pointer} onClick={()=>{updated({data:{
                                                    id:sensor._id,
                                                    location:{
                                                        latitude:0,
                                                        longitude:0,
                                                    },
                                                    status:"inactive",
                                                    product:null,
                                                    user:null,
                                                },category:"Sensors"})}}/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                        :
                        <>
                            <div className={styles.sectionContainer}>
                                {data?.farms.map((farm)=>(
                                    <div key={farm._id} className={`${styles.section}`}>
                                        {Object.entries(farm).map(([key,value])=>{
                                        return(NOPRINT.includes(key)?"":
                                            <div key={key} className={styles.dataField}>
                                                <p>{key} :</p>
                                                {idEdit==farm._id && !NOCHANGE.includes(key)?<input defaultValue={value} name={key} onChange={handleChange}/>:
                                                <p>{NOCHANGE.includes(key)?
                                                    new Date(value).toLocaleDateString('fr-FR', {
                                                                                        year: 'numeric',
                                                                                        month: 'long',
                                                                                        day: 'numeric'
                                                                                    })
                                                    :value?value:"Non renseigné"}
                                                </p>
                                                }
                                            </div>
                                        )
                                        })} 
                                        <div className={styles.actionBtn}>
                                            {idEdit==farm._id?
                                            <>
                                                <CheckCircle className={styles.pointer} onClick={()=>{update("Farms");setIdEdit(null); resetEditData();}}/>
                                                <Cancel className={styles.pointer} onClick={()=>{setIdEdit(null); resetEditData()}}/>
                                            </>:
                                                <Edit className={styles.pointer} onClick={()=>{setIdEdit(farm._id); setEditData({id:farm._id}); console.log(farm._id)}}/>}
                                                <Delete className={styles.pointer} onClick={()=>{deleted({data:{id:farm._id},category:"Farms"})}}/>
                                        </div>
                                    </div>
                                ))}                    
                            </div>
                        </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default ShowUser