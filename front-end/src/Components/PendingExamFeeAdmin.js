import React, { useState, useEffect } from 'react';

const StudentCard = ({ id, name, course, specialization, email, phone }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '5px', maxWidth: '300px' }}>
      <h3>{name}</h3>
      <p>ID: {id}</p>
      <p>Email: {email}</p>
      <p>Phone: {phone}</p>
      {course && <p>Course: {course}</p>}
      {specialization && <p>Specialization: {specialization}</p>}
    </div>
  );
};

const StudentList = ({ data }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      {data.map(student => (
        <StudentCard key={student[0]} id={student[0]} name={student[1]} course={student[2]} specialization={student[3]} email={student[4]} phone={student[5]} />
      ))}
    </div>
  );
};

const PendingExamFeeAdmin = () => {
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    // Fetch data from the API or your server
    fetch('http://localhost:8080/payments/withoutFeePayment')
      .then(response => response.json())
      .then(data => setStudentData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Empty dependency array ensures that the effect runs once on component mount

  return (
    <div>
      <h1>Student Details</h1>
      {studentData.length > 0 ? <StudentList data={studentData} /> : <p>Loading...</p>}
    </div>
  );
};

export default PendingExamFeeAdmin;
