package com.app.springbootInvoice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.app.springbootInvoice.model.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    // You can define custom query methods here if needed
	
	 @Query("SELECT s.stdId, s.fullName, s.emailAddress,s.contactNo, cd, fp FROM Student s " +
	            "JOIN CourseDetails cd ON s.stdId = cd.courseId " +
	            "JOIN FeePayment fp ON s.stdId = fp.regId " +
	            "WHERE fp.regId = :regIdFromFrontend")
	    List<Object[]> fetchStudentCourseFeeDetails(Long regIdFromFrontend);
	    
	    @Query("SELECT s.stdId, s.fullName, cd.courseId, cd.courseName, s.emailAddress, s.contactNo " +
	    	       "FROM Student s " +
	    	       "LEFT JOIN FeePayment fp ON s.stdId = fp.regId " +
	    	       "LEFT JOIN CourseDetails cd ON s.stdId = cd.courseId " +
	    	       "WHERE fp.regId IS NULL")
	    	List<Object[]> findStudentsWithoutFeePayment();

	    
	    
}

