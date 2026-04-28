import { useEffect, useState } from "react"
import BarSide from "../components/ui/BarSide"
import { generateRecommendations ,fetchRecommendations} from "../services/api"
import styles from "../contexts/styles/Recommandation.module.css";
import ReactMarkdown from "react-markdown";
import SearchBar from '../components/ui/SearchBar.js';
import Test from '../components/ui/Recommandation.js';
const Recommandation = () => {
    const [data,setData]=useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProduct,setFilteredProduct]=useState([])
    useEffect(()=>{
        const loadData = async () => {
            try {
                // const data = await generateRecommendations("697a3d784ec61ce1f99751e6","fr");
                // setData(data);
                const data=await fetchRecommendations(localStorage.getItem("userId"))
                setData(data)
                setFilteredProduct(data)
            } catch (error) {
            console.error('Erreur lors du chargement des données :', error.message);
            }
        };
        loadData();
    },[]);
    useEffect(()=>{
       setFilteredProduct(data.filter((product) =>(product.productName.toLowerCase().includes(searchTerm.toLowerCase()))))
    },[searchTerm])
    return (
        <>
            <BarSide />
             {/*<div className={styles.main}>
                <h1 className="title">Recommandation</h1>
                <SearchBar onSearch={setSearchTerm} placeholder={"Recherche de recommandation par nom de produit"}/>
                {filteredProduct.map((res)=>(
                    <div key={res._id} className={styles.recommandationCard}>
                        <ReactMarkdown>{res.message}</ReactMarkdown>
                    </div>
                ))}
            </div> */}
            <Test></Test>
        </>
    )
}
export default Recommandation