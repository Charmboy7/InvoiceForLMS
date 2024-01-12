import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import  { useState, useEffect } from 'react';
import EmployeeService from '../Service/EmployeeService';
import companyLogo from '../Components/logo.png';

const InvoiceDetails = ({ invoiceData }) => {
  // Dummy data (replace this with your actual data)
  const dummyData = {
    billNo: '102',
    date: '2024-01-04',
    studentEmail: 'example@example.com',
    feeReceived: '$500',
    sumOfRupees: '$1000',
    paymentMode: 'Credit Card',
    courseRegisteredFor: 'React Development',
    totalCourseFee: '$1200',
    studentContactNo: '123-456-7890',
    totalPaid: '$700',
    paymentType: 'One-time Payment',
    balance: '$500',
  };


  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    // Function to add the logo to the PDF
    const addLogoToPDF = (logoImg) => {
      const logoWidth = 50;
      const logoHeight = (logoImg.height * logoWidth) / logoImg.width;
      const offsetX = doc.internal.pageSize.width - logoWidth - 10;
      const offsetY = 10;
  
      doc.addImage(logoImg, 'PNG', offsetX, offsetY, logoWidth, logoHeight);
  
      return offsetY + logoHeight + 10; // Return the logo's height + padding
    };
  
    // Function to generate the PDF
    const generatePDF = (logoImg) => {
      const logoHeight = addLogoToPDF(logoImg);
  
      const tableData1 = employees.map((employee) => ({
        'ID': employee.id,
        'Employee Name': employee.name,
        'Course Name': employee.course,
        'Fee Received': employee.feeReceived,
        'Payment Method': employee.paymentMethod,
      }));
    
      doc.autoTable({
        startY: logoHeight + 10,
        head: [
          { 'ID': 'ID', 'Employee Name': 'Employee Name', 'Course Name': 'Course Name', 'Fee Received': 'Fee Received', 'Payment Method': 'Payment Method' }
        ],
        body: tableData1,
      });
    
      const tableData = Object.entries(mergedData).map(([key, value]) => ({
        Field: key,
        Value: value,
      }));
    
      const tableHeight1 = doc.previousAutoTable.finalY || 10; // Get the height of the first table
    
      doc.autoTable({
        startY: tableHeight1 + 20, // Use the height of the first table as the start position for the second table
        head: [{ Field: 'Field', Value: 'Value' }],
        body: tableData,
      });
  
      const termsAndConditions = `
  Terms and Conditions: 
  * Service tax of 18% is applicable on Course Fee.
  * Registration Fee, Fine & Course Fee once paid, will not be Refunded.
  * This is Computer generated bill; no signature is required.
  I AGREE TO RECEIVE SMS/EMAIL, INFORMATION PROMOTION, SPECIAL OFFERS 
  & OTHER SERVICES FROM LMS`;
  
      doc.setFont('helvetica');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
  
      // Calculate the height of the table
      const tableHeight = doc.previousAutoTable.finalY || 10;
  
      doc.text(termsAndConditions, 14, tableHeight + 10);
  
      doc.save('invoice_details.pdf');
    };
  
    const logoImg = new Image();
  
    logoImg.onload = function () {
      generatePDF(logoImg);
    };
  
    logoImg.onerror = function () {
      console.error('Error loading the logo image.');
      generatePDF(); // Generate PDF without the logo
    };
  
    logoImg.src="companyLogo";

  };
  
  
  
  

  const handleDownloadText = () => {
    let text = 'Invoice Details\n\n';
  
    const keys = Object.keys(mergedData);
    const values = Object.values(mergedData);
  
    const maxLength = keys.reduce((max, key) => (key.length > max ? key.length : max), 0);
  
    for (let i = 0; i < keys.length; i++) {
      text += `${keys[i].padEnd(maxLength, ' ')}: ${values[i]}\n`;
    }
  
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'invoice_details.txt');
  };
  
  function convertNumberToWords(number) {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
    const numToWords = (num) => {
      if (num < 10) {
        return ones[num];
      } else if (num < 20) {
        return teens[num - 10];
      } else if (num < 100) {
        return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
      } else if (num < 1000) {
        return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 !== 0 ? ' ' + numToWords(num % 100) : '');
      } else if (num < 1000000) {
        return numToWords(Math.floor(num / 1000)) + ' thousand' + (num % 1000 !== 0 ? ' ' + numToWords(num % 1000) : '');
      }
      // You can extend this for higher values like millions, billions, etc.
      return 'Number out of range';
    };
  
    const result = numToWords(number);
    return result.charAt(0).toUpperCase() + result.slice(1); // Capitalize the first letter
  }
  
  // Example usage:
  const amountInNumbers = 10000;
  const amountInWords = convertNumberToWords(amountInNumbers);
  console.log(amountInWords); // Output: "Ten thousand"
  
  

  // Merge dummy data with provided invoiceData, if available
  const mergedData = { ...dummyData, ...invoiceData };

  const [employees, setEmployees] = useState([]);

    useEffect(() => {
        EmployeeService.getEmployees()
            .then((response) => {
                const dataFromAPI = response.data;
                // Assuming dataFromAPI is an array of arrays representing employees/students
                const formattedData = dataFromAPI.map((employeeArray) => {
                    return {
                        id: employeeArray[0],
                        name: employeeArray[1],
                        course: employeeArray[2],
                        feeReceived: employeeArray[3],
                        paymentMethod: employeeArray[4]
                    };
                });
                setEmployees(formattedData);
            })
            .catch((error) => {
                console.error('Error fetching employees:', error);
            });
    }, []);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center mb-4">Invoice Details</h2>
          <table className="table">
  <tbody>
    {employees.map((employee) => (
      <>
        <tr key={employee.id}>
          <td>ID:</td>
          <td colSpan="4">{employee.id}</td>
        </tr>
        <tr>
          <td>Employee Name:</td>
          <td colSpan="4">{employee.name}</td>
        </tr>
        <tr>
          <td>Course Name:</td>
          <td colSpan="4">{employee.course}</td>
        </tr>
        <tr>
          <td>Fee Received:</td>
          <td colSpan="4">{employee.feeReceived}</td>
        </tr>
        <tr>
          <td>Payment Method:</td>
          <td colSpan="4">{employee.paymentMethod}</td>
        </tr>
      </>
    ))}
    <tr>
      <td>Sum of Rupees:</td>
      <td colSpan="4">{mergedData.sumOfRupees} ({amountInWords} rupees)</td>
    </tr>
    <tr>
      <td>Payment Mode:</td>
      <td colSpan="4">{mergedData.paymentMode}</td>
    </tr>
    <tr>
      <td>Course Registered For:</td>
      <td colSpan="4">{mergedData.courseRegisteredFor}</td>
    </tr>
    <tr>
      <td>Total Course Fee:</td>
      <td colSpan="4">{mergedData.totalCourseFee}</td>
    </tr>
    <tr>
      <td>Student Contact No:</td>
      <td colSpan="4">{mergedData.studentContactNo}</td>
    </tr>
    <tr>
      <td>Total Paid:</td>
      <td colSpan="4">{mergedData.totalPaid}</td>
    </tr>
    <tr>
      <td>Payment Type:</td>
      <td colSpan="4">{mergedData.paymentType}</td>
    </tr>
    <tr>
      <td>Balance:</td>
      <td colSpan="4">{mergedData.balance}</td>
    </tr>
    {/* Add more rows for additional fields */}
  </tbody>
</table>


          <div><button className="btn btn-primary mx-2" onClick={handleDownloadPDF}>
              Download PDF
            </button>
            <button className="btn btn-primary mx-2" onClick={handleDownloadText}>
              Download Text
            </button><br/><br/>
  <p><strong>Terms and Conditions:</strong></p>
  <ul>
    <li>Service tax of 18% is applicable on Course Fee.</li>
    <li>Registration Fee, Fine & Course Fee once paid, will not be Refunded.</li>
    <li>This is a Computer-generated bill; no signature is required.</li>
  </ul>
  <p>I AGREE TO RECEIVE SMS/EMAIL, INFORMATION PROMOTION, SPECIAL OFFERS & OTHER SERVICES FROM LMS</p>
</div><br/><br/>
    <div className="text-center mt-3">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
