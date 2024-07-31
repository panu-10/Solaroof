import React, { useState } from 'react';
import ReferralForm from './Form/form';
import ReferralTable from './Table/table';
import Nav from './Temp/temp';
import Footer from './Footer/footer';
import Main from './Main';
// import Dash from './Dashboard/dashboard'
import './Home.css'; // Import the CSS file

const Home = () => {
  const [referrals, setReferrals] = useState([]);

  const addReferral = (newReferral) => {
    setReferrals([...referrals, newReferral]);
  };

  return (
    <div className="App">
      <Nav />
      <Main />
      {/* <Dash/> */}
      <div className="content-container">
        <div className="form-container">
          <ReferralForm addReferral={addReferral} referrals={referrals} />
        </div>
        <div className="table-container">
          <ReferralTable referrals={referrals} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
