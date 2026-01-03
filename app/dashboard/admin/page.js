"use client";
import { useEffect, useState, useMemo } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("patients");
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Verify user is admin
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
          if (user.role !== "admin") {
            setMessage("❌ Access Denied: You must be an admin to access this page");
          }
        }
      } catch (err) {
        console.error("Error checking user:", err);
      }
    }
    checkUser();
  }, []);

  // Forms
  const [patientForm, setPatientForm] = useState({ name: "", email: "", age: "", gender: "", medicalHistory: "", password: "" });
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "" });
  const [appointmentForm, setAppointmentForm] = useState({ patient: "", doctor: "", date: "", time: "", reason: "" });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    if (activeTab === "patients") {
      const res = await fetch("/api/patients");
      if (res.ok) {
        const response = await res.json();
        // Handle paginated response: extract data property if it exists
        const patientsData = Array.isArray(response) ? response : (response.data || []);
        setPatients(patientsData);
      }
    } else if (activeTab === "users") {
      const res = await fetch("/api/users");
      if (res.ok) {
        const allUsers = await res.json();
        const usersArray = Array.isArray(allUsers) ? allUsers : (allUsers.data || []);
        setUsers(usersArray);
        setDoctors(usersArray.filter(u => u.role === "doctor"));
      }
    } else if (activeTab === "appointments") {
      const res = await fetch("/api/appointments");
      if (res.ok) {
        const response = await res.json();
        // Handle paginated response
        const appointmentsData = Array.isArray(response) ? response : (response.data || []);
        setAppointments(appointmentsData);
      }
      const patRes = await fetch("/api/patients");
      if (patRes.ok) {
        const response = await patRes.json();
        const patientsData = Array.isArray(response) ? response : (response.data || []);
        setPatients(patientsData);
      }
      // Also fetch doctors for the dropdown
      const usersRes = await fetch("/api/users");
      if (usersRes.ok) {
        const allUsers = await usersRes.json();
        const usersArray = Array.isArray(allUsers) ? allUsers : (allUsers.data || []);
        setDoctors(usersArray.filter(u => u.role === "doctor"));
      }
    }
  }

  // Safely filter patients - ensure patients is always an array
  // Use useMemo to prevent unnecessary recalculations and ensure type safety
  const filteredPatients = useMemo(() => {
    if (!Array.isArray(patients)) {
      console.warn("patients is not an array:", patients);
      return [];
    }
    return patients.filter(p => {
      if (!p || !p.name || !p.email) return false;
      const searchLower = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower)
      );
    });
  }, [patients, searchTerm]);

  async function handleAddPatient(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...patientForm,
          age: Number(patientForm.age),
          medicalHistory: patientForm.medicalHistory.split(",").map(i => i.trim()).filter(i => i),
        }),
      });
      if (res.ok) {
        const newPatient = await res.json();
        // Handle both single patient object and paginated response
        const patientData = newPatient.data || newPatient;
        setPatients(prev => {
          const currentPatients = Array.isArray(prev) ? prev : [];
          return [patientData, ...currentPatients];
        });
        setPatientForm({ name: "", email: "", age: "", gender: "", medicalHistory: "", password: "" });
        setMessage("✅ Patient added!");
        setTimeout(() => setMessage(""), 3000);
        // Refresh the list
        fetchData();
      } else {
        const error = await res.json();
        setMessage(`❌ ${error.error || "Error"}`);
      }
    } catch (err) {
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddUser(e) {
    e.preventDefault();
    
    // Validate form
    if (!userForm.name || !userForm.email || !userForm.password || !userForm.role) {
      setMessage("❌ Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });
      
      if (!res.ok) {
        // Try to parse error response
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { error: `HTTP ${res.status}: ${res.statusText}` };
        }
        console.error("Error response:", errorData);
        setMessage(`❌ ${errorData.error || "Error adding user"}`);
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      const newUser = data.user || data;
      setUsers(prev => {
        const currentUsers = Array.isArray(prev) ? prev : [];
        return [...currentUsers, newUser];
      });
      setUserForm({ name: "", email: "", password: "", role: "" });
      setMessage("✅ User added!");
      setTimeout(() => setMessage(""), 3000);
      
      // Refresh the users list
      try {
        const usersRes = await fetch("/api/users");
        if (usersRes.ok) {
          const allUsers = await usersRes.json();
          const usersArray = Array.isArray(allUsers) ? allUsers : (allUsers.data || []);
          setUsers(usersArray);
          setDoctors(usersArray.filter(u => u.role === "doctor"));
        }
      } catch (refreshErr) {
        console.error("Error refreshing users:", refreshErr);
      }
    } catch (err) {
      console.error("Network error:", err);
      setMessage(`❌ Network error: ${err.message || "Failed to connect to server. Please check if the server is running."}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignAppointment(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...appointmentForm,
          date: new Date(appointmentForm.date),
        }),
      });
      if (res.ok) {
        const newAppt = await res.json();
        // Handle both single appointment object and paginated response
        const appointmentData = newAppt.data || newAppt;
        setAppointments(prev => {
          const currentAppointments = Array.isArray(prev) ? prev : [];
          return [appointmentData, ...currentAppointments];
        });
        setAppointmentForm({ patient: "", doctor: "", date: "", time: "", reason: "" });
        setMessage("✅ Appointment assigned!");
        setTimeout(() => setMessage(""), 3000);
        // Refresh the list
        fetchData();
      } else {
        const error = await res.json();
        setMessage(`❌ ${error.error || "Error"}`);
      }
    } catch (err) {
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <h1 className="mb-8">Admin Dashboard</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <h1 className="mb-8">Admin Dashboard</h1>

        {message && (
          <div className={`mb-6 alert ${message.includes("✅") ? "alert-success" : "alert-error"}`}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
          {["patients", "users", "appointments"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="btn"
              suppressHydrationWarning
              style={{
                background: activeTab === tab ? "#2563eb" : "transparent",
                color: activeTab === tab ? "white" : "#2563eb",
                border: activeTab === tab ? "none" : "1px solid #2563eb",
                borderRadius: "0.5rem 0.5rem 0 0",
                padding: "0.75rem 1.5rem",
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "patients" && (
          <div>
            <div className="flex-between mb-4">
              <h2>Patients</h2>
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ maxWidth: '300px' }}
                suppressHydrationWarning
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div className="card">
                <h3 className="mb-4">Add Patient</h3>
                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input className="form-input" name="name" value={patientForm.name} onChange={(e) => setPatientForm({...patientForm, name: e.target.value})} required suppressHydrationWarning />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" name="email" value={patientForm.email} onChange={(e) => setPatientForm({...patientForm, email: e.target.value})} required suppressHydrationWarning />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input type="number" className="form-input" name="age" value={patientForm.age} onChange={(e) => setPatientForm({...patientForm, age: e.target.value})} required suppressHydrationWarning />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-select" name="gender" value={patientForm.gender} onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})} required suppressHydrationWarning>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Medical History (comma separated)</label>
                    <input className="form-input" name="medicalHistory" value={patientForm.medicalHistory} onChange={(e) => setPatientForm({...patientForm, medicalHistory: e.target.value})} suppressHydrationWarning />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password (for login access - optional)</label>
                    <input type="password" className="form-input" name="password" value={patientForm.password} onChange={(e) => setPatientForm({...patientForm, password: e.target.value})} placeholder="Leave empty if no login needed" suppressHydrationWarning />
                    <small className="text-gray-600" style={{ fontSize: '0.875rem' }}>If provided, patient can login with this email and password</small>
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-primary w-full" suppressHydrationWarning>Add Patient</button>
                </form>
              </div>
              <div className="card">
                <h3 className="mb-4">All Patients ({Array.isArray(filteredPatients) ? filteredPatients.length : 0})</h3>
                {Array.isArray(filteredPatients) && filteredPatients.length > 0 ? (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr><th>Name</th><th>Email</th><th>Age</th><th>Gender</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {filteredPatients.map(p => (
                          <tr key={p._id}>
                            <td>{p.name}</td><td>{p.email}</td><td>{p.age}</td><td className="capitalize">{p.gender}</td>
                            <td><button onClick={() => {if(confirm("Delete?")) {fetch(`/api/patients/${p._id}`, {method: "DELETE"}).then(() => fetchData());}}} className="link text-red-600" style={{border:'none',background:'none',cursor:'pointer'}}>Delete</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p className="text-center text-gray-600 py-8">No patients found</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <h2 className="mb-4">Staff Management</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div className="card">
                <h3 className="mb-4">Add Staff Member</h3>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input className="form-input" value={userForm.name} onChange={(e) => setUserForm({...userForm, name: e.target.value})} required suppressHydrationWarning />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} required suppressHydrationWarning />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-input" value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} required suppressHydrationWarning />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select className="form-select" value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value})} required suppressHydrationWarning>
                      <option value="">Select Role</option>
                      <option value="doctor">Doctor</option>
                      <option value="pharmacist">Pharmacist</option>
                      <option value="lab_technician">Lab Technician</option>
                    </select>
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-primary w-full" suppressHydrationWarning>Add Staff</button>
                </form>
              </div>
              <div className="card">
                <h3 className="mb-4">All Staff ({Array.isArray(users) ? users.length : 0})</h3>
                {Array.isArray(users) && users.length > 0 ? (
                  <div className="table-container">
                    <table className="table">
                      <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td className="capitalize">{u.role.replace('_', ' ')}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p className="text-center text-gray-600 py-8">No staff members</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div>
            <h2 className="mb-4">Assign Appointments</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div className="card">
                <h3 className="mb-4">Assign Appointment</h3>
                <form onSubmit={handleAssignAppointment} className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Patient</label>
                    <select className="form-select" value={appointmentForm.patient} onChange={(e) => setAppointmentForm({...appointmentForm, patient: e.target.value})} required suppressHydrationWarning>
                      <option value="">Select Patient</option>
                      {Array.isArray(patients) && patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Doctor</label>
                    <select className="form-select" value={appointmentForm.doctor} onChange={(e) => setAppointmentForm({...appointmentForm, doctor: e.target.value})} required suppressHydrationWarning>
                      <option value="">Select Doctor</option>
                      {Array.isArray(doctors) && doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-input" value={appointmentForm.date} onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})} required suppressHydrationWarning />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input type="time" className="form-input" value={appointmentForm.time} onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})} required suppressHydrationWarning />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reason</label>
                    <input className="form-input" value={appointmentForm.reason} onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})} required suppressHydrationWarning />
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-primary w-full" suppressHydrationWarning>Assign Appointment</button>
                </form>
              </div>
              <div className="card">
                <h3 className="mb-4">All Appointments ({Array.isArray(appointments) ? appointments.length : 0})</h3>
                {Array.isArray(appointments) && appointments.length > 0 ? (
                  <div className="table-container">
                    <table className="table">
                      <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
                      <tbody>
                        {appointments.map(a => (
                          <tr key={a._id}>
                            <td>{a.patient?.name || 'N/A'}</td>
                            <td>{a.doctor?.name || 'N/A'}</td>
                            <td>{new Date(a.date).toLocaleDateString()}</td>
                            <td>{a.time}</td>
                            <td className="capitalize">{a.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p className="text-center text-gray-600 py-8">No appointments</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
