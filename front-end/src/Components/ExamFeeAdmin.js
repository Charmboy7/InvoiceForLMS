import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExamFeeAdmin.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import companyLogo from '../Components/logo.png';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function ExamFeeAdmin() {
    const [allStudentsData, setAllStudentsData] = useState([]);
    const [withoutFeePaymentData, setWithoutFeePaymentData] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQueryWithoutFee, setSearchQueryWithoutFee] = useState(''); // New state for second search bar
    const [courseOptionsWithoutFee, setCourseOptionsWithoutFee] = useState([]); // New state for course options in the second set of cards
    const [selectedCourseWithoutFee, setSelectedCourseWithoutFee] = useState('All'); // New state for selected course in the second set of cards

    useEffect(() => {
        // Fetch data from the original URL
        axios.get('http://localhost:8080/payments/examfee/all')
            .then(response => {
                setAllStudentsData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        // Fetch data from the new URL for students without fee payment
        axios.get('http://localhost:8080/payments/withoutFeePayment')
            .then(response => {
                setWithoutFeePaymentData(response.data);
    
                // Extract unique course names from the updated response data
                const uniqueCoursesWithoutFee = [...new Set(response.data.map(record => record[3]))];
                setCourseOptionsWithoutFee(uniqueCoursesWithoutFee);
            })
            .catch(error => {
                console.error('Error fetching data from withoutFeePayment:', error);
            });
    }, [withoutFeePaymentData]);
    

    const courses = [...new Set(allStudentsData.map(record => record.courseName))];

  
    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const handleCourseChangeWithoutFee = (e) => {
        setSelectedCourseWithoutFee(e.target.value);
    };
    const filteredData = selectedCourse === 'All'
        ? allStudentsData.filter(item =>
            (item.fullName && item.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.regId && item.regId.toString().includes(searchQuery))
        )
        : allStudentsData.filter(item =>
            item.courseName === selectedCourse &&
            ((item.fullName && item.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.regId && item.regId.toString().includes(searchQuery)))
        );

    const totalExamFees = filteredData.reduce((total, item) => total + (item.examFees || 0), 0);
    const handleDownloadPDFWithoutFee = () => {
        const doc = new jsPDF();

        const headers = [
            'Registration ID',
            'Full Name',
            'Email',
            'Phone',
            'Additional Data 1',
            'Additional Data 2',
        ];

        const tableData = withoutFeePaymentData.map(student => ([
            student[0], // Registration ID
            student[1], // Full Name
            student[4], // Email
            student[5], // Phone
            student[2] || '', // Additional Data 1
            student[3] || '', // Additional Data 2
        ]));

        doc.setTextColor(0, 0, 128);
        doc.setFont('helvetica', 'bold');

        const title = 'Students Without Exam Fee Payment';
        doc.text(title, 14, 25);

        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');

        const imgData = companyLogo;
        doc.addImage(imgData, 'PNG', 150, 10, 30, 20);

        doc.autoTable({
            head: [headers],
            body: tableData,
            theme: 'grid',
            styles: { cellPadding: 1.5, fontSize: 10 },
            margin: { top: 40 },
            didDrawPage: function (data) {
                doc.addImage(imgData, 'PNG', 150, 10, 30, 20);
            },
        });

        const filename = 'students_without_exam_fee_payment.pdf';

        doc.save(filename);
    };

    const handleDownloadPDF = () => {
        const filteredStudents = selectedCourse === 'All' ? allStudentsData : allStudentsData.filter(item => item.courseName === selectedCourse);

        const doc = new jsPDF();

        const headers = [
            'Registration ID',
            'Full Name',
            'Course Name',
            'Exam Fees',
            'Payment Type',
            'Status',
            'Payment Date',
        ];

        const tableData = filteredStudents.map(student => ([
            student.regId,
            student.fullName,
            student.courseName,
            student.examFees,
            student.paymentType,
            'Paid',
            student.payDate,
        ]));

        doc.setTextColor(0, 0, 128);
        doc.setFont('helvetica', 'bold');

        const title = selectedCourse === 'All' ? 'All Students Exam Fee Details' : `${selectedCourse} Students Exam Fee Details`;
        doc.text(title, 14, 25);

        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');

        const imgData = companyLogo;
        doc.addImage(imgData, 'PNG', 150, 10, 30, 20);

        doc.autoTable({
            head: [headers],
            body: tableData,
            theme: 'grid',
            styles: { cellPadding: 1.5, fontSize: 10 },
            margin: { top: 40 },
            didDrawPage: function (data) {
                doc.addImage(imgData, 'PNG', 150, 10, 30, 20);
            },
        });

        const filename = selectedCourse === 'All' ? 'all_students_exam_fee.pdf' : `${selectedCourse.toLowerCase()}_students_exam_fee.pdf`;

        doc.save(filename);
    };

    const filteredWithoutFeeData = withoutFeePaymentData.filter(item =>
        (item[1] && item[1].toLowerCase().includes(searchQueryWithoutFee.toLowerCase())) ||
        (item[0] && item[0].toString().includes(searchQueryWithoutFee)) &&
        (selectedCourseWithoutFee === 'All' || item[6] === selectedCourseWithoutFee)
    );

   

    return (
        <div className="exam-fee-container">
            <h2 className="text-center mb-4">Exam Fee Details For Admin</h2>
            <h3>Students Who Paid Exam Fee</h3>
            <div className="row mb-3">
                <div className="col-lg-6">
                    <div className="row">
                        <div className="col-lg-12">
                            <label htmlFor="searchInput" className="form-label">Search:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="searchInput"
                                placeholder="Enter name or registration ID"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            /><br />
                            <label htmlFor="courseSelect" className="form-label">Select Course:</label>
                            <select
                                className="form-select"
                                id="courseSelect"
                                onChange={handleCourseChange}
                                value={selectedCourse}
                            >
                                <option value="All">All</option>
                                {courses.map(course => (
                                    <option key={course} value={course}>{course}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Exam Fee Summary
                           
                            </h5>
                            
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">Total Exam Fees Received</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    <tr>
                                        <td>₹{totalExamFees}</td>
                                    </tr>
                                    
                                   
                            
                                </tbody>
                            </table>
                            <a href='#withoutFees'>View Students Without Exam Fee Payment </a>
                        </div>
                    </div>
                </div>
            </div>
            <button className="btn btn-primary" onClick={handleDownloadPDF}>
                Save As PDF <SaveAltIcon />
            </button><br />
            <div className="exam-fee-row">
                {filteredData.map(item => (
                    <div key={item.regId} className="exam-fee-card">
                        <h3>{item.fullName}</h3>
                        <table className="exam-fee-table">
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
                                    <td className="bold">Exam Fees:</td>
                                    <td>₹{item.examFees}</td>
                                </tr>
                                <tr>
                                    <td className="bold">Payment Type:</td>
                                    <td>{item.paymentType}</td>
                                </tr>
                                <tr>
                                    <td className="bold">Status:</td>
                                    <td>Paid</td>
                                </tr>
                                <tr>
                                    <td className="bold">Payment Date:</td>
                                    <td>{item.payDate}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div><br />
            <br />

            {/* Display data for students without fee payment */}
            <h2 id="withoutFees" className="text-center mb-4">Students Without Exam Fee Payment</h2>

            <div className="row mb-3">
                <div className="col-lg-6">
                    <div className="row">
                        <div className="col-lg-12">
                        <label htmlFor="searchInputWithoutFee" className="form-label">Search:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="searchInputWithoutFee"
                                placeholder="Enter name or registration ID"
                                value={searchQueryWithoutFee}
                                onChange={(e) => setSearchQueryWithoutFee(e.target.value)}
                            /><br />
                            <label htmlFor="courseSelectWithoutFee" className="form-label">Select Course:</label>
                            <select
                                className="form-select"
                                id="courseSelectWithoutFee"
                                onChange={handleCourseChangeWithoutFee}
                                value={selectedCourseWithoutFee}
                            >
                                <option value="All">All</option>
                                {courseOptionsWithoutFee.map(course => (
                                    <option key={course} value={course}>{course}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Students Without Exam Fee Payment Summary</h5>
                            {/* Add any relevant summary data */}
                        </div>
                    </div>
                </div>
            </div>

            <button className="btn btn-primary" onClick={handleDownloadPDFWithoutFee}>
                Save As PDF <SaveAltIcon />
            </button>
            <div className="exam-fee-row">
                {withoutFeePaymentData.map(item => (
                    <div key={item[0]} className="card mt-3">
                        <div className="card-body">
                            <h3 className="card-title">{item[1]}</h3>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td className="bold">Registration ID:</td>
                                        <td>{item[0]}</td>
                                    </tr>
                                    <tr>
                                        <td className="bold">Name:</td>
                                        <td>{item[1]}</td>
                                    </tr>
                                    <tr>
                                        <td className="bold">Email:</td>
                                        <td>{item[4]}</td>
                                    </tr>
                                    <tr>
                                        <td className="bold">Phone:</td>
                                        <td>{item[5]}</td>
                                    </tr>
                                    {/* {item[2] !== null && (
                                        <tr>
                                            <td className="bold">Additional Data 1:</td>
                                            <td>{item[2]}</td>
                                        </tr>
                                    )} */}
                                    {item[3] !== null && (
                                        <tr>
                                            <td className="bold">Course Name:</td>
                                            <td>{item[3]}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExamFeeAdmin;
