import logo from './logo.svg';
import './App.css';
import InvoiceDetails from './Components/InvoiceDetails ';
import ExamFeeInfo from './Components/ExamFeeInfo';
import ListEmployeeComponent from './Components/ListEmployeeComponent';
import DisplayInvoice from './Components/DisplayInvoice';
import InvoiceAdmin from './Components/InvoiceAdmin';
import TryComp from './Components/TryComp';
import ExamFeeAdmin from './Components/ExamFeeAdmin';
import PendingExamFeeAdmin from './Components/PendingExamFeeAdmin';


function App() {


  return (
    <div>
      
       {/* <DisplayInvoice></DisplayInvoice> */}
     {/* <InvoiceAdmin/> */}
     {/* <ExamFeeInfo></ExamFeeInfo> */}
     <ExamFeeAdmin></ExamFeeAdmin>
  
    </div>
  );
  
}

export default App;
