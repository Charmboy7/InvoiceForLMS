import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import jsPDF from 'jspdf';


const ExamFeeDetails = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/payments/examfee/101');
        setData(response.data);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching data.');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
  };


  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const headers = [
      'Course',
      'Duration',
      'Start Date',
      'End Date',
      'Student ID',
      'Student Name',
      'Contact Email',
      'Payment Status',
      'Amount',
    ];

    const tableData = data.map((item) => ([
      item[1], // Course
      item[2], // Duration
      formatDate(item[3]), // Start Date
      formatDate(item[4]), // End Date
      item[5], // Student ID
      item[6], // Student Name
      item[11], // Contact Email
      'Paid', // Payment Status
      `₹${item[9]}`, // Amount
    ]));

    doc.text('Exam Fee Details', 14, 25);

    doc.autoTable({
      head: [headers],
      body: tableData,
      theme: 'grid',
      styles: { cellPadding: 1.5, fontSize: 10 },
      margin: { top: 40 },
    });

    const filename = 'exam_fee_details.pdf';

    doc.save(filename);
  };

  return (
    <div className="container-fluid" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card ">
        <h2 className="card-header text-center  mb-4">Exam Fee Invoice</h2>
        <div className='row ' >       
        {data.map((item, index) => (
          <div key={index}>
            <div className="row mb-4 m-4 " style={{border:'none'}}>
              {/* Course Details Card */}
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header"><h4>Course Details </h4></div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"><strong>Course:</strong> {item[1]}</li>
                    <li className="list-group-item"><strong>Duration:</strong> {item[2]}</li>
                    <li className="list-group-item"><strong>Start Date:</strong> {formatDate(item[3])}</li>
                    <li className="list-group-item"><strong>End Date:</strong> {formatDate(item[4])}</li>
                  </ul>
                </div>
              </div>

              {/* Student Details Card */}
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header"><h4>Student Details </h4></div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"><strong>Student ID:</strong> {item[5]}</li>
                    <li className="list-group-item"><strong>Student Name:</strong> {item[6]}</li>
                    <li className="list-group-item"><strong>Contact Email:</strong> {item[11]}</li>
                  </ul>
                </div>
              </div>

              {/* Invoice Details Card */}
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header"><h4>Invoice Details</h4></div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"><strong>Payment Status:</strong> {item[7] === 1 ? 'Paid' : 'Not Paid'}</li>
                    <li className="list-group-item"><strong>Amount:</strong> ₹{item[9]}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
          <div className='col-sm-12' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={handleDownloadPDF}>
                Save As PDF <SaveAltIcon />
            </button>
          </div>
          <center>
          <br/>
          <li className="list-group-item text-muted"><em>This is a computer-generated bill. Please keep for your records.</em></li>
          <br/>
          <li className="list-group-item text-info"><strong>Note:</strong> Late fees may apply for delayed payments.</li>
          <br/></center></div>
    </div>
  );
};

export default ExamFeeDetails;
