import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [role, setRole] = useState('');
  const [admins, setAdmins] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [members, setMembers] = useState([]);
  const [instructorMembers, setInstructorMembers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setRole(data.role);
        setAdmins(data.admins || []);
        setInstructors(data.instructors || []);
        setMembers(data.members || []);
        setInstructorMembers(data.instructorMembers || []);
      });
  }, []);

  if (role === "admin") {
    return (
      <div>
        <h2>Admin Dashboard</h2>
        <h3>Admins</h3>
        <ul>{admins.map(u => <li key={u.email}>{u.name} {u.firstname} ({u.email})</li>)}</ul>
        <h3>Instructors</h3>
        <ul>{instructors.map(u => <li key={u.email}>{u.name} {u.firstname} ({u.email})</li>)}</ul>
        <h3>Members</h3>
        <ul>{members.map(u => <li key={u.email}>{u.name} {u.firstname} ({u.email})</li>)}</ul>
      </div>
    );
  }
  if (role === "instructor") {
    return (
      <div>
        <h2>Instructor Dashboard</h2>
        <h3>Your Members</h3>
        <ul>{instructorMembers.map(u => <li key={u.email}>{u.name} {u.firstname} ({u.email})</li>)}</ul>
      </div>
    );
  }
  if (role === "member") {
    return <h1 style={{fontSize: '3em', textAlign: 'center', marginTop: '2em'}}>MEMBER</h1>;
  }
  return <div>Loading...</div>;
}

export default Dashboard;