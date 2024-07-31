import React from 'react';
import videobg from './Assets/solar5.mp4';
import './Main.css';

const Main = () => {
  return (
    <div className="main">
      <video src={videobg} autoPlay loop muted />
      <div className="overlay"></div>
    </div>
  );
};

export default Main;
