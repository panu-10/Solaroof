import React, { useState, useEffect } from 'react';
import ReferralForm from '../Form/form';
import ReferralTable from '../Table1/rem';
import Nav from '../Temp/temp';
import Footer from '../Footer/footer';
import Main from '../Main';
import './home2.css'; // Import the CSS file
import Pranav from '../Pranav/pranav';

const Home = () => {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_HIT_URL}/api/getAllReferrals`); // Replace with your backend URL
        if (response.ok) {
          const data = await response.json();
          setReferrals(data); // Set the retrieved referrals to state
        } else {
          throw new Error('Failed to fetch referrals');
        }
      } catch (error) {
        console.error('Error fetching referrals:', error);
        // Handle error as needed (e.g., show error message)
      }
    };

    fetchReferrals(); // Invoke fetchReferrals function
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  const addReferral = (newReferral) => {
    setReferrals([...referrals, newReferral]); // Update state with new referral
  };

  return (
    <div className="App">
      <Nav />
      <Main />
      <div className="content-container">
        {/* <div className="form-container">
          <ReferralForm addReferral={addReferral} referrals={referrals} />
        </div> */}
          <ReferralTable referrals={referrals} /> {/* Pass referrals data as props */}
          <Pranav/>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
