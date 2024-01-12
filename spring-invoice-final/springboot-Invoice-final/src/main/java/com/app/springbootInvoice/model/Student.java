package com.app.springbootInvoice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "std_id")
    private Long stdId;

    @Column(name = "contact_no")
    private String contactNo;

    @Column(name = "email_address")
    private String emailAddress;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "password")
    private String password;

    @Column(name = "role")
    private String role;

    // Constructors, getters, and setters

    public Student() {
    }

    public Student(String contactNo, String emailAddress, String fullName, String password, String role) {
        this.contactNo = contactNo;
        this.emailAddress = emailAddress;
        this.fullName = fullName;
        this.password = password;
        this.role = role;
    }

    // Getters and setters for all fields

    public Long getStdId() {
        return stdId;
    }

    public void setStdId(Long stdId) {
        this.stdId = stdId;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

	@Override
	public String toString() {
		return "Student [stdId=" + stdId + ", contactNo=" + contactNo + ", emailAddress=" + emailAddress + ", fullName="
				+ fullName + ", password=" + password + ", role=" + role + "]";
	}
    
    
}
