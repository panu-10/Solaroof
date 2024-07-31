import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import i from '../Assets/tata21.png';
import Footer from '../Footer/footer';
import Main from '../Main';
import './front.css';
import i2 from '../Assets/100.png';
import i3 from '../Assets/emp.png';
import i4 from '../Assets/hr.png';
import l from'../Assets/link3.png'
import x from'../Assets/X.png'
import il from'../Assets/insta.png'
import f from'../Assets/face1.png'
const Temp = () => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    window.location.replace('/');
  };

  return (
    <div className="temp-container">
      <nav>
        <ul>
          <li className="logo1">
            <img src={i} alt="Tata" />
          </li>
          <li className="center">
              <h1 className="logo2">TATA POWER</h1>
          </li>
          <li className="logo3">
            <img src={i2} alt="Tata" />
          </li>
        </ul>
      </nav>
      <Main />

      <div className="centered-buttons">
      <Link to="/employee-login" className="link-no-decoration">
        <button className="login-button">
          <img src={i3} alt="Employee Login" className="button-icon" />
          Employee Login
        </button>
      </Link>
      <Link to="/hr-login" className="link-no-decoration">
        <button className="login-button">
          <img src={i4} alt="HR Login" className="button-icon" />
          HR Login
        </button>
      </Link>
      </div>
      <footer>
    In case of any concern / queries, please contact: +91-9981968250
    Mr Shreyas Mandora
    Business Development, Solar Rooftops
    <br />
    Legal Disclaimer | Privacy Policy | Terms of Use
    <br />
    © Tata Power Solar Systems Ltd. 2024
    <div id="socials-container">
      <a href="https://www.linkedin.com/company/tata-power/?originalSubdomain=in" target="_blank">
        <img src={l} alt="LinkedIn" className="icon" />
      </a>
      <a href="https://x.com/TataPower" target="_blank">
        <img src={x} alt="Twitter" className="icon" />
      </a>
      <a href="https://www.instagram.com/tatapowercompanyltd/" target="_blank">
        <img src={il} alt="Instagram" className="icon" />
      </a>
      <a href="https://www.facebook.com/tatapower/" target="_blank">
        <img src={f} alt="Facebook" className="icon" />
      </a>
    </div>
  </footer>
    </div>
  );
};

export default Temp;
