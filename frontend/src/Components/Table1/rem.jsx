import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './rem.css';
import o from '../Assets/arrow-down.svg';

const SunilComponent = ({ referrals }) => {
  const [sunilPage, setSunilPage] = useState(1);
  const [entriesPerPage] = useState(8);
  const [sunilSearchTerm, setSunilSearchTerm] = useState('');
  const [sunilReferrals, setSunilReferrals] = useState([]);
  const [verdicts, setVerdicts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (referrals) {
      setSunilReferrals(referrals);
    } else {
      fetchUpdatedData(); // Fetch initial data if not provided as props
    }
  }, [referrals]);

  useEffect(() => {
    const fetchVerdicts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_HIT_URL}/api/get-all-referral-statuses`);
        if (response.ok) {
          const data = await response.json();
          setVerdicts(data);
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

  const capitalizeFirstLetter = (str) => {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const handleDownload = () => {
    const dataToExport = sunilReferrals.map(({ name, contact, email, status, location, dateSubmitted }) => ({
      Name: name,
      'Contact Number': contact,
      Email: email,
      Status: status,
      Location: capitalizeFirstLetter(location),
      'Date Submitted': formatDate(dateSubmitted),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Referrals');
    XLSX.writeFile(workbook, 'referrals.xlsx');
  };

  const filteredReferrals = sunilReferrals.filter(referral =>
    referral.name && referral.name.toLowerCase().includes(sunilSearchTerm.toLowerCase())
  );

  const sunilTotalPages = Math.max(Math.ceil(filteredReferrals.length / entriesPerPage), 1);

  const sunilIndexOfLastEntry = sunilPage * entriesPerPage;
  const sunilIndexOfFirstEntry = sunilIndexOfLastEntry - entriesPerPage;
  const sunilCurrentEntries = filteredReferrals.slice(sunilIndexOfFirstEntry, sunilIndexOfLastEntry);

  const handleDecision = async (index, decision, flag, contact, email, name, userId) => {
    try {
      const updatedReferrals = [...sunilReferrals];
      const referralIndex = sunilIndexOfFirstEntry + index;
      const referral = updatedReferrals[referralIndex];

      // Update local state optimistically
      referral.serialNumber = referralIndex + 1;
      referral.finalVerdict = decision;
      referral.decisionMade = flag;
      referral.contactno = contact;

      console.log('Updated Referral:', referral.serialNumber, referral.finalVerdict, referral.decisionMade, referral.contactno);

      setSunilReferrals(updatedReferrals); // Optimistically update state

      // Log the referral data before making the API call
      console.log('Saving referral status:', referral);

      // Call API to save the updated referral status
      await saveReferralStatus(referral, contact, name);

      // Send email if decision is 'Selected'
      if (decision === 'Selected') {
        await sendEmail(email, name, userId);
      }

      // Fetch updated data after saving status
      await fetchUpdatedData();

      // Log a success message
      console.log('Decision handled successfully for referral:', referral);
      window.location.reload();
    } catch (error) {
      console.error('Error handling decision:', error);
    }
  };

  const sendEmail = async (email, name, userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_HIT_URL}/api/sendReferralEmail1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, name, userId }) // Include email, name, and userId in the request body
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const saveReferralStatus = async (referral, contact, name) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_HIT_URL}/save-referral-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...referral, contact, name }) // Include contact and name in the request body
      });

      if (!response.ok) {
        throw new Error('Failed to save referral status');
      }
    } catch (error) {
      console.error('Error saving referral status:', error);
      throw error;
    }
  };

  const fetchUpdatedData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_HIT_URL}/api/get-all-referral-statuses`);
      if (response.ok) {
        const data = await response.json();
        setVerdicts(data);
      } else {
        console.error('Failed to fetch verdicts');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = (event) => {
      event.preventDefault();
      if (event.deltaY > 0) {
        setSunilPage(prevPage => Math.min(prevPage + 1, sunilTotalPages));
      } else if (event.deltaY < 0) {
        setSunilPage(prevPage => Math.max(prevPage - 1, 1));
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSunilPage(prevPage => Math.min(prevPage + 1, sunilTotalPages));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSunilPage(prevPage => Math.max(prevPage - 1, 1));
      }
    };

    const sunilWrapper = document.getElementById('sunil-wrapper');
    sunilWrapper.addEventListener('wheel', handleScroll);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      sunilWrapper.removeEventListener('wheel', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sunilPage, sunilTotalPages]);

  const openResumePreview = async (resumePath) => {
    try {
      // Extract filename from resumePath
      const filename = resumePath.split('\\').pop().split('/').pop();
  
      const response = await fetch(`${process.env.REACT_APP_HIT_URL}/api/get-resume/uploads/${filename}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        console.error('Failed to fetch resume');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const handlePreviousPage = () => {
    setSunilPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setSunilPage(prevPage => Math.min(prevPage + 1, sunilTotalPages));
  };

  return (
    <div className="sunilp-container">
      <div className="sunil-container">
        <div className="sunil-header">
          <h2>Pending Referrals</h2>
          <div className="sunil-controls">
            <input
              type="text"
              className="sunil-search-bar"
              placeholder="Search by Name"
              value={sunilSearchTerm}
              onChange={(e) => setSunilSearchTerm(e.target.value)}
            />
            <button onClick={handleDownload} className="sunil-download-button">
              Export to Excel <img src={o} alt="" />
            </button>
          </div>
        </div>
        <div id="sunil-wrapper" className="sunil-table-wrapper">
          <table className="sunil-table">
            <thead>
              <tr>
                <th className="sunil-th" style={{ width: '1%' }}>Serial No.</th>
                <th className="sunil-th" style={{ width: '1%' }}>Type</th>
                <th className="sunil-th" style={{ width: '1%' }}>Name</th>
                <th className="sunil-th" style={{ width: '1%' }}>Contact No</th>
                <th className="sunil-th" style={{ width: '1%' }}>Date Submitted</th>
                <th className="sunil-th" style={{ width: '1%' }}>Resume</th>
                <th className="sunil-th" style={{ width: '1%' }}>Final Verdict</th>
              </tr>
            </thead>
            <tbody>
              {sunilCurrentEntries.map((referral, index) => (
                <tr key={index}>
                  <td className="sunil-td">{sunilIndexOfFirstEntry + index + 1}</td>
                  <td className="sunil-td">{capitalizeFirstLetter(referral.location)}</td>
                  <td className="sunil-td">{referral.name}</td>
                  <td className="sunil-td">{referral.contact}</td>
                  <td className="sunil-td">{formatDate(referral.dateSubmitted)}</td>
                  <td className="sunil-td">
                    <button className="sunil-preview-button" onClick={() => openResumePreview(referral.resume)}>
                      Resume
                    </button>
                  </td>
                  <td className="sunil-td">
                    <>
                      <button
                        className="sunil-accept-button"
                        onClick={() => handleDecision(index, 'Selected', true, referral.contact, referral.email, referral.name, referral.userId)}
                      >
                        Accept
                      </button>
                      <button
                        className="sunil-reject-button"
                        onClick={() => handleDecision(index, 'Rejected', true, referral.contact, referral.email, referral.name, referral.userId)}
                      >
                        Reject
                      </button>
                    </>
                  </td>
                </tr>
              ))}
              {sunilCurrentEntries.length === 0 && (
                <tr>
                  <td colSpan="7" className="sunil-no-entries">No referrals found</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="sunil-pagination">
            <button
              className="sunil-pagination-button"
              onClick={handlePreviousPage}
              disabled={sunilPage === 1}
            >
              Previous
            </button>
            <span className="sunil-page-info">
              Page {sunilPage} of {sunilTotalPages}
            </span>
            <button
              className="sunil-pagination-button"
              onClick={handleNextPage}
              disabled={sunilPage === sunilTotalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SunilComponent;
