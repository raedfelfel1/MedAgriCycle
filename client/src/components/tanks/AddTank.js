import { useEffect, useState } from "react";
import BarSide from "../ui/BarSide"
import { Button } from "@mui/material";
import { Link, useNavigate  } from 'react-router-dom';
import { styled } from "@mui/material/styles";
import { createTank } from "../../services/api";
import "../../contexts/styles/AddTank.css"
const ActionButton = styled(Button)({
    backgroundColor: "#12a112",
    color: "#108110",
    fontWeight: "bold",
    fontSize: "0.75rem",   
    minWidth: "auto",
    color:"#f7f7f7",
    "&:hover": {
    backgroundColor: "#108110",
    color: "#00FF00",
}
});
const AddTank = () =>{
    const navigate = useNavigate();
    let tankType=localStorage.getItem("tankType")
    const [newTank,setNewTank]=useState({
        linkedFarm:localStorage.getItem("farmId"),
        name:"",
        type:tankType??"",
        liquidType:"",
        capacity:"",
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        const liquidType={
            "Fresh water":"eau douce",
            "Rain Water":"eau de pluie",
            "Recycled Water":"eau recyclée",
            "Waste Water":"eaux usées",
            "azote":"azote",
            "phosphate":"phosphate",
            "potassium":"potassium",
            "organique":"organique",
        }
        let res=value;
        if(name=="liquidType" && newTank.type!="water_fertilizer"){
            res=liquidType[value]
        }
        else if(newTank.type==="water_fertilizer"){
            res=value
        }

        setNewTank((current) => ({
            ...current,
            [name]: res,
        }));
        console.log(newTank)
    };
    const validateForm = async ()=>{
        
        if(newTank.name&&newTank.type&&newTank.liquidType&&newTank.capacity){
            try {
                const res= await createTank(newTank);
                navigate("/farm");
            } catch (e) {
            }
        }
    }
    return(
        <>
            <BarSide/>
            <div className="tankFormContainer">
                <div className="tankForm">
                    <div className="flex">
                        <label className="label" htmlFor="name">
                            <p>Tank name :</p>
                            <input name="name" type="text" placeholder="TankName" onChange={handleChange} required></input>
                        </label>
                    </div>
                    <div className="flex">
                        <label className="label" htmlFor="type">
                            <p>Tank type :</p>
                            <select name="type" defaultValue={tankType?tankType:"default"} onChange={handleChange} required>
                                <option value="default" disabled>Select a tank type</option>
                                <option value="water" >water</option>
                                <option value="fertilizer" >fertilizer</option>
                                <option value="water_fertilizer" >water and fertilizer</option>
                            </select> 
                        </label>
                    </div>
                    <div className="flex">    
                        <label className="label" htmlFor="liquidType">
                            <p>Liquid type :</p>
                            {newTank.type==="water_fertilizer"?
                            <input name="liquidType" placeholder="custom fertilizer" onChange={handleChange} required />
                            :<select defaultValue={"default"} name="liquidType" onChange={handleChange} required>
                                <option value="default" disabled>Select a liquid type</option>
                                {newTank.type === "fertilizer" ?(
                                    <>
                                        <option value="azote">azote</option>
                                        <option value="phosphate">phosphate</option>
                                        <option value="potassium">potassium</option>
                                        <option value="organique">organique</option>
                                    </>
                                ):(
                                    <>
                                        <option value="Fresh water">Fresh Water</option>
                                        <option value="Rain Water">Rain Water</option>
                                        <option value="Recycled Water">Recycled Water</option>
                                        <option value="Waste Water">Waste Water</option>
                                    </>
                                )}
                            </select>}
                        </label>
                    </div>
                    <div className="flex">
                        <label className="label" htmlFor="capacity">
                            <p>Capacity (L) :</p>
                            <input type="text" placeholder="Capacity (L)" name="capacity" onChange={handleChange} required></input>
                        </label>
                    </div>
                    <div className="btnContainer">
                        <div>
                            <ActionButton onClick={validateForm}>Confirm</ActionButton>
                        </div>
                        <div>
                            <ActionButton component={Link} to="/farm">cancel</ActionButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AddTank;