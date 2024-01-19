package com.app.springbootInvoice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.app.springbootInvoice.model.ExamFee;

import java.util.List;

public interface ExamFeeRepository extends JpaRepository<ExamFee, Long> {
    
	
	@Query("SELECT cd.courseId, cd.courseName, cd.courseDuration, cd.startDate, cd.endDate, " +
		       "ef.regId, ef.fullName AS examfee_fullname, ef.courseId, ef.courseName, ef.examFees,ef.payDate,ef.paymentType, " +
		       "s.contactNo, s.emailAddress, s.fullName AS student_name " +
		       "FROM CourseDetails cd " +
		       "JOIN ExamFee ef ON cd.courseId = ef.courseId " +
		       "JOIN Student s ON ef.regId = s.stdId " +
		       "WHERE s.stdId = :stdId")


	
    List<Object[]> findDetailsByStudents_StdId(Long stdId);
}

