import React from 'react'
import { useParams } from 'react-router-dom'

const Product = () => {
    const {productId} = useParams();
    
const ProductContainer = (props) => {
    const [data, setData] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
        const response = await axios.get(`http://127.0.0.1:8000/api/EC/products/${productId}/`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, []);
  
    console.log(data);
    return (
      <div>
  
      </div>
    )
  }

}

export default Product
