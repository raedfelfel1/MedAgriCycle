import React from 'react';
import DeleteFarmButton from './DeleteFarmButton';
import {useState,useEffect} from 'react';
import { fetchFarms } from '../../services/api';
import FarmInformation from './FarmInformation';



const HeaderSection = ({ selectedFarm, onFarmSelect }) => {
  return (
    <>
      <FarmInformation farm={selectedFarm} />
    </>
  );
};

export default HeaderSection;
