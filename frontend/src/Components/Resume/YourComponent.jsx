// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// const YourComponent = () => {
//   const { filename } = useParams(); // Access the filename parameter from the URL

//   useEffect(() => {
//     const fetchResume = async () => {
//       try {
//         const response = await fetch(`/api/resume/${filename}`);
//         if (!response.ok) {
//           throw new Error('Resume not found');
//         }
//         const resumeBlob = await response.blob();
//         // Example: Display or download resumeBlob
//         console.log('Resume fetched successfully:', resumeBlob);
//         window.open(`backend/${filename}`, '_blank'); 
//         console.log({filename});
//       } catch (error) {
//         console.error('Error fetching resume:', error);
//       }
//     };

//     fetchResume();
//   }, [filename]);

//   return (
//     <div>
//       <h2>Resume Viewer</h2>
//       <p>Displaying resume: {filename}</p>
//       window.open({filename});
//       {/* Add your resume display logic here */}
//     </div>
//   );
// };

// export default YourComponent;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pdfjs } from 'react-pdf';
import ReactPDF from '@react-pdf/renderer';

const YourComponent = () => {
  const { filename } = useParams(); // Access the filename parameter from the URL

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resume/${filename}`);
        if (!response.ok) {
          throw new Error('Resume not found');
        }
        const resumeBlob = await response.blob();
        // Example: Display or download resumeBlob
        console.log('Resume fetched successfully:', resumeBlob);
        
        // Assuming `filename` is the correct path to your backend route serving the resume
        window.open(`/api/resume/${filename}`, '_blank'); // Open resume in a new tab
        
        console.log({filename});
      } catch (error) {
        console.error('Error fetching resume:', error);
      }
    };

    fetchResume();
  }, [filename]);

  return (
    <div>
      <h2>Resume Viewer</h2>
      <p>Displaying resume: {filename}</p>
      {/* Add your resume display logic here */}
    </div>
  );
};

export default YourComponent;
