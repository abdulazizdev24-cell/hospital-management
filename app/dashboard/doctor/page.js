"use client";
import { useEffect, useState } from "react";

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [message, setMessage] = useState("");
  const [prescriptionForm, setPrescriptionForm] = useState({ patient: "", medicines: [{ name: "", dosage: "", frequency: "", duration: "", quantity: "" }], notes: "" });
  const [labTestForm, setLabTestForm] = useState({ patient: "", testName: "", testType: "", notes: "" });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    if (activeTab === "appointments") {
      const res = await fetch("/api/appointments");
      if (res.ok) setAppointments(await res.json());
    } else if (activeTab === "patients") {
      const res = await fetch("/api/patients");
      if (res.ok) setPatients(await res.json());
    }
  }

  async function handlePrescribe(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...prescriptionForm,
          medicines: prescriptionForm.medicines.filter(m => m.name && m.dosage),
        }),
      });
      if (res.ok) {
        setMessage("✅ Prescription created!");
        setPrescriptionForm({ patient: "", medicines: [{ name: "", dosage: "", frequency: "", duration: "", quantity: "" }], notes: "" });
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await res.json();
        setMessage(`❌ ${error.error || "Error"}`);
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  }

  async function handleOrderLabTest(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/lab-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(labTestForm),
      });
      if (res.ok) {
        setMessage("✅ Lab test ordered!");
        setLabTestForm({ patient: "", testName: "", testType: "", notes: "" });
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await res.json();
        setMessage(`❌ ${error.error || "Error"}`);
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <h1 className="mb-8">Doctor Dashboard</h1>

        {message && (
          <div className={`mb-6 alert ${message.includes("✅") ? "alert-success" : "alert-error"}`}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
          {["appointments", "patients", "prescribe", "lab-tests"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="btn"
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
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {activeTab === "appointments" && (
          <div className="card">
            <h2 className="mb-4">Upcoming Appointments ({appointments.length})</h2>
            {appointments.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a._id}>
                        <td>{a.patient?.name || 'N/A'}</td>
                        <td>{new Date(a.date).toLocaleDateString()}</td>
                        <td>{a.time}</td>
                        <td>{a.reason}</td>
                        <td className="capitalize">{a.status}</td>
                        <td>
                          {a.status !== "completed" && (
                            <button
                              className="btn btn-primary"
                              style={{ padding: '0.35rem 0.75rem' }}
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/appointments/${a._id}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ status: "completed" }),
                                  });
                                  if (res.ok) {
                                    const updated = await res.json();
                                    setAppointments(
                                      appointments.map(appt => appt._id === updated._id ? updated : appt)
                                    );
                                    setMessage("✅ Appointment marked as checked");
                                    setTimeout(() => setMessage(""), 3000);
                                  } else {
                                    const err = await res.json();
                                    setMessage(`❌ ${err.error || "Failed to update"}`);
                                  }
                                } catch (error) {
                                  setMessage("❌ Network error while updating");
                                }
                              }}
                            >
                              Mark Checked
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-center text-gray-600 py-8">No upcoming appointments</p>}
          </div>
        )}

        {activeTab === "patients" && (
          <div className="card">
            <h2 className="mb-4">Patient Records ({patients.length})</h2>
            {patients.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead><tr><th>Name</th><th>Email</th><th>Age</th><th>Gender</th><th>Actions</th></tr></thead>
                  <tbody>
                    {patients.map(p => (
                      <tr key={p._id}>
                        <td>{p.name}</td><td>{p.email}</td><td>{p.age}</td><td className="capitalize">{p.gender}</td>
                        <td><button onClick={() => setSelectedPatient(p)} className="link" style={{border:'none',background:'none',cursor:'pointer'}}>View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-center text-gray-600 py-8">No patients</p>}
          </div>
        )}

        {activeTab === "prescribe" && (
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="mb-4">Prescribe Medicine</h2>
            <form onSubmit={handlePrescribe} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Patient</label>
                <select className="form-select" value={prescriptionForm.patient} onChange={(e) => setPrescriptionForm({...prescriptionForm, patient: e.target.value})} required>
                  <option value="">Select Patient</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              {prescriptionForm.medicines.map((med, idx) => (
                <div key={idx} className="card" style={{ background: '#f9fafb', padding: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Medicine Name</label>
                    <input className="form-input" value={med.name} onChange={(e) => {
                      const newMeds = [...prescriptionForm.medicines];
                      newMeds[idx].name = e.target.value;
                      setPrescriptionForm({...prescriptionForm, medicines: newMeds});
                    }} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Dosage</label>
                      <input className="form-input" value={med.dosage} onChange={(e) => {
                        const newMeds = [...prescriptionForm.medicines];
                        newMeds[idx].dosage = e.target.value;
                        setPrescriptionForm({...prescriptionForm, medicines: newMeds});
                      }} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Frequency</label>
                      <input className="form-input" placeholder="e.g., 2x daily" value={med.frequency} onChange={(e) => {
                        const newMeds = [...prescriptionForm.medicines];
                        newMeds[idx].frequency = e.target.value;
                        setPrescriptionForm({...prescriptionForm, medicines: newMeds});
                      }} required />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Duration</label>
                      <input className="form-input" placeholder="e.g., 7 days" value={med.duration} onChange={(e) => {
                        const newMeds = [...prescriptionForm.medicines];
                        newMeds[idx].duration = e.target.value;
                        setPrescriptionForm({...prescriptionForm, medicines: newMeds});
                      }} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Quantity</label>
                      <input type="number" className="form-input" value={med.quantity} onChange={(e) => {
                        const newMeds = [...prescriptionForm.medicines];
                        newMeds[idx].quantity = e.target.value;
                        setPrescriptionForm({...prescriptionForm, medicines: newMeds});
                      }} required />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setPrescriptionForm({...prescriptionForm, medicines: [...prescriptionForm.medicines, { name: "", dosage: "", frequency: "", duration: "", quantity: "" }]})} className="btn btn-secondary">Add Another Medicine</button>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-input" rows="3" value={prescriptionForm.notes} onChange={(e) => setPrescriptionForm({...prescriptionForm, notes: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary w-full">Create Prescription</button>
            </form>
          </div>
        )}

        {activeTab === "lab-tests" && (
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="mb-4">Order Lab Test</h2>
            <form onSubmit={handleOrderLabTest} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Patient</label>
                <select className="form-select" value={labTestForm.patient} onChange={(e) => setLabTestForm({...labTestForm, patient: e.target.value})} required>
                  <option value="">Select Patient</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Test Name</label>
                <input className="form-input" value={labTestForm.testName} onChange={(e) => setLabTestForm({...labTestForm, testName: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Test Type</label>
                <select className="form-select" value={labTestForm.testType} onChange={(e) => setLabTestForm({...labTestForm, testType: e.target.value})} required>
                  <option value="">Select Type</option>
                  <option value="blood">Blood Test</option>
                  <option value="urine">Urine Test</option>
                  <option value="xray">X-Ray</option>
                  <option value="ct_scan">CT Scan</option>
                  <option value="mri">MRI</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-input" rows="3" value={labTestForm.notes} onChange={(e) => setLabTestForm({...labTestForm, notes: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary w-full">Order Lab Test</button>
            </form>
          </div>
        )}

        {selectedPatient && (
          <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Patient Details</h2>
                <button className="modal-close" onClick={() => setSelectedPatient(null)}>×</button>
              </div>
              <div className="space-y-4">
                <div><label className="form-label">Name</label><p style={{fontSize:'1.125rem'}}>{selectedPatient.name}</p></div>
                <div><label className="form-label">Email</label><p style={{fontSize:'1.125rem'}}>{selectedPatient.email}</p></div>
                <div><label className="form-label">Age</label><p style={{fontSize:'1.125rem'}}>{selectedPatient.age}</p></div>
                <div><label className="form-label">Gender</label><p style={{fontSize:'1.125rem'}} className="capitalize">{selectedPatient.gender}</p></div>
                <div><label className="form-label">Medical History</label><p style={{fontSize:'1.125rem'}}>{selectedPatient.medicalHistory?.join(", ") || "None"}</p></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
