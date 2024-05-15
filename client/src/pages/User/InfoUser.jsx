import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InfoUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
const [token , setToken] = useState('');
const [cart , setCart] = useState([]);
  const navigate = useNavigate();
  
  
   useEffect( () => {
    if(localStorage.getItem('token'))
      setToken(localStorage.getItem('token'));
      setCart(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []);
   },[])
  const handleCreateOrder = async (e) => {
        e.preventDefault();
    try {
  
      const responseOrder = await axios.post(
        'http://localhost:3000/api/commande/create',
        {
          cart,
          firstName,
          lastName,
          address,
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Commande enregistrée:', responseOrder.data);
      navigate('/commandes');
  
     
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
  
      if (error.response) {
        if (error.response.status === 400) {
          // Erreur de validation des champs
          alert(`Une erreur est survenue lors de la création de la commande : ${error.response.data.message}`);
        } else if (error.response.status === 401) {
          // Erreur d'authentification
          alert('Vous n\'êtes pas autorisé à effectuer cette action. Veuillez vous reconnecter.');
        } else if (error.response.status === 500) {
          // Erreur serveur
          alert('Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.');
        } else {
          // Autres erreurs de réponse
          alert('Une erreur est survenue lors de la création de la commande. Veuillez réessayer plus tard.');
        }
      } else if (error.request) {
        // Erreur de requête
        alert('Une erreur de connexion est survenue. Veuillez vérifier votre connexion internet et réessayer.');
      } else {
        // Autres types d'erreurs
        alert('Une erreur inattendue est survenue. Veuillez réessayer plus tard.');
      }
    }
  };
  return (
    <div className="max-w-lg mx-auto p-6 rounded-lg shadow-md">
      <h2 className="text-3xl lg:text-6xl">Informations Utilisateur</h2>
      <form onSubmit={handleCreateOrder} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Prénom
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Adresse
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Numéro de Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Votre+Adresse+Exacte"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Cliquez ici pour afficher votre adresse exacte sur Google Maps
          </a>
        </div>
        <button
          type="submit"
          className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
export default InfoUser;