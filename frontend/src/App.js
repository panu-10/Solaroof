import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar/navbar';
import Footer from './Components/Footer/footer';
import LoginSignup from './Pages/loginsignup';
import LoginSignup1 from './Pages/loginsignup1';
import Home from './Components/Home';
import Home2 from './Components/Home2/home2';
import Home3 from './Components/Pranav/pranav';
import ReferralForm from './Components/Form/form';
import Front from './Components/Front/front';
import Res from './Components/Resume/YourComponent';
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument  from './Components/pdf';
function App() {
  const [referrals, setReferrals] = useState([]);
  const [location, setLocation] = useState(null);

  const addReferral = (newReferral) => {
    setReferrals((prevReferrals) => [...prevReferrals, newReferral]);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/uploads/:filename" element={<Res/>} />
          <Route path="/" element={<Front />} />
          <Route path="/dash1" element={<Home2/>} />
          <Route path="/hr-login" element={<LoginSignup1 />} />
          <Route path="/employee-login" element={<LoginSignup />} />
          <Route path="/dash" element={<Home />} />
          <Route path="/referral-form" element={<ReferralForm addReferral={addReferral} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
