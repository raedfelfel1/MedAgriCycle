import React,{useState} from 'react';
import Interface from "../ui/Interface"
import BarSide from '../ui/BarSide';

const Farm=()=>{
    const [selectedFarmId, setSelectedFarmId] = useState(null);
    return(
        <>
        <BarSide/>
        <Interface selectedFarmId={selectedFarmId} setSelectedFarmId={setSelectedFarmId}/>
        </>
    );
};

export default Farm;