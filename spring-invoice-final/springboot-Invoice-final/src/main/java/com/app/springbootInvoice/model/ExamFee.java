package com.app.springbootInvoice.model;

import java.math.BigDecimal;
import java.time.LocalDate; // Import appropriate date class
import jakarta.persistence.*;
@Entity
@Table(name = "examfee")
public class ExamFee {
    @Id
    @Column(name = "regid")
    private Long regId;

    @Column(name = "fullname")
    private String fullName;

    @Column(name = "courseid")
    private Long courseId;

    @Column(name = "coursename")
    private String courseName;

    @Column(name = "examfees")
    private BigDecimal examFees;

    @Column(name = "paymenttype")
    private String paymentType;

   

    @Column(name = "paydate")
    private LocalDate payDate; // Use appropriate date class

    // Constructors, getters, and setters...

    public ExamFee() {
        // Default constructor
    }

    // Constructor with all fields
    public ExamFee(Long regId, String fullName, Long courseId, String courseName, BigDecimal examFees,
                   String paymentType,  LocalDate payDate) {
        this.regId = regId;
        this.fullName = fullName;
        this.courseId = courseId;
        this.courseName = courseName;
        this.examFees = examFees;
        this.paymentType = paymentType;
       
        this.payDate = payDate;
    }

	public Long getRegId() {
		return regId;
	}

	public void setRegId(Long regId) {
		this.regId = regId;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public Long getCourseId() {
		return courseId;
	}

	public void setCourseId(Long courseId) {
		this.courseId = courseId;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public BigDecimal getExamFees() {
		return examFees;
	}

	public void setExamFees(BigDecimal examFees) {
		this.examFees = examFees;
	}

	public String getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(String paymentType) {
		this.paymentType = paymentType;
	}

	public LocalDate getPayDate() {
		return payDate;
	}

	public void setPayDate(LocalDate payDate) {
		this.payDate = payDate;
	}

    // Getters and setters...
    
}
