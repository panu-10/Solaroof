import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './temp.css';
import i from '../Assets/tata21.png';
import i2 from '../Assets/100.png';
import ReferralForm from '../Form/form';
import ReferralTable from '../Table/table';
import Footer from '../Footer/footer';
import Main from '../Main';

const Temp = () => {
  const [userEmail, setUserEmail] = useState('');
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleLogout = () => {
    // localStorage.removeItem('auth-token');
    sessionStorage.removeItem('email');
    window.location.replace("/");
  };

  const addReferral = (newReferral) => {
    setReferrals([...referrals, newReferral]);
  };

  return (
    <div>
      <nav>
        <ul>
          <li className="logo1">
            <img src={i} alt="Tata" />
          </li>
          {/* <li className="center">
           
          </li> */}
          <li className="auth">
            {localStorage.getItem('auth-token') && (
              <>
               {/* <h1 className="logo2">TATA POWER</h1>/ */}
                <span className="email-title">Email ID: {userEmail}</span> 
                <button onClick={handleLogout}> <span className='raj'>Logout</span></button>
              </>
            )}
          </li>
        </ul>
      </nav>
      {/* <Main />
      <div className="content-container">
        <div className="form-container">
          <ReferralForm addReferral={addReferral} referrals={referrals} />
        </div>
        <div className="table-container">
          <ReferralTable referrals={referrals} />
        </div>
      </div>
      <Footer /> */}
    </div>
  );
};

export default Temp;
