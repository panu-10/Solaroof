import React from 'react';
import './footer.css';
import l from'../Assets/link3.png'
import x from'../Assets/X.png'
import i from'../Assets/insta.png'
import f from'../Assets/face1.png'
const Footer = () => (
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
        <img src={i} alt="Instagram" className="icon" />
      </a>
      <a href="https://www.facebook.com/tatapower/" target="_blank">
        <img src={f} alt="Facebook" className="icon" />
      </a>
    </div>
  </footer>
);

export default Footer;

 