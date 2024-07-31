document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('referral-form');
    const tableBody = document.querySelector('#referral-table tbody');
    let serialNo = 1;
    const referralTable = document.getElementById("referral-table");
    const viewMore = document.getElementById("view-more");
    const tbody = referralTable.querySelector("tbody");
    const PAGE_SIZE = 2; // Number of entries displayed per page
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const contact = document.getElementById('contact').value;
        const email = document.getElementById('email').value;
        const dateSubmitted = new Date().toLocaleDateString();
        const status = 'Submitted';
        const existingEmails = Array.from(tableBody.querySelectorAll('tr')).map(row => row.cells[2].textContent);
        const existingContacts = Array.from(tableBody.querySelectorAll('tr')).map(row => row.cells[3].textContent);

        // if (existingEmails.includes(email)) {
        //     alert('This email has already been referred. Please submit a different email.');
        //     return;
        // }

        // if (existingContacts.includes(contact)) {
        //     alert('This contact has already been referred. Please submit a different contact.');
        //     return;
        // }
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = serialNo++;
        row.insertCell(1).textContent = name;
        row.insertCell(2).textContent = email;
        row.insertCell(3).textContent = contact;
        row.insertCell(4).textContent = dateSubmitted;
        row.insertCell(5).textContent = status;

        form.reset();
    });
});
document.addEventListener("DOMContentLoaded", function() {
  document.querySelector(".login-btn").addEventListener("click", function() {
    window.location.href = "login.html"; 
  });

  document.querySelector(".signup-btn").addEventListener("click", function() {
    window.location.href = "signup.html"; 
  });
  document.querySelector(".logi").addEventListener("click", function() {
    window.location.href = "index.html"; 
  });
  
});
