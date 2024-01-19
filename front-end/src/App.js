import logo from './logo.svg';
import './App.css';
import InvoiceDetails from './Components/InvoiceDetails ';
import ExamFeeInfo from './Components/ExamFeeInfo';

import DisplayInvoice from './Components/DisplayInvoice';
import InvoiceAdmin from './Components/InvoiceAdmin';

import ExamFeeAdmin from './Components/ExamFeeAdmin';
import PendingExamFeeAdmin from './Components/PendingExamFeeAdmin';
import Navbar from './Components/Navbar';
import AdmSideNav from './Components/AdminConsole/AdmSideNav';
import AdmSideNavRoute from './Components/AdminConsole/AdmSideNavRoute';
import NavbarAdmin from './Components/NavbarAdmin';
import NavbarStudent from './Components/NavbarStudent';
import StdSideNavRoute from './Components/StudentConsole/StdSideNavRoute';
function App() {


  return (
    <div>
      
       {/* <DisplayInvoice></DisplayInvoice> */}
     {/* <InvoiceAdmin/> */}
     {/* <ExamFeeInfo></ExamFeeInfo> */}
     {/* <ExamFeeAdmin></ExamFeeAdmin> */}

     <Navbar></Navbar>


     {/* For Admin */}
     
     <NavbarAdmin></NavbarAdmin>
     <AdmSideNavRoute></AdmSideNavRoute>

    {/* For Student */}
    
    {/* <NavbarStudent></NavbarStudent>
    <StdSideNavRoute></StdSideNavRoute> */}

    </div>
  );
  
}

export default App;
