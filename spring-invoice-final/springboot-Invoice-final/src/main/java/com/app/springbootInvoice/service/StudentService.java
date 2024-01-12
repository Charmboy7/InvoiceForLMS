package com.app.springbootInvoice.service;




import com.app.springbootInvoice.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public List<Object[]> getStudentCourseFeeDetails(Long regIdFromFrontend) {
        return studentRepository.fetchStudentCourseFeeDetails(regIdFromFrontend);
    }
    
    public List<Object[]> findStudentsWithoutFeePayment() {
        return studentRepository.findStudentsWithoutFeePayment();
    }
}

