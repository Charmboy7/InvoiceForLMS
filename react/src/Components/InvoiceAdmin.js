import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import './InvoiceAdmin.css';

function InvoiceAdmin() {
  const [data, setData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('All');

  useEffect(() => {
    // Fetch data from the given URL
    axios.get('http://localhost:8080/payments')
      .then(response => {
        setData(response.data); // Set the fetched data to state
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const courses = [
    'All',
    'Introduction to Programming',
    'Machine Learning Fundamentals',
    'Data Structures and Algorithms'
  ];

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const filteredData = selectedCourse === 'All' ? data :
    data.filter(item => item.courseName === selectedCourse);

  // Calculate total course fee for the selected course or all courses
  const totalCourseFee = filteredData.reduce((total, item) => total + item.totalCourseFee, 0);

  // Calculate total fee received for the selected course or all courses
  const totalFeeReceived = filteredData.reduce((total, item) => total + item.amountPay, 0);

  // Calculate total fee pending for the selected course or all courses
  const totalFeePending = filteredData.reduce((total, item) => total + item.pendingAmount, 0);

  return (
    <div className="invoice-container">
  <h2 className="text-center mb-4">Invoice Details For Admin</h2>

  <div className="row mb-3">
    <div className="col-lg-6">
      <div className="row">
        <div className="col-lg-12">
          <label htmlFor="courseSelect" className="form-label">Select Course:</label>
        </div>
        <div className="col-lg-12">
          <select
            className="form-select"
            id="courseSelect"
            onChange={handleCourseChange}
            value={selectedCourse}
          >
            {courses.map((course, index) => (
              <option key={index} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </div>
    </div>

    <div className="col-lg-6">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Invoice Summary</h5>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Total Course Fee</th>
                <th scope="col">Total Fee Received</th>
                <th scope="col">Total Fee Pending</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${totalCourseFee}</td>
                <td>
                  <span className="badge bg-success">${totalFeeReceived}</span>
                  <span className="badge bg-light text-dark">of ${totalCourseFee}</span>
                </td>
                <td>
                  <span className="badge bg-danger">${totalFeePending}</span>
                  <span className="badge bg-light text-dark">of ${totalCourseFee}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div className="invoice-row">
  <div className="invoice-row">
      {filteredData.map(item => (
        <div key={item.regId} className="invoice-card">
          <h3>{item.fullName}</h3>
          <table className="invoice-table">
          <tbody>
        <tr>
          <td className="bold">Registration ID:</td>
          <td>{item.regId}</td>
        </tr>
        <tr>
          <td className="bold">Course Name:</td>
          <td>{item.courseName}</td>
        </tr>
        <tr>
          <td className="bold">Total Course Fee:</td>
          <td>${item.totalCourseFee}</td>
        </tr>
        <tr>
          <td className="bold">Payment Type:</td>
          <td>{item.paymentType}</td>
        </tr>
        <tr>
          <td className="bold">Amount Paid:</td>
          <td>${item.amountPay}</td>
        </tr>
        <tr>
          <td className="bold">Pending Amount:</td>
          <td>${item.pendingAmount}</td>
        </tr>
        <tr>
          <td className="bold">Payment Option:</td>
          <td>{item.paymentOption}</td>
        </tr>
      </tbody>
          </table>
        </div>
      ))}
    </div>
  </div>
</div>


  );
}

export default InvoiceAdmin;
