import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';
import SmoothScroll from 'smooth-scroll';
import { FaShoppingCart } from "react-icons/fa";


export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (currentUser && currentUser._id) {
          const res = await fetch(`http://localhost:3000/api/user/${currentUser._id}`);
          console.log(currentUser._id);
          const data = await res.json();
          if (res.ok) {
            setUserInfo(data);
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error.message);
      }
    };
  
    fetchUserInfo();
  }, [currentUser] );
  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      } else {
        dispatch(signoutSuccess()); // Dispatch the signoutSuccess action upon successful signout
        localStorage.removeItem('token'); // Remove the token from localStorage
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const scroll = new SmoothScroll();

  const scrollToSection = (event) => {
    event.preventDefault();
    scroll.animateScroll(document.querySelector('#contact-section'), null, {
      speed: 500, // Durée de l'animation en millisecondes (par exemple, 1000 pour une seconde)
    });
  };
  const commonStyles = {
    width: '3rem', // equivalent to w-12
    height: '2.5rem', // equivalent to h-10
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white', // Set background color
    color: 'gray', // Set text/icon color
    borderRadius: '9999px', // equivalent to pill
    textDecoration: 'none', // Remove underline from link
    border: '1px solid gray', // Add border color and width
  };
  return (
    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
          ARTVM
        </span>
        
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>
      <div className='flex gap-2 md:order-2'>
     {userInfo && !userInfo.isAdmin ?( <Link
        to="/cart"
        style={commonStyles}
        className="lg:inline"
      >
        <FaShoppingCart />
      </Link>) :(<div></div>) } 
        <Button
          className='w-12 h-10 hidden sm:inline'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=dash'}>
              <Dropdown.Item>Tableau de bord</Dropdown.Item>
            </Link>
            <Link to={'/commandes'}>
              <Dropdown.Item>Mon Commandes</Dropdown.Item>
            </Link>
            
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Se déconnecter</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
            Se connecter
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <a href='#contact-section' onClick={scrollToSection}>
          Autres informations?
        </a>
      </Navbar.Collapse>
    </Navbar>
  );
}
