import React, { useState } from "react";
import "../CSS/loginsignup1.css";
// import Navbar from '../Components/Navbar/navbar';
import Footer from '../Components/Footer/footer';
import Main from '../Components/Main';
import i from '../Components/Assets/tata21.png';
import i2 from '../Components/Assets/100.png';

const LoginSignup = () => {
  const [state, setState] = useState("HR Login"); // Initial state changed to "HR Login"
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const submitHandler = async () => {
    const url = state === "HR Login" ? `${process.env.REACT_APP_HIT_URL}/login-hr` : `${process.env.REACT_APP_HIT_URL}/signup-hr`;

    // Validate email domain for sign-up
    if (state === "HR Signup" && !formData.email.endsWith('@tatapower.com')) {
      alert('Email domain must be @tatapower.com');
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const dataObj = await response.json();
      if (dataObj.success) {
        localStorage.setItem('auth-token', dataObj.token);
        sessionStorage.setItem('email', formData.email); // Store email in session storage
        window.location.replace("/dash1"); // Redirect to home page
      } else {
        alert(dataObj.errors);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  }

  return (
    <div className="App">
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
      <div className="loginsignup">
        <div className="loginsignup-container">
          <h1>{state}</h1>
          <div className="loginsignup-fields">
            {state === "HR Signup" && (
              <input
                type="text"
                placeholder="Your name"
                name="username"
                value={formData.username}
                onChange={changeHandler}
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              name="email"
              value={formData.email}
              onChange={changeHandler}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={changeHandler}
            />
          </div>
          <button onClick={submitHandler}>Continue</button>
          {state === "HR Login" ? (
            <p className="loginsignup-login">
              Create an account? <span onClick={() => setState("HR Signup")}>Click here</span>
            </p>
          ) : (
            <p className="loginsignup-login">
              Already have an account? <span onClick={() => setState("HR Login")}>Login here</span>
            </p>
          )}
          <div className="loginsignup-agree">
            <input type="checkbox" name="" id="" />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default LoginSignup;
