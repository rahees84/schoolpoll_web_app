import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../constants/appConstants";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    class_division: "",
    position: "",
  });

  const token = JSON.parse(localStorage.getItem("token"));

  // Fetch candidates
  const fetchCandidates = async () => {
    try {
      const res = await axios.get(API.CANDIDATES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(res.data);
    } catch (err) {
      console.error("Error fetching candidates", err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveCandidate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // EDITING - PUT
        await axios.put(`${API.CANDIDATES}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // ADDING - POST
        await axios.post(API.CANDIDATES, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setFormData({ name: "", code: "", class_division: "", position: "" });
      setShowForm(false);
      setEditingId(null);
      fetchCandidates();
    } catch (err) {
      console.error("Error saving candidate", err);
      let message = "Failed to save candidate";

      if (err.response && err.response.data) {
        message =
          err.response.data.error || err.response.data.message || message;
      }

      alert(message);
    }
  };

  const handleEdit = (candidate) => {
    setFormData({
      name: candidate.name,
      code: candidate.code,
      class_division: candidate.class_division,
      position: candidate.position,
    });
    setEditingId(candidate._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {};

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="fas fa-users me-2"></i>Candidates
        </h3>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus me-1"></i>Add Candidate
        </button>
      </div>

      {candidates.length === 0 ? (
        <div className="alert alert-info">No candidates added yet.</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Class</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.code}</td>
                <td>{c.class_division}</td>
                <td>{c.position}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(c)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Candidate Modal */}
      {showForm && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSaveCandidate}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingId ? "Edit Candidate" : "Add Candidate"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowForm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                  />
                  <input
                    className="form-control mb-2"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Code"
                    required
                  />
                  <input
                    className="form-control mb-2"
                    name="class_division"
                    value={formData.class_division}
                    onChange={handleChange}
                    placeholder="Class Division"
                  />
                  <input
                    className="form-control mb-2"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Position"
                  />
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    {editingId ? "Update" : "Save"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;
