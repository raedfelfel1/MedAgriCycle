import { useEffect, useState } from "react";
import Card from "./Card"
const Informations = ({categoryLabel,categoryList,showUser,DeleteData}) => {
    const [content,setContent]=useState(<></>);
    const [currentCategory,setCurrentCategory]=useState(null)
    const [activeCard,setActiveCard]=useState(null);
    const [editCard,setEditCard]=useState(null)
    const [editData,setEditData]=useState(null)
    const [deleteData,setDeleteData]=useState(null)
    const [done,setDone]=useState(null);
    const [labelsList,setLabelsList]=useState(null);
    useEffect(()=>{
        console.log("test",deleteData)
            DeleteData({data:deleteData,category:currentCategory})
        },[deleteData])
    useEffect(()=>{
        setActiveCard(null)
    },[categoryList])
    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name=="latitude" || name=="longitude"){
            console.log("à faire")
        }
        else{
            setEditData(prev => ({ ...prev, [name]: value }));
        }
    };
    useEffect(()=>{
        if(!categoryLabel || !categoryList) return
        switch(categoryLabel) {
            case "Accounts":
                setCurrentCategory("Accounts");
                setContent(
                    <>
                        {categoryList.map((category)=>{
                            const {_id,firstName,lastName,email,phone,address,location,age,userRole,createdAt} = category;
                            setLabelsList({placeholder:'firstName lastName',fields:[
                                <p>email</p>
                                ,<p>phone</p>
                                ,<p>address</p>
                                ,<p>createdAt</p>]
                            })

                            return (
                                <Card key={_id} showUser={showUser} category={categoryLabel} deleteData={setDeleteData} show={setActiveCard} activeCard={activeCard} id={_id} placeholder={
                                    <>
                                        <p>{firstName}</p><p>{lastName}</p>
                                    </>}
                                >
                                    <p>{email}</p>
                                    <p>{phone}</p>
                                    <p>{address}</p>
                                    {/* {_id==editCard?
                                    <><input type="text" name="latitude" defaultValue={location?.latitude} onChange={handleChange}/>
                                    <input type="text" name="longitude" defaultValue={location?.longitude} onChange={handleChange}/></>:
                                    <p>{location?.latitude} {location?.longitude}</p>
                                    } */}
                                    <p>{new Date(createdAt).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                        })}
                                    </p>
                                </Card>
                            )
                        })}
                    </>
                )
                break;
            case "Tanks":
                setCurrentCategory("Tanks");
                setLabelsList({placeholder:'Name',fields:[
                                <p>type</p>
                                ,<p>liquidType</p>
                                ,<p>Capacity(Unit)</p>
                                ,<p>createdAt</p>
                                ]
                })
                setContent(
                    <>
                        {categoryList.map((category)=>(
                            <Card key={category._id} editCard={editCard} deleteData={setDeleteData} show={setActiveCard} activeCard={activeCard} id={category._id} placeholder={
                                category._id==editCard ? <input type="text" name="name" defaultValue={category.name} onChange={handleChange} /> : <p>{category.name}</p>
                            }>
                                {category._id==editCard?<input type="text" name="type" defaultValue={category.type} onChange={handleChange}/>:
                                <p>{category.type}</p>}
                                {category._id==editCard?<input type="text" name="liquidType" defaultValue={category.liquidType} onChange={handleChange}/>:
                                <p>{category.liquidType}</p>}
                                {category._id==editCard?
                                <><input type="text" name="capacity" defaultValue={category.capacity} onChange={handleChange}/>
                                <input type="text" name="unit" defaultValue={category.unit} onChange={handleChange}/></>:
                                <p>{category.capacity}({category.unit})</p>}
                                
                                <p>{new Date(category.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                    })}
                                </p>
                            </Card>
                        ))}
                    </>
                )
                break;
            case "Products":
                setCurrentCategory("Products");
                setLabelsList({
                placeholder: 'Name',
                fields: [
                    <p>name</p>,
                    <p>plant</p>,
                    <p>category</p>,
                    <p>minTemperature</p>,
                    <p>maxTemperature</p>,
                    <p>minHumidite</p>,
                    <p>maxHumidite</p>,
                    <p>minPh</p>,
                    <p>maxPh</p>,
                    <p>createdAt</p>,
                ]
                })
                setContent(
                    <>
                        {categoryList.map((category)=>(
                            <Card key={category._id} editCard={editCard} deleteData={setDeleteData} show={setActiveCard} activeCard={activeCard} id={category._id} placeholder=
                            {category._id==editCard ? <input type="text" name="name" defaultValue={category.name} onChange={handleChange} /> : <p>{category.name}</p>}
                            >
                                {category._id==editCard?<input type="text" name="name" defaultValue={category.name} onChange={handleChange}/>:
                                <p>{category.name}</p>}
                                {category._id==editCard?<input type="text" name="plant" defaultValue={category.plant} onChange={handleChange}/>:
                                <p>{category.plant}</p>}
                                {category._id==editCard?<input type="text" name="category" defaultValue={category.category} onChange={handleChange}/>:
                                <p>{category.category}</p>}
                                {category._id==editCard?<input type="text" name="minTemperature" defaultValue={category.minTemperature} onChange={handleChange}/>:
                                <p>{category.minTemperature}</p>}
                                {category._id==editCard?<input type="text" name="maxTemperature" defaultValue={category.maxTemperature} onChange={handleChange}/>:
                                <p>{category.maxTemperature}</p>}
                                {category._id==editCard?<input type="text" name="minHumidite" defaultValue={category.minHumidite} onChange={handleChange}/>:
                                <p>{category.minHumidite}</p>}
                                {category._id==editCard?<input type="text" name="maxHumidite" defaultValue={category.maxHumidite} onChange={handleChange}/>:
                                <p>{category.maxHumidite}</p>}
                                {category._id==editCard?<input type="text" name="minPh" defaultValue={category.minPh} onChange={handleChange}/>:
                                <p>{category.minPh}</p>}
                                {category._id==editCard?<input type="text" name="maxPh" defaultValue={category.maxPh} onChange={handleChange}/>:
                                <p>{category.maxPh}</p>}


                                <p>{new Date(category.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                    })}
                                </p>
                            </Card>
                        ))}
                    </>
                )
                break;
            case "Sensors":
                setCurrentCategory("Sensors");
                setLabelsList({
                placeholder: 'sensor_id',
                fields: [
                    <p>ip address</p>,
                    <p>type</p>,
                    <p>location (lat / lng)</p>,
                    <p>unit</p>,
                    <p>status</p>,
                    <p>product</p>,
                    <p>installed_at</p>,
                ]
                })
                setContent(
                    <>
                        {categoryList.map((category)=>(
                            <Card key={category._id} editCard={editCard} deleteData={setDeleteData} show={setActiveCard} activeCard={activeCard} id={category._id} placeholder=
                                {category._id==editCard ? <input type="text" name="sensor_id" defaultValue={category.sensor_id} onChange={handleChange} /> : <p>{category.sensor_id}</p>}
                            >
                                {category._id==editCard?<input type="text" name="ip_address" defaultValue={category.ip_address} onChange={handleChange}/>:
                                <p>{category.ip_address}</p>}
                                {category._id==editCard?<input type="text" name="type" defaultValue={category.type} onChange={handleChange}/>:
                                <p>{category.type}</p>}
                                {category._id==editCard?
                                <><input type="text" name="latitude" defaultValue={category.location?.latitude} onChange={handleChange}/>
                                <input type="text" name="longitude" defaultValue={category.location?.longitude} onChange={handleChange}/></>:
                                <p>{category.location?.latitude} et {category.location?.longitude}</p>}
                                {category._id==editCard?<input type="text" name="unit" defaultValue={category.unit} onChange={handleChange}/>:
                                <p>{category.unit}</p>}
                                {category._id==editCard?<input type="text" name="status" defaultValue={category.status} onChange={handleChange}/>:
                                <p>{category.status}</p>}
                                {category._id==editCard?<input type="text" name="product" defaultValue={category.product} onChange={handleChange}/>:
                                <p>{category.product}</p>}
                                <p>{new Date(category.installed_at).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                    })}
                                </p>
                            </Card>
                        ))}
                    </>
                )
                break;
            case "Farms":
                setCurrentCategory("Farms");
                setLabelsList({
                placeholder: 'name',
                fields: [
                    <p>name</p>,
                    <p>area</p>,
                    <p>owner id</p>,
                    <p>createdAt</p>,
                ]
                })
                setContent(
                    <>
                        {categoryList.map((category)=>(
                            <Card key={category._id} editCard={editCard} deleteData={setDeleteData} show={setActiveCard} activeCard={activeCard} id={category._id} placeholder=
                            {category._id==editCard ? <input type="text" name="name" defaultValue={category.name} onChange={handleChange} /> : <p>{category.name}</p>}
                            >
                                {category._id==editCard?<input type="text" name="name" defaultValue={category.name} onChange={handleChange}/>:
                                <p>{category.name}</p>}
                                {category._id==editCard?<input type="text" name="area" defaultValue={category.area} onChange={handleChange}/>:
                                <p>{category.area}</p>}
                                {category._id==editCard?<input type="text" name="owner" defaultValue={category.owner?._id} onChange={handleChange}/>:
                                <p>{category.owner?._id}</p>}
                                <p>{new Date(category.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                    })}
                                </p>
                            </Card>
                        ))}
                    </>
                )
                break;
            default:
                setContent(null);
                break;
        }
    },[categoryLabel,categoryList,activeCard,editCard])
    return(
        <>
            <Card label={true} placeholder={labelsList?.placeholder}>
                {labelsList?.fields?.map((item)=>(item))}
            </Card>
            {content}
        </>
    )
}
export default Informations;