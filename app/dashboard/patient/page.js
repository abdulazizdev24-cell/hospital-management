"use client";
import { useEffect, useState } from "react";

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labTests, setLabTests] = useState([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    if (activeTab === "appointments") {
      const res = await fetch("/api/appointments");
      if (res.ok) setAppointments(await res.json());
    } else if (activeTab === "prescriptions") {
      const res = await fetch("/api/prescriptions");
      if (res.ok) setPrescriptions(await res.json());
    } else if (activeTab === "lab-tests") {
      const res = await fetch("/api/lab-tests");
      if (res.ok) setLabTests(await res.json());
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container" style={{ maxWidth: '56rem' }}>
        <h1 className="mb-8">Patient Dashboard</h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
          {["overview", "appointments", "prescriptions", "lab-tests"].map(tab => (
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

        {activeTab === "overview" && (
          <div className="card">
            <h2 className="mb-4">Welcome to your Dashboard</h2>
            <p className="text-gray-600 mb-4">View your appointments, prescriptions, and lab test results using the tabs above.</p>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="card">
            <h2 className="mb-4">My Appointments ({appointments.length})</h2>
            {appointments.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead><tr><th>Doctor</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th></tr></thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a._id}>
                        <td>{a.doctor?.name || 'N/A'}</td>
                        <td>{new Date(a.date).toLocaleDateString()}</td>
                        <td>{a.time}</td>
                        <td>{a.reason}</td>
                        <td className="capitalize">{a.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-center text-gray-600 py-8">No appointments</p>}
          </div>
        )}

        {activeTab === "prescriptions" && (
          <div className="card">
            <h2 className="mb-4">My Prescriptions ({prescriptions.length})</h2>
            {prescriptions.length > 0 ? (
              <div className="space-y-4">
                {prescriptions.map(p => (
                  <div key={p._id} className="card" style={{ background: '#f9fafb' }}>
                    <div className="flex-between mb-2">
                      <strong>Prescribed by: {p.doctor?.name}</strong>
                      <span className="capitalize" style={{ padding: '0.25rem 0.75rem', borderRadius: '0.25rem', background: p.status === 'delivered' ? '#d1fae5' : p.status === 'dispensed' ? '#dbeafe' : '#fee2e2', color: p.status === 'delivered' ? '#065f46' : p.status === 'dispensed' ? '#1e40af' : '#991b1b' }}>{p.status}</span>
                    </div>
                    <div className="mb-2"><strong>Medicines:</strong></div>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                      {p.medicines.map((m, idx) => (
                        <li key={idx} className="mb-1">{m.name} - {m.dosage}, {m.frequency}, Duration: {m.duration}, Qty: {m.quantity}</li>
                      ))}
                    </ul>
                    {p.notes && <p className="text-gray-600"><strong>Notes:</strong> {p.notes}</p>}
                    <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Date: {new Date(p.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-center text-gray-600 py-8">No prescriptions</p>}
          </div>
        )}

        {activeTab === "lab-tests" && (
          <div className="card">
            <h2 className="mb-4">My Lab Tests ({labTests.length})</h2>
            {labTests.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead><tr><th>Test Name</th><th>Type</th><th>Status</th><th>Ordered Date</th><th>Results</th></tr></thead>
                  <tbody>
                    {labTests.map(t => (
                      <tr key={t._id}>
                        <td>{t.testName}</td>
                        <td className="capitalize">{t.testType.replace('_', ' ')}</td>
                        <td className="capitalize">{t.status}</td>
                        <td>{new Date(t.orderedDate).toLocaleDateString()}</td>
                        <td>{t.results || "Pending"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-center text-gray-600 py-8">No lab tests</p>}
          </div>
        )}
      </div>
    </div>
  );
}
