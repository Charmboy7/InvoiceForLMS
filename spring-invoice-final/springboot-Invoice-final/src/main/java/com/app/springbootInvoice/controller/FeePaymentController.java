package com.app.springbootInvoice.controller;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.app.springbootInvoice.model.ExamFee;
import com.app.springbootInvoice.model.FeePayment;
import com.app.springbootInvoice.model.PaymentDetailsDTO;
import com.app.springbootInvoice.model.Student;
import com.app.springbootInvoice.repository.FeePaymentRepository;
import com.app.springbootInvoice.service.ExamFeeService;
import com.app.springbootInvoice.service.FeePaymentService;
import com.app.springbootInvoice.service.StudentService;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/payments")
public class FeePaymentController {

	private final FeePaymentService feePaymentService;

   

    // Define endpoints to handle CRUD operations using HTTP methods
    // Example:

    @GetMapping("/all")
    public List<FeePayment> getAllFeePayments() {
        return feePaymentService.getAllFeePayments();
    }

    


    @PostMapping
    public FeePayment addFeePayment(@RequestBody FeePayment feePayment) {
        return feePaymentService.saveFeePayment(feePayment);
    }

    @DeleteMapping("/{id}")
    public void deleteFeePayment(@PathVariable Long id) {
        feePaymentService.deleteFeePayment(id);
    }
    
    
    private final FeePaymentRepository feePaymentRepository;

    @Autowired
    public FeePaymentController(
            FeePaymentService feePaymentService,
            FeePaymentRepository feePaymentRepository
    ) {
        this.feePaymentService = feePaymentService;
        this.feePaymentRepository = feePaymentRepository;
    }
    
//    @GetMapping("/payment/details/{regId}")
//    public List<Object[]> getPaymentDetailsByRegId(@PathVariable Long regId) {
//        return feePaymentRepository.findPaymentDetailsByRegId(regId);
//    }
    
    @Autowired
    private StudentService studentService;

    @GetMapping("/student/{regId}")
    public List<Object[]> getStudentCourseFeeDetails(@PathVariable Long regId) {
        return studentService.getStudentCourseFeeDetails(regId);
    }
    
    @Autowired
    private ExamFeeService examFeeService;
    
    @GetMapping("examfee/all")
    public List<ExamFee> getAllExamFee(){
    	
    	return examFeeService.getAllExamFee();
    }

    @GetMapping("/examfee/{stdId}")
    public List<Object[]> getDetailsForStudent(@PathVariable Long stdId) {
        return examFeeService.getDetailsForStudent(stdId);
    }
    
    @GetMapping("/withoutFeePayment")
    public List<Object[]> getStudentsWithoutFeePayment() {
        return studentService.findStudentsWithoutFeePayment();
    }
    
}

