import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './form.css';

const LocationButtons = ({ location, setLocation }) => {
  return (
    <div className="location-buttons">
      <h3>Type of Location: <span className="asterisk"> *</span></h3>
      <div className="button-group">
        <button
          type="button"
          className={location === 'residential' ? 'active' : ''}
          onClick={() => setLocation('residential')}
        >
          Residential
        </button>
        <button
          type="button"
          className={location === 'non-residential' ? 'active' : ''}
          onClick={() => setLocation('non-residential')}
        >
          Non-Residential
        </button>
      </div>
    </div>
  );
};

const ReferralForm = ({ addReferral }) => {
  const [userEmail, setUserEmail] = useState('');
  const [name, setName] = useState('');
  const [email, setReferralEmail] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState(null); // Initialize to null
  const [resume, setResume] = useState(null); // State for resume file
  const [date] = useState(new Date()); // Initialize date to current date
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('email');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleContactChange = (e) => {
    const input = e.target.value;
    // Ensure only digits are allowed
    const sanitizedInput = input.replace(/\D/g, '');
    // Limit to 10 characters
    const truncatedInput = sanitizedInput.slice(0, 10);
    setContact(truncatedInput);
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if location is selected
    if (!location) {
      alert('Please select Type of location.');
      return;
    }

    const userId = sessionStorage.getItem('email');
    if (!userId) {
      alert('User email is missing. Please log in again.');
      return;
    }

    const contactRegex = /^\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!contactRegex.test(contact)) {
      alert('Please enter a valid 10-digit contact number.');
      return;
    }

    if (!emailRegex.test(email)) {
      alert('Please enter a valid email in the form of @gmail.com.');
      return;
    }

    if (!resume) {
      alert('Please upload a resume.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_HIT_URL}/api/check-contact/${contact}`);
      if (response.ok) {
        const exists = await response.json();
        if (exists) {
          alert('Contact number already exists. Please use a different contact number.');
          return;
        }
      } else {
        const errorText = await response.text();
        console.error('Error checking contact number:', errorText);
        alert('Error checking contact number');
        return;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error checking contact number');
      return;
    }

    const formData = new FormData();
    formData.append('name', capitalizeFirstLetter(name));
    formData.append('email', email);
    formData.append('contact', contact);
    formData.append('userEmail', userEmail);
    formData.append('dateSubmitted', formatDate(date)); // Use date state for submission
    formData.append('status', 'Submitted');
    formData.append('location', location);
    formData.append('userId', userEmail);
    formData.append('resume', resume);

    try {
      // Save the referral
      const saveResponse = await fetch(`${process.env.REACT_APP_HIT_URL}/api/saveReferral`, {
        method: 'POST',
        body: formData,
      });

      if (saveResponse.ok) {
        const savedReferral = await saveResponse.json();
        alert('Form data saved successfully');
        addReferral(savedReferral);

        // Send the referral
        const sendResponse = await fetch(`${process.env.REACT_APP_HIT_URL}/api/sendReferralEmail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(savedReferral),
        });

        if (sendResponse.ok) {
          alert('Referral sent successfully');
        } else {
          const errorText = await sendResponse.text();
          console.error('Error sending referral:', errorText);
          alert('Failed to send referral');
        }

        // Reset form fields after successful submission
        setName('');
        setReferralEmail('');
        setContact('');
        setLocation(null);
        setResume(null);
        window.location.reload();
      } else {
        const errorText = await saveResponse.text();
        console.error('Error saving referral:', errorText);
        alert('Failed to save form data');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving or sending referral');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="re">Details of Friend you want to refer:</h1>
      <hr />
      <LocationButtons location={location} setLocation={setLocation} />
      <label htmlFor="name">
        <span>Name:<span className="asterisk">*</span></span>
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={name}
        onChange={(e) => setName(capitalizeFirstLetter(e.target.value.replace(/[^a-zA-Z\s]/g, '')))}
        required
      />
      <label htmlFor="contact">
        <span>Contact Number: <span className="asterisk"> *</span></span>
      </label>
      <input
        type="tel"
        id="contact"
        name="contact"
        value={contact}
        onChange={handleContactChange}
        pattern="^\d{10}$"
        title="Please enter a valid 10-digit contact number."
        required
      />
      <label htmlFor="referralEmail">
        <span>Referral's Email ID: <span className="asterisk">*</span></span>
      </label>
      <input
        type="email"
        id="referralEmail"
        name="referralEmail"
        value={email}
        onChange={(e) => setReferralEmail(e.target.value)}
        pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
        title="Please enter a valid email in the form of @gmail.com."
        required
      />
      <label htmlFor="resume">
        <span>Upload Resume: <span className="asterisk">*</span></span>
      </label>
      <input
        type="file"
        id="resume"
        name="resume"
        onChange={handleFileChange}
        accept=".pdf,.png,.docx"
        required
      />
      <div className="form-buttons">
        <button type="reset" onClick={() => { setName(''); setReferralEmail(''); setContact(''); setLocation(null); setResume(null); }}>Reset</button>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default ReferralForm;
