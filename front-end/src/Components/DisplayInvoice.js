import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './DisplayInvoice.css';
import companyLogo1 from '../Components/logo1.png';
import companyLogo from '../Components/logo.png';

const DisplayInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const storedStudentId = sessionStorage.getItem('studentId');
  const defaultStudentId = storedStudentId ? parseInt(storedStudentId) : 1;
  const [studentId] = useState(storedStudentId);
  console.log(studentId);

  useEffect(() => {
    fetch(`http://localhost:8080/payments/student/${storedStudentId}`)
      .then((response) => response.json())
      .then((data) => {
        setInvoices(data);
        setData(data);
      })
      .catch((error) => {
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
    // doc.addImage(imgData, 'PNG', 150, 10, 30, 30); // Adjust position and size as needed
    doc.addImage(imgData, 'PNG', 150, 10, 30, 20);
    // Set headers for the table
    const headers = [
      ['Details', 'Information']
    ];

    // Combine all data into a single array
    const data = invoices.flatMap(invoice => {
      if (invoice && invoice.length >= 6) {
        return [
          ['Student ID', invoice[0]],
          ['Name', invoice[1]],
          ['Email', invoice[2]], // Static email
          ['Contact Number', invoice[3]], // Static contact number
          ['Course ID', invoice[4]?.courseId],
          ['Course Name', invoice[4]?.courseName],
          ['Duration', invoice[4]?.courseDuration],
          ['Start Date', new Date(invoice[4]?.startDate).toLocaleDateString()],
          ['End Date', new Date(invoice[4]?.endDate).toLocaleDateString()],
          ['Total Course Fees', invoice[5]?.totalCourseFee],
          ['Amount Paid', invoice[5]?.amountPay],
          ['Amount in Words', `${convertNumberToWords(invoice[5]?.amountPay)} rupees only`],
          ['Pending Amount', invoice[5]?.pendingAmount],
          ['Payment Type', invoice[5]?.paymentType],
          ['Payment Option', invoice[5]?.paymentOption],
          ['Total Installments', invoice[5]?.installcount],
          ['Paid Date', invoice[5]?.paydate]
        ];
      } else {
        return []; // Return an empty array if the invoice structure is incorrect
      }
    });

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

//     // Add Terms and Conditions
//     const termsText = `
// Terms and Conditions:
// * Service tax of 18% is applicable on Course Fee.
// * Registration Fee, Course Fee once paid, will not be Refunded.
// I AGREE TO RECEIVE SMS/EMAIL, INFORMATION PROMOTION, SPECIAL OFFERS
// & OTHER SERVICES FROM LMS`;
//     doc.setTextColor(26, 35, 126); // Set text color (RGB)
//     doc.setFont('helvetica', 'italic'); // Set font and style
//     doc.setFontSize(10); // Set font size


//     // Calculate the position for Contact Information
//     const noteTextHeight = doc.getTextDimensions(noteMessage).h;


//     doc.text(10, doc.autoTable.previous.finalY + 10 + noteTextHeight + 20, termsText);

    // Add Contact Information
//     const contactText = `
// Contact us:
// Mail: lms@gmail.com
// Phone: (123) 456-7890
// Address: Sample Address
// Instagram: [Instagram Icon]
// Twitter: [Twitter Icon]`;
//     const contactTextHeight = doc.getTextDimensions(contactText).h;
//     doc.setTextColor(0, 105, 92); // Set text color (RGB)
//     doc.setFont('helvetica', 'normal'); // Set font and style
//     doc.setFontSize(10); // Set font size
//     doc.text(10, doc.autoTable.previous.finalY + 10 + noteTextHeight + 50, contactText);

    // Save the PDF
    doc.save('invoice.pdf');
  };

  return (
    <div className="container mt-4"  >
      <div className="card " style={{ background: '#e8f4f9'}}>
        <div className="card-body" >

          {/* Inside the return statement */}
          {invoices.map((invoice, index) => (
            <React.Fragment key={index}>
              <div className="row" >

                <div className="col-md-2">

                  <div className="card-body">

                    <div className="card" style={{ border: '0', boxShadow: 'none' , background: '#e8f4f9'}}>
                      <div className="card-body p-1" style={{background:'#e8f4f9'}}>
                        <br/><br/><br/><br/><br/><br/><br/>
                      
                       
                        
                            <img src={companyLogo1}  alt="Logo" width="150" height="120" />
                         
                        
                      </div>
                    </div>
                  </div>




                </div>


                <div className="col-md-5">
                  <div className="card" >
                    <div className="card-body">
                      <h5 className="card-title text-center mb-4">Student Details</h5>
                      <table className="table table-hover">
                        <tbody>
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
                            <td>{invoice[2]}</td> {/* Static email */}
                          </tr>
                          <tr>
                            <th>Contact Number:</th>
                            <td>{invoice[3]}</td> {/* Static contact number */}
                          </tr>
                          {/* Add more student details here */}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title text-center mb-4">Course Details</h5>
                      <table className="table table-hover">
                        <tbody>
                          <tr>
                            <th>Course ID:</th>
                            <td>{invoice[4]?.courseId}</td>
                          </tr>
                          <tr>
                            <th>Course Name:</th>
                            <td>{invoice[4]?.courseName}</td>
                          </tr>
                          <tr>
                            <th>Start Date:</th>
                            <td>{new Date(invoice[4]?.startDate).toLocaleDateString()}</td>
                          </tr>
                          <tr>
                            <th>Duration</th>
                            <td>{invoice[4].courseDuration}</td>
                          </tr>
                          {/* <tr>
                      <th>End Date:</th>
                      <td>{new Date(invoice[3].endDate).toLocaleDateString()}</td>
                  </tr> */}
                          {/* Add more course details here */}
                        </tbody>
                      </table>
                    </div>
                  </div>



                  <em>This is a computer-generated bill. Please keep for your records.</em>




                </div>





                <div className="col-md-5" >
                  <br />
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title text-center mb-4">Fees Details</h5>
                      {/* Render Invoice Details */}
                      <table className="table table-hover">
                        <tbody>
                          <tr>
                            <th>Total Course Fees:</th>
                            <td>{invoice[5]?.totalCourseFee}</td>

                          </tr>
                          <tr>
                            <th>Amount Paid:</th>
                            <td>{invoice[5]?.amountPay}</td>

                          </tr>
                          <tr>
                            <th>Amount in Words:</th>
                            <td>{convertNumberToWords(invoice[5]?.amountPay)} rupees only</td>

                          </tr>
                          <tr>
                            <th>Pending Amount:</th>
                            <td>{invoice[5]?.pendingAmount}</td>

                          </tr>
                          <tr>
                            <th>Payment Type:</th>
                            <td>{invoice[5]?.paymentType}</td>
                          </tr>
                          <tr>
                            <th>Payment Option:</th>
                            <td>{invoice[5]?.paymentOption}</td>
                          </tr>
                          <tr>
                            <th>Installment Count:</th>
                            <td>{invoice[5]?.installcount}</td>
                          </tr>
                          <tr>
                            <th>Paid Date:</th>
                            <td>{new Date(invoice[5]?.paydate).toLocaleDateString()}</td>
                          </tr>
                          {/* Add more invoice details here */}
                        </tbody>
                      </table>

                    </div>

                  
                  </div>


                  <div className="col-md-12">
                    <div className="card" style={{ border: '0', boxShadow: 'none', background: '#e8f4f9' }} >
                      <div className="card-body">

                        <div className="text-center mt-3">
                          <button className="btn btn-primary" onClick={handleDownloadPDF}>
                            Save Invoice As PDF <SaveAltIcon />
                          </button>
                         <em>(Download Invoice As PDF)</em>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* <div className="col-md-5">
                  <div className="card">
                    <div className="card-body">
                   
                    <div className="text-center mt-3">
            <button className="btn btn-primary" onClick={handleDownloadPDF}>
              Save Invoice As PDF <SaveAltIcon />
            </button>
            
                    </div>
                  </div>
                </div>
             
              </div> */}


              </div>



            </React.Fragment>
          ))}


          {/* <div className="text-center mt-3">
            <button className="btn btn-primary" onClick={handleDownloadPDF}>
              Save Invoice As PDF <SaveAltIcon />
            </button>
          </div> */}
          
        </div>
      
      </div>
    </div>
  );

};

export default DisplayInvoice;
