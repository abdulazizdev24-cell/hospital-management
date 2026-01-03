"use client";
import { useEffect, useState } from "react";

export default function PharmacistDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  async function fetchPrescriptions() {
    try {
      const res = await fetch("/api/prescriptions");
      if (res.ok) {
        const data = await res.json();
        setPrescriptions(data);
      }
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
    }
  }

  async function handleUpdateStatus(id, status) {
    try {
      const res = await fetch(`/api/prescriptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setMessage("✅ Status updated!");
        fetchPrescriptions();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await res.json();
        setMessage(`❌ ${error.error || "Error"}`);
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  }

  const pendingPrescriptions = prescriptions.filter(p => p.status === "pending");
  const dispensedPrescriptions = prescriptions.filter(p => p.status === "dispensed");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <h1 className="mb-8">Pharmacist Dashboard</h1>

        {message && (
          <div className={`mb-6 alert ${message.includes("✅") ? "alert-success" : "alert-error"}`}>
            {message}
          </div>
        )}

        <div className="grid grid-2 gap-6 mb-6">
          <div className="card">
            <h3 className="mb-2">Pending Prescriptions</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{pendingPrescriptions.length}</p>
          </div>
          <div className="card">
            <h3 className="mb-2">Dispensed</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{dispensedPrescriptions.length}</p>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4">All Prescriptions ({prescriptions.length})</h2>
          {prescriptions.length > 0 ? (
            <div className="space-y-4">
              {prescriptions.map(p => (
                <div key={p._id} className="card" style={{ background: '#f9fafb' }}>
                  <div className="flex-between mb-3">
                    <div>
                      <strong>Patient: {p.patient?.name || 'N/A'}</strong>
                      <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Prescribed by: {p.doctor?.name}</p>
                    </div>
                    <div>
                      <span className="capitalize" style={{ padding: '0.25rem 0.75rem', borderRadius: '0.25rem', background: p.status === 'delivered' ? '#d1fae5' : p.status === 'dispensed' ? '#dbeafe' : '#fee2e2', color: p.status === 'delivered' ? '#065f46' : p.status === 'dispensed' ? '#1e40af' : '#991b1b', marginRight: '1rem' }}>{p.status}</span>
                      {p.status === "pending" && (
                        <button onClick={() => handleUpdateStatus(p._id, "dispensed")} className="btn btn-primary" style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}>Dispense</button>
                      )}
                      {p.status === "dispensed" && (
                        <button onClick={() => handleUpdateStatus(p._id, "delivered")} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Mark Delivered</button>
                      )}
                    </div>
                  </div>
                  <div className="mb-2"><strong>Medicines:</strong></div>
                  <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                    {p.medicines.map((m, idx) => (
                      <li key={idx} className="mb-1">{m.name} - {m.dosage}, {m.frequency}, Duration: {m.duration}, Qty: {m.quantity}</li>
                    ))}
                  </ul>
                  {p.notes && <p className="text-gray-600 mb-2"><strong>Notes:</strong> {p.notes}</p>}
                  <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Date: {new Date(p.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-center text-gray-600 py-8">No prescriptions</p>}
        </div>
      </div>
    </div>
  );
}

