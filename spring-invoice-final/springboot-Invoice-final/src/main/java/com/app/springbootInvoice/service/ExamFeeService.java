package com.app.springbootInvoice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.springbootInvoice.model.ExamFee;
import com.app.springbootInvoice.model.FeePayment;
import com.app.springbootInvoice.repository.ExamFeeRepository;

import java.util.List;

@Service
public class ExamFeeService {

    @Autowired
    private ExamFeeRepository examFeeRepository;

    public List<Object[]> getDetailsForStudent(Long stdId) {
        return examFeeRepository.findDetailsByStudents_StdId(stdId);
    }
    
    public List<ExamFee> getAllExamFee() {
        return examFeeRepository.findAll();
    }
}
