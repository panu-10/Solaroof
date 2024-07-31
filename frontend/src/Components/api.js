import axios from 'axios';
import React, { useState } from 'react';
// export const fetchReferrals = async (token) => {
//   try {
//     const response = await axios.get('${process.env.REACT_APP_HIT_URL}/api/getEmployeeByEmail', {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching referrals:', error);
//     throw error;
//   }
// };



// export const fetchEmployeeByEmail = async (sessionStorage.getItem('email'), token) => {
//   debugger
//   try {
//     const response = await axios.get(`${process.env.REACT_APP_HIT_URL}/api/getEmployeeByEmail?email=${email}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching employee by email:', error);
//     throw error;
//   }
// };

// import axios from 'axios';
export const fetchEmployeeByEmail = async (email) => {
  try {
    debugger;
    const response = await axios.get(`${process.env.REACT_APP_HIT_URL}/api/getEmployeeByEmail`, {
      params: { email }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching employee by email:', error);
    throw error;
  }
};

// Call fetchEmployeeByEmail with sessionStorage.getItem('email') and token
export const fetchEmployeeByEmailFromSession = async () => {
  
  const email = sessionStorage.getItem('email');

  return await fetchEmployeeByEmail(email);

};
