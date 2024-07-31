import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx'; // Import the XLSX library
import './table.css';
import { fetchEmployeeByEmailFromSession } from '../api';
import frontIcon from '../Assets/front.png';
import backIcon from '../Assets/back.png';
import p from '../Assets/arrow-down.svg';
import { parseISO, format } from 'date-fns'; // Import parseISO and format from date-fns

const ReferralTable = () => {
  const [referrals, setReferrals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10); // Number of entries per page
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [showEmailStatus, setShowEmailStatus] = useState(false); // State to toggle Email and Status columns
  const [showAdditionalColumns, setShowAdditionalColumns] = useState(false); // State to toggle additional columns visibility
  const userEmail = sessionStorage.getItem('email'); // Get the user's email from sessionStorage

  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

    if (userEmail) {
      fetchEmployeeByEmailFromSession()
        .then(data => {
          // Assuming the backend API returns an array of referral objects
          const formattedReferrals = data.map(referral => ({
            ...referral,
            // Ensure dateSubmitted is correctly formatted or parsed
            dateSubmitted: new Date(referral.dateSubmitted), // Parse the date string
          }));
          setReferrals(formattedReferrals);
        })
        .catch(error => console.error('Error fetching referrals:', error));
    }
  }, [userEmail]);

  const capitalizeFirstLetter = (str) => {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };

 
  // const formatDate = (dateString) => {
  //   try {
  //     const date = parseISO(dateString);
  //     return format(date, 'dd/MM/yy');
  //   } catch (error) {
  //     console.error('Error parsing date:', error);
  //     return dateString;
  //   }
  // };
  // Filter referrals based on search term
  const filteredReferrals = referrals.filter(referral =>
    referral.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredReferrals.length / entriesPerPage);

  useEffect(() => {
    const handleScroll = (event) => {
      event.preventDefault(); // Prevent the default scrolling behavior
      if (event.deltaY > 0) {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
      } else if (event.deltaY < 0) {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent the default behavior of moving down the page
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent the default behavior of moving up the page
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
      }
    };

    const tableWrapper = document.getElementById('table-wrapper');
    tableWrapper.addEventListener('wheel', handleScroll);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      tableWrapper.removeEventListener('wheel', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, totalPages]); // Only include currentPage and totalPages in the dependency array

  // Function to format date as day/month/year
  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  // Calculate current entries to display based on pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredReferrals.slice(indexOfFirstEntry, indexOfLastEntry);

  // Function to handle Excel export
  const handleDownload = () => {
    const dataToExport = referrals.map(({ name, contact, email, status, location, dateSubmitted }) => ({
      Name: name,
      'Contact Number': contact,
      Email: email,
      Status: status,
      Location: capitalizeFirstLetter(location),
      'Date Submitted': formatDate(new Date(dateSubmitted)), // Format date before exporting
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Referrals');
    XLSX.writeFile(workbook, 'referrals.xlsx');
  };

  return (
    <div>
      <h2 style={{ display: 'inline-block' }}>Referral Submissions:</h2>
      <input
        type="text"
        className="search-bar"
        placeholder="Search by Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleDownload} className="download-button">
        Export to Excel <img src={p} alt="" />
      </button>
      <div className={`toggle-icon ${showAdditionalColumns ? 'expanded' : ''}`} onClick={() => setShowAdditionalColumns(!showAdditionalColumns)}>
        <img src={showAdditionalColumns ? backIcon : frontIcon} alt="Toggle Icon" />
      </div>
      <div id="table-wrapper">
        <table id="referral-table">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Type</th>
              <th>Name</th>
              <th>Contact No</th>
              <th>Date Submitted</th>
              {showEmailStatus && (
                <>
                  <th>Email</th>
                  <th>Status</th>
                </>
              )}
              {!showEmailStatus && showAdditionalColumns && (
                <>
                  <th>Referred Email</th>
                  <th>Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentEntries.length > 0 ? (
              currentEntries.map((referral, index) => (
                <tr key={index}>
                  <td>{indexOfFirstEntry + index + 1}</td>
                  <td>{capitalizeFirstLetter(referral.location)}</td>
                  <td>{referral.name}</td>
                  <td>{referral.contact}</td>
                  <td>{formatDate(referral.dateSubmitted)}</td> {/* Format date here */}
                  {showEmailStatus && (
                    <>
                      <td>{referral.email}</td>
                      <td>{referral.status}</td>
                    </>
                  )}
                  {!showEmailStatus && showAdditionalColumns && (
                    <>
                      <td>{referral.email}</td>
                      <td>{referral.status}</td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={showEmailStatus || showAdditionalColumns ? "6" : "4"}>No referrals found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-controls">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
        <div className="pagination-info">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  );
};

export default ReferralTable;
