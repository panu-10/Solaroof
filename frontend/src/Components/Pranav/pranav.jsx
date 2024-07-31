import React, { useState, useEffect } from 'react';     
import './pranav.css';
import * as XLSX from 'xlsx';
import o from '../Assets/arrow-down.svg';

const Pranav = () => {
  const [verdicts, setVerdicts] = useState([]);
  const [filteredVerdicts, setFilteredVerdicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const entriesPerPage = 8;

  useEffect(() => {
    const fetchVerdicts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_HIT_URL}/api/get-all-referral-statuses`);
        if (response.ok) {
          const data = await response.json();
          const selectedVerdicts = data.filter(verdict => verdict.finalVerdict === 'Selected');
          setVerdicts(selectedVerdicts);
          setFilteredVerdicts(selectedVerdicts);
        } else {
          console.error('Failed to fetch verdicts');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerdicts();
  }, []);

  useEffect(() => {
    const filtered = verdicts.filter(verdict =>
      verdict.name && verdict.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVerdicts(filtered);
    setCurrentPage(1);
  }, [searchQuery, verdicts]);

  const totalPages = Math.max(Math.ceil(filteredVerdicts.length / entriesPerPage), 1);
  const currentVerdicts = filteredVerdicts.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const handleScroll = (event) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    } else if (event.deltaY < 0) {
      setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    }
  };

  useEffect(() => {
    const tableContainer = document.getElementById('verdict-table-container');
    tableContainer.addEventListener('wheel', handleScroll);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      tableContainer.removeEventListener('wheel', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [totalPages]);

  const handlePrevious = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handleDownload = () => {
    const dataToExport = currentVerdicts.map((verdict, index) => ({
      'Serial No': (currentPage - 1) * entriesPerPage + index + 1,
      'Contact No': verdict.contactno,
      'Final Verdict': verdict.finalVerdict,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Candidates');
    XLSX.writeFile(workbook, 'selected_candidates.xlsx');
  };

  return (
    <div id="verdict-table-container" className="verdict-table-container">
      <h2>Selected Candidates</h2>
      <div className="button-container">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleDownload} className="sunil-download-button1">
          Export to Excel <img src={o} alt="" />
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="verdict-table">
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Name</th>
                <th>Contact No</th>
                <th>Final Verdict</th>
              </tr>
            </thead>
            <tbody>
              {currentVerdicts.map((verdict, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * entriesPerPage + index + 1}</td>
                  <td>{verdict.name}</td>
                  <td>{verdict.contactno}</td>
                  <td>{verdict.finalVerdict}</td>
                </tr>
              ))}
              {currentVerdicts.length === 0 && (
                <tr>
                  <td colSpan="4" className="no-entries">No entries found</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="navigation-buttons">
            <button className="prev-button" onClick={handlePrevious} disabled={currentPage === 1}>
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button className="next-button" onClick={handleNext} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Pranav;
