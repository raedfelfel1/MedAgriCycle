import { ScrollView, View ,Text, TouchableOpacity} from "react-native";
import BarSide from "../../../components/ui/barside";
import { useRouter,usePathname, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import styles from "./styles/productDetailsStyles.jsx"
import SensorGauge from "../../../components/ui/SensorGauges.jsx";
import { useState,useEffect } from "react";
import { useData } from "../../dataContext";
import { fetchSensorHistory,fetchSensorsByProduct } from "../../../services/api.jsx";
import { Picker } from '@react-native-picker/picker';

const productDetails = () =>{
    const router = useRouter()
    const { t } = useTranslation();
    const {products} = useData();
    const [sensor,setSensor]=useState(null)
    const [sensorLastData,setSensorLastData]=useState({ph:null,temperature:null,humidity:null,conductivity:null});
    const [selectedProduct,setSelectedProduct]=useState(products?.[0]?._id)
    const [showProductDetails,setShowProductDetails]=useState(products?.[0])
    const loadSensor= async(idProduct)=>{
        try {
            if(!idProduct) return
            const sensor = await fetchSensorsByProduct(idProduct)
            setSensor(sensor?.[0]?._id)
        } catch (error) {
            
        }
    }
    const loadLastDataOfSensor = async(IdSensor)=>{
        try {
            if(!IdSensor) return
            const sensorData = await fetchSensorHistory(IdSensor,"live")
            setSensorLastData(sensorData[0])
        } catch (error) {
            
        }
    }
    // console.log("ProductDetailsFolder : productDetails message : Loading")
    useEffect(()=>{
        console.log("selectedProduct",selectedProduct)
        loadSensor(selectedProduct)
        const product = products.find(product=>product._id == selectedProduct)
        setShowProductDetails(product)
        console.log("product",product)
    },[selectedProduct])
    useEffect(()=>{
        console.log("sensor",sensor)
        loadLastDataOfSensor(sensor);
            if(!sensor) {
                setSensorLastData({ph:null,temperature:null,humidity:null,conductivity:null})  
                return () =>clearInterval(interval)
            }
            const interval = setInterval(()=>{
                loadLastDataOfSensor(sensor)
            },5000)
        return () => clearInterval(interval)
    },[sensor])
    useEffect(()=>{
        console.log("sensorLastData",sensorLastData)
    },[sensorLastData])
    return(
        <View style={styles.container}>
            <Picker
            style={styles.selector}
                selectedValue={selectedProduct}
                onValueChange={setSelectedProduct}
            >
                {products?.map((product)=>
                    <Picker.Item key={product._id} label={product.name} value={product._id}/>
                )}
            </Picker>
            <ScrollView>
                <View style={styles.gaugeContainer}>
                    <SensorGauge data={
                        sensorLastData
                    }/>
                </View>
                <View style={styles.productDetails}>
                    {Object.entries(showProductDetails||{}).map(
                        ([key,value])=>{
                            const NO_PRINT=["_id","__v","id","farm","fertilizerTank","waterTank","name"]
                            if(NO_PRINT.includes(key)) return
                            return(
                                <View key={key} style={styles.detailRow}>
                                    <Text style={styles.detailKey}>{key}</Text>
                                    <Text style={styles.detailValue}>{
                                        key==="createdAt"?new Date(value).toLocaleDateString(t("localDate"), {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                        }):value}
                                    </Text>
                                </View>
                            )
                        }
                    )}
                </View>
                <TouchableOpacity style={[styles.btnChartlink, !selectedProduct && styles.btnChartlinkDisabled]} onPress={()=>
                    selectedProduct?router.replace(
                    {
                        pathname:"/farmFolder/tankDashboard",
                        params:{
                            main:"graphs",
                            productId:selectedProduct,
                        }
                    }
                    ):""}>
                    <Text>{t("graphs")}</Text>
                </TouchableOpacity>
                
            </ScrollView>

            <BarSide activeItem="/productDetailsFolder"/>
        </View>
    )
}
export default productDetails
