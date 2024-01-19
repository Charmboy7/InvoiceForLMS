import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import './InvoiceAdmin.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import companyLogo from '../Components/logo.png';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

function InvoiceAdmin() {
  const [data, setData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the given URL
    axios.get('http://localhost:8080/payments/all')
      .then(response => {
        setData(response.data); // Set the fetched data to state
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
      });
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const subjects = [...new Set(data.map(student => student.courseName))];


  // const courses = [
  //   'All',
  //   'Introduction to Programming',
  //   'Machine Learning Fundamentals',
  //   'Data Structures and Algorithms'
  // ];



  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const filteredData = selectedCourse === 'All'
    ? data.filter(item =>
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.regId.toString().includes(searchQuery)
    )
    : data.filter(item =>
      item.courseName === selectedCourse &&
      (item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.regId.toString().includes(searchQuery))
    );


  // Calculate total course fee for the selected course or all courses
  const totalCourseFee = filteredData.reduce((total, item) => total + item.totalCourseFee, 0);

  // Calculate total fee received for the selected course or all courses
  const totalFeeReceived = filteredData.reduce((total, item) => total + item.amountPay, 0);

  // Calculate total fee pending for the selected course or all courses
  const totalFeePending = filteredData.reduce((total, item) => total + item.pendingAmount, 0);

  const handleDownloadPDF = () => {
    const filteredStudents = selectedCourse === 'All' ? data : data.filter(item => item.courseName === selectedCourse);

    const doc = new jsPDF();

    const headers = [
      'Registration ID',
      'Name',
      'Course Name',
      'Total Course Fee',
      'Payment Type',
      'Amount Paid',
      'Pending Amount',
      'Payment Option',
    ];

    const tableData = filteredStudents.map(student => ([
      student.regId,
      student.fullName,
      student.courseName,
      student.totalCourseFee,
      student.paymentType,
      student.amountPay,
      student.pendingAmount,
      student.paymentOption,
    ]));

    // Set the color and font for the title
    doc.setTextColor(0, 0, 128); // Dark navy color
    doc.setFont("helvetica", "bold");

    // Set the title based on the selected course
    const title = selectedCourse === 'All' ? 'All Students Details' : `${selectedCourse} Students Details`;
    doc.text(title, 14, 25);

    // Reset color and font for subsequent content
    doc.setTextColor(0, 0, 0); // Reset to black
    doc.setFont("helvetica", "normal");

    // Add the logo on the first page
    const imgData = companyLogo; // Replace companyLogo with the appropriate image data
    doc.addImage(imgData, 'PNG', 150, 10, 30, 20); // Adjust position and size as needed

    // Handle additional pages
    doc.autoTable({
      head: [headers],
      body: tableData,
      theme: 'grid',
      styles: { cellPadding: 1.5, fontSize: 10 },
      margin: { top: 40 }, // Adjust top margin to make space for the logo
      didDrawPage: function (data) {
        // Add the logo on every page
        doc.addImage(imgData, 'PNG', 150, 10, 30, 20);
      },
    });

    // Set the filename based on the selected course
    const filename = selectedCourse === 'All' ? 'all_students.pdf' : `${selectedCourse.toLowerCase()}_students.pdf`;

    doc.save(filename);
  };








  return (
    <div className="container-fluid invoice-container1" style={{ background: '#e8f4f9', width: '100%' }} id="#top">
      {/* <h2  style={{color:'black'}}>Course Fee Details</h2> */}
      <br />
      <div className="row mb-3" style={{ width: '100%' }}>
        <div className="col-lg-6" >
          <div className="row">
            <div className="col-lg-12">
              <label htmlFor="searchInput" className="form-label" style={{ color: 'black' }} >Search:</label>


            </div>
            <div className="col-lg-12">
              <input
                type="text"
                className="form-control"
                id="searchInput"
                placeholder="Enter name or registration ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              /><br />
              {/* <select
            className="form-select"
            id="courseSelect"
            onChange={handleCourseChange}
            value={selectedCourse}
          >
            {courses.map((course, index) => (
              <option key={index} value={course}>{course}</option>
            ))}
          </select> */}
              <label htmlFor="courseSelect" className="form-label" style={{ color: 'black' }}>Select Course:</label>
              <select
                className="form-select"
                id="courseSelect"
                onChange={handleCourseChange}
                value={selectedCourse}
              >
                <option value="All">All</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
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
                    <td>₹{totalCourseFee}</td>
                    <td>
                      <span className="badge1 bg-success">₹{totalFeeReceived}</span>
                      <span className="badge1 bg-light text-dark">of ₹{totalCourseFee}</span>
                    </td>
                    <td>
                      <span className="badge1 bg-danger">₹{totalFeePending}</span>
                      <span className="badge1 bg-light text-dark">of ₹{totalCourseFee}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <a href='#below'><em>Want to download the details as PDF?</em></a>
            </div>
          </div>
        </div>
      </div>

      <div className="invoice-row1" style={{ width: '100%' }} >
        {filteredData.length > 0 ? (
          <div className="invoice-row1" style={{ width: '100%' }}>
            {filteredData.map(item => (
              <div key={item.regId} className="invoice-card1"  >
                <h3 style={{ color: 'black' }}>{item.fullName}</h3>
                <table className="invoice-table1" style={{ color: 'black' }}>
                  <tbody>
                    <tr>
                      <td className="bold1">Registration ID:</td>
                      <td>{item.regId}</td>
                    </tr>
                    <tr>
                      <td className="bold1">Course Name:</td>
                      <td>{item.courseName}</td>
                    </tr>
                    <tr>
                      <td className="bold1">Total Course Fee:</td>
                      <td>₹{item.totalCourseFee}</td>
                    </tr>
                    <tr>
                      <td className="bold1">Payment Type:</td>
                      <td>{item.paymentType}</td>
                    </tr>
                    <tr>
                      <td className="bold1">Amount Paid:</td>
                      <td>₹{item.amountPay}</td>
                    </tr>
                    <tr>
                      <td className="bold1">Pending Amount:</td>
                      <td>₹{item.pendingAmount}</td>
                    </tr>
                    <tr>
                      <td className="bold1">Payment Option:</td>
                      <td>{item.paymentOption}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>

        ) : (
          <em className="text-center">No results match your search criteria. Please try a different search.</em>
        )}

      </div><br />
      <button className="btn btn-primary" id="below" onClick={handleDownloadPDF}>
        Save As PDF <SaveAltIcon />
      </button>
      <li className="list-group-item text-muted centered-list-item">
        <em>(Download Student Details As PDF)</em>&nbsp;&nbsp;
        <em>OR</em>&nbsp;&nbsp;
        <a href='#top'><em>Go to Top</em></a>
      </li>

    </div>


  );
}

export default InvoiceAdmin;
