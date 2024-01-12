import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import companyLogo from '../Components/logo.png';
import  { useState, useEffect } from 'react';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './DisplayInvoice.css';

const DisplayInvoice = () => {


    
  const [invoices, setInvoices] = useState([]);

  

  useEffect(() => {
    // Fetch data from Spring Boot backend
    fetch('http://localhost:8080/payments/payment/details/2')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched data:', data); // Check the fetched data
        // Set the retrieved data to the invoices state
        setInvoices(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  
  console.log('Invoices state:', invoices); // Check the invoices state here
  

  const companyDetails = {
    companyName: 'Your Company Name',
    companyEmail: 'company@example.com',
    streetAddress: '123 Street Name',
    city: 'City',
    stateProvince: 'State/Province',
    zipCode: '12345',
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

  

  const handleDownloadPDF = () => {
    // Initialize jsPDF
    const doc = new jsPDF();

    // Add logo to the PDF
    const imgData = companyLogo; // Replace companyLogo with the appropriate image data
    doc.addImage(imgData, 'PNG', 150, 10, 30, 30); // Adjust position and size as needed

    // Set headers for the table
    const headers = [
        ['Details', 'Information']
    ];

    // Combine all data into a single array
    const data = invoices.flatMap(invoice => ([
        ['Student ID', invoice[0]],
        ['Name', invoice[1]],
        ['Email', 'example@123gmail.com'], // Static email
        ['Contact Number', '9090909090'], // Static contact number
        ['Course ID', invoice[2]],
        ['Course Name', invoice[3]],
        ['Start Date', new Date(invoice[5]).toLocaleDateString()],
        ['End Date', new Date(invoice[6]).toLocaleDateString()],
        ['Total Course Fees', invoice[7]],
        ['Amount Paid', invoice[9]],
        ['Amount in Words', `${convertNumberToWords(invoice[9])} rupees only`],
        ['Pending Amount', invoice[10]],
        ['Payment Type', invoice[8]],
        ['Payment Option', invoice[11]],
    ]));

     // Set Invoice Details text
     doc.setTextColor(255, 0, 0); // Red color
     doc.setFont('helvetica', 'bold'); // Set font to bold
     doc.setFontSize(20); // Font size
     doc.text('Invoice Details', 10, 25);

    doc.autoTable({
        startY: 50, // Adjust the vertical position as needed
        head: headers,
        body: data,
        theme: 'grid',
        styles: { cellPadding: 1.5, fontSize: 10 },
    });

        // Add Note Message
        const noteMessage = `
        Note:
        For any queries or support, please contact our customer service.
        This is a computer-generated bill and does not require a signature.`;
            doc.setTextColor(80); // Set text color (black)
            doc.setFont('helvetica', 'normal'); // Set font and style
            doc.setFontSize(10); // Set font size
            doc.text(10, doc.autoTable.previous.finalY + 10, noteMessage);

    // Add Terms and Conditions
    const termsText = `
Terms and Conditions:
* Service tax of 18% is applicable on Course Fee.
* Registration Fee, Course Fee once paid, will not be Refunded.
I AGREE TO RECEIVE SMS/EMAIL, INFORMATION PROMOTION, SPECIAL OFFERS
& OTHER SERVICES FROM LMS`;
    doc.setTextColor(26, 35, 126); // Set text color (RGB)
    doc.setFont('helvetica', 'italic'); // Set font and style
    doc.setFontSize(10); // Set font size
    

    // Calculate the position for Contact Information
    const noteTextHeight = doc.getTextDimensions(noteMessage).h;


    doc.text(10, doc.autoTable.previous.finalY + 10 + noteTextHeight + 20, termsText);

    // Add Contact Information
    const contactText = `
Contact us:
Mail: lms@gmail.com
Phone: (123) 456-7890
Address: Sample Address
Instagram: [Instagram Icon]
Twitter: [Twitter Icon]`;
    const contactTextHeight = doc.getTextDimensions(contactText).h;
    doc.setTextColor(0, 105, 92); // Set text color (RGB)
    doc.setFont('helvetica', 'normal'); // Set font and style
    doc.setFontSize(10); // Set font size
    doc.text(10, doc.autoTable.previous.finalY + 10 + noteTextHeight + 50, contactText);

    // Save the PDF
    doc.save('invoice.pdf');
};








  



  return (
    <div className="container mt-4">
    <div className="card invoice-card">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-6">
          <img src={companyLogo} alt="Company Logo" className="company-logo smaller-logo" />

          </div>
          <div className="col-6 text-cente">
        
        <h1 class="invoice-header">INVOICE DETAILS</h1>
     
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-4">
            <h5 className="card-title text-center mb-4">Course Details</h5>
            <table className="table table-hover">
            <tbody>
                  {invoices.map((invoice, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <th>Course ID:</th>
                        <td>{invoice[2]}</td>
                      </tr>
                      <tr>
                        <th>Course Name:</th>
                        <td>{invoice[3]}</td>
                      </tr>
                      <tr>
                        <th>Start Date:</th>
                        <td>{new Date(invoice[5]).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <th>End Date:</th>
                        <td>{new Date(invoice[6]).toLocaleDateString()}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
            </table>
          </div>
          <div className="col-md-4">
            <h5 className="card-title text-center mb-4">Invoice Details</h5>
            <table className="table table-hover">
            <tbody>
                  {invoices.map((invoice, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <th>Total Course Fees:</th>
                        <td>{invoice[7]}</td>
                      </tr>
                      <tr>
                        <th>Amount Paid:</th>
                        <td>{invoice[9]}</td>
                      </tr>
                      <tr>
                        <th>Amount in Words:</th>
                        <td>{convertNumberToWords(invoice[9])} rupees only</td>
                      </tr>
                      <tr>
                        <th>Pending Amount:</th>
                        <td>{invoice[10]}</td>
                      </tr>
                      <tr>
                        <th>Payment Type:</th>
                        <td>{invoice[8]}</td>
                      </tr>
                      <tr>
                        <th>Payment Option:</th>
                        <td>{invoice[11]}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
               
            </table>
          </div>
          <div className="col-md-4">
            <h5 className="card-title text-center mb-4">Student Details</h5>
            <table className="table table-hover">
            <tbody>
                  {invoices.map((invoice, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <th>Student ID:</th>
                        <td>{invoice[0]}</td>
                      </tr>
                      <tr>
                        <th>Name:</th>
                        <td>{invoice[1]}</td>
                      </tr>
                      <tr>
                        <th>Email:</th>
                        <td>example@123gmail.com</td> {/* Static email */}
                      </tr>
                      <tr>
                        <th>Contact Number:</th>
                        <td>9090909090</td> {/* Static contact number */}
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
            </table>
          </div>
        </div>
        <div className="text-center mt-3">
          <button className="btn btn-primary" onClick={handleDownloadPDF}>
            Save Invoice As PDF <SaveAltIcon />
          </button>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default DisplayInvoice;
