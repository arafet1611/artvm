import  { useState, useEffect } from 'react';
import axios from 'axios';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebase.js';
import { Link } from 'react-router-dom'; 
import { NavLink } from 'react-router-dom';

 
const Product = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDetailClick = (product) => {
    setSelectedProduct(product); // Mettez à jour l'état avec le produit sélectionné lorsqu'un bouton est cliqué
  };

  // Fonction pour récupérer l'URL de téléchargement de l'image depuis Firebase Storage
  const getImageURL = async (imageName) => {
    const storage = getStorage(app);
    const imageRef = ref(storage, `images/${imageName}`);
    try {
      const imageURL = await getDownloadURL(imageRef);
      return imageURL;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product._id} className="border p-4">
          <h2 className="text-lg font-semibold">{product.nom}</h2>
          <img
            src={product.image}
            alt={product.nom}
            className="w-full h-40 object-cover mt-2"
          />
       <Link to={`/detailproduct/${product._id}`}>
  <button onClick={() => handleDetailClick(product)} className="mt-2 from-indigo-500 via-purple-500 to-pink-500  font-bold py-2 px-4 rounded">
    Plus de détails
  </button>
</Link>


        </div>
      ))}
    </div>
  );
};

export default Product;