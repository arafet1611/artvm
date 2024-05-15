import { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
  const [ProductIncart, setProductInCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/cart/getByUser', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setCart(response.data);
        setProductInCart(response.data.productCart);
        setIsLoading(false);

        localStorage.setItem('cart', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching cart:', error);
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (itemId) => {
    try {
      const response = await axios.post('http://localhost:3000/api/cart/remove', {
        cartId: cart._id,
        productCardId: itemId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      if (response.status === 200) {
        console.log(data.message);
        const updatedCartItems = ProductIncart.filter((item) => item._id !== itemId);
        setProductInCart(updatedCartItems);
        setCart({ ...cart, productCart: updatedCartItems });
        localStorage.setItem('cart', JSON.stringify({ ...cart, productCart: updatedCartItems }));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élément du panier:', error);
    }
  };
  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return;

    try {
      const response = await axios.put(`http://localhost:3000/api/productCard/updateQuantity/${itemId}`, {
        quantite: quantity,
      },{
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      if (response.status === 200) {
        console.log(data.message);
        const updatedProductInCart = ProductIncart.map((item) =>
          item._id === itemId ? { ...item, quantite: quantity, prixTotal: item.product.prix * quantity } : item
        );
        setProductInCart(updatedProductInCart);
        setCart({ ...cart, productCart: updatedProductInCart });
        localStorage.setItem('cart', JSON.stringify({ ...cart, productCart: updatedProductInCart }));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la quantité:', error);
    }
  };
  const EmptyTheCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:3000/api/cart/${cart._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (response.status === 200) {
        console.log(data.message);
        // Vider le panier
        setProductInCart([]);
        setCart("");
        localStorage.removeItem('cart');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
    }
  };
  const handleDevi = async () => {
  }
  const handleCommande = async () => {
    try {
      const token = localStorage.getItem('token');
      const productCart = ProductIncart.map(item => ({
        _id: item._id,
        product: item.product,
        hauteur: item.hauteur,
        largeur: item.largeur,
        quantite: item.quantite,
      }));
      const requestBody = {
        ProductInCart: productCart,
        QuentiteTotals: ProductIncart.reduce((total, item) => total + item.quantite, 0),
        status: 'Pending',
      };
      
      console.log('Request Body:', requestBody); // Log the request body to ensure it is correct
  
      const response = await axios.post(
        'http://localhost:3000/api/commande/create',
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
        console.log('Order placed successfully:', response.data);
  
        const deleteResponse = await axios.delete(`http://localhost:3000/api/cart/${cart._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (deleteResponse.status === 200) {
          setProductInCart([]);
          setCart("");
          localStorage.removeItem('cart');
        } else {
          console.error('Failed to clear cart:', deleteResponse.data.message);
        }
      } else {
          console.error('Failed to place order:', response.data.message);
      }
    } catch (error) {
      console.error('Error during order placement:', error);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Panier</h1>
      {isLoading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : ProductIncart.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide.</p>
      ) : (
        <div className="space-y-6">
                          <button onClick={() => EmptyTheCart()} className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white"> vider le panier</button>

          {ProductIncart.map((item) => (
            <div key={item._id} className="bg-gray-100 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="flex items-center">
                  <img src={item.product.image} alt={item.product.nom} className="w-40 h-40 mr-4 rounded-lg" />
                  <div>
                    <h3 className="text-lg font-bold">{item.product.nom}</h3>
                    <p className="text-gray-500">Hauteur: {item.hauteur}</p>
                    <p className="text-gray-500">Largeur: {item.largeur}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleQuantityChange(item._id, item.quantite - 1)} disabled={item.quantite === 1} className="px-2 py-1 bg-gray-300 rounded-l hover:bg-gray-400">-</button>
                  <span className="px-4 py-1 bg-gray-300 rounded">{item.quantite}</span>
                  <button onClick={() => handleQuantityChange(item._id, item.quantite + 1)} className="px-2 py-1 bg-gray-300 rounded-r hover:bg-gray-400">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-gray-700 font-bold">Prix: {item.product.prix * item.quantite } dt</p>
                <button onClick={() => handleRemoveFromCart(item._id)} className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 text-center">
        <button  onClick={() => handleCommande()}  className="bg-purple-500 text-white px-4 py-2  mx-2 rounded hover:bg-purple-500">
          Passer Commande
        </button>
        <button  onClick={() => handleDevi()} className="bg-purple-500 text-white px-4 py-2 mx-2 rounded hover:bg-purple-500">
          Demander Devi
        </button>
      </div>
    </div>
  );
};

export default Cart;
