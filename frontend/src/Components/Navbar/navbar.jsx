import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import i from '../Assets/tata21.png';
import p from '../Assets/solar1.gif';
import i2 from '../Assets/100.png';

const Nav = () => {
  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    window.location.replace("/");
  };

  return (
    <nav>
      <ul>
        <li className="logo1">
          <img src={i} alt="Tata" />
        </li>
        <li className="center">
          {localStorage.getItem('auth-token') ? 
            <button onClick={handleLogout}><h3>Logout</h3></button>
           : 
            <h1 className="logo2">TATA POWER</h1>
          }
        </li>
        <li className="logo3">
          <img src={i2} alt="Tata" />
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
