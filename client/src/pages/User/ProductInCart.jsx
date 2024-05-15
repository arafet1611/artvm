import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductInCart = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProductsInCart = async () => {
      try {
        const cartId = 'cartId'; 
        const response = await axios.get(`http://localhost:3000/api/cart/${cartId}`);
        setProducts(response.data.products); // Assurez-vous que la structure de données retournée correspond à ce format
      } catch (error) {
        console.error('Erreur lors de la récupération des produits du panier:', error);
      }
    };

    fetchProductsInCart();
  }, []);

  return (
    <div>
      <h2>Produits dans le panier</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <p>{product.nom} - Quantité: {product.quantite} - Prix: {product.prix} dt</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductInCart;