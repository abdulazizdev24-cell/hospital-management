"use client";
import { useEffect, useState } from "react";

export default function LabTechnicianDashboard() {
  const [labTests, setLabTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [resultsForm, setResultsForm] = useState({ results: "", notes: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchLabTests();
  }, []);

  async function fetchLabTests() {
    try {
      const res = await fetch("/api/lab-tests");
      if (res.ok) {
        const data = await res.json();
        setLabTests(data);
      }
    } catch (err) {
      console.error("Error fetching lab tests:", err);
    }
  }

  async function handleUploadResults() {
    if (!selectedTest) return;
    setMessage("");
    try {
      const res = await fetch(`/api/lab-tests/${selectedTest._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          results: resultsForm.results,
          notes: resultsForm.notes,
        }),
      });
      if (res.ok) {
        setMessage("✅ Results uploaded!");
        setSelectedTest(null);
        setResultsForm({ results: "", notes: "" });
        fetchLabTests();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await res.json();
        setMessage(`❌ ${error.error || "Error"}`);
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  }

  const pendingTests = labTests.filter(t => t.status === "ordered" || t.status === "in_progress");
  const completedTests = labTests.filter(t => t.status === "completed");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <h1 className="mb-8">Lab Technician Dashboard</h1>

        {message && (
          <div className={`mb-6 alert ${message.includes("✅") ? "alert-success" : "alert-error"}`}>
            {message}
          </div>
        )}

        <div className="grid grid-2 gap-6 mb-6">
          <div className="card">
            <h3 className="mb-2">Pending Tests</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{pendingTests.length}</p>
          </div>
          <div className="card">
            <h3 className="mb-2">Completed</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{completedTests.length}</p>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4">Lab Tests ({labTests.length})</h2>
          {labTests.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead><tr><th>Patient</th><th>Test Name</th><th>Type</th><th>Status</th><th>Ordered Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {labTests.map(t => (
                    <tr key={t._id}>
                      <td>{t.patient?.name || 'N/A'}</td>
                      <td>{t.testName}</td>
                      <td className="capitalize">{t.testType.replace('_', ' ')}</td>
                      <td className="capitalize">{t.status}</td>
                      <td>{new Date(t.orderedDate).toLocaleDateString()}</td>
                      <td>
                        {(t.status === "ordered" || t.status === "in_progress") && (
                          <button onClick={() => setSelectedTest(t)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Upload Results</button>
                        )}
                        {t.status === "completed" && t.results && (
                          <button onClick={() => setSelectedTest(t)} className="link">View Results</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-center text-gray-600 py-8">No lab tests</p>}
        </div>

        {selectedTest && (
          <div className="modal-overlay" onClick={() => { setSelectedTest(null); setResultsForm({ results: "", notes: "" }); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Lab Test Results - {selectedTest.testName}</h2>
                <button className="modal-close" onClick={() => { setSelectedTest(null); setResultsForm({ results: "", notes: "" }); }}>×</button>
              </div>
              <div className="space-y-4">
                <div><label className="form-label">Patient</label><p>{selectedTest.patient?.name}</p></div>
                <div><label className="form-label">Test Type</label><p className="capitalize">{selectedTest.testType.replace('_', ' ')}</p></div>
                {selectedTest.status === "completed" ? (
                  <>
                    <div><label className="form-label">Results</label><p style={{ whiteSpace: 'pre-wrap' }}>{selectedTest.results}</p></div>
                    {selectedTest.notes && <div><label className="form-label">Notes</label><p>{selectedTest.notes}</p></div>}
                    <div><label className="form-label">Completed Date</label><p>{new Date(selectedTest.completedDate).toLocaleString()}</p></div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label">Results</label>
                      <textarea className="form-input" rows="6" value={resultsForm.results} onChange={(e) => setResultsForm({...resultsForm, results: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Notes</label>
                      <textarea className="form-input" rows="3" value={resultsForm.notes} onChange={(e) => setResultsForm({...resultsForm, notes: e.target.value})} />
                    </div>
                    <button onClick={handleUploadResults} className="btn btn-primary w-full">Upload Results</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

