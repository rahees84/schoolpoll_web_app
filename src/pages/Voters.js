import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../constants/appConstants';

const Voters = () => {
  const [voters, setVoters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    roll_number: '',
    class_division: '',
    gender: '',
  });

  const token = JSON.parse(localStorage.getItem('token'));

  const fetchVoters = async () => {
    try {
      const res = await axios.get(API.VOTERS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVoters(res.data);
    } catch (err) {
      console.error("Error fetching voters", err);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveVoter = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API.VOTERS}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API.VOTERS, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setFormData({ name: '', roll_number: '', class_division: '', gender: '' });
      setShowForm(false);
      setEditingId(null);
      fetchVoters();
    } catch (err) {
      console.error("Error saving voter", err);
      let message = "Failed to save voter";

      if (err.response && err.response.data) {
        message = err.response.data.error || err.response.data.message || message;
      }

      alert(message);
    }
  };

  const handleEdit = (voter) => {
    setFormData({
      name: voter.name,
      roll_number: voter.roll_number,
      class_division: voter.class_division,
      gender: voter.gender,
    });
    setEditingId(voter._id);
    setShowForm(true);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3><i className="fas fa-user-graduate me-2"></i>Voters</h3>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <i className="fas fa-plus me-1"></i>Add Voter
        </button>
      </div>

      {voters.length === 0 ? (
        <div className="alert alert-info">No voters added yet.</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Class</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {voters.map(v => (
              <tr key={v._id}>
                <td>{v.name}</td>
                <td>{v.roll_number}</td>
                <td>{v.class_division}</td>
                <td>{v.gender}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(v)}>
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Voter Modal */}
      {showForm && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSaveVoter}>
                <div className="modal-header">
                  <h5 className="modal-title">{editingId ? 'Edit Voter' : 'Add Voter'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <div className="modal-body">
                  <input className="form-control mb-2" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                  <input className="form-control mb-2" name="roll_number" value={formData.roll_number} onChange={handleChange} placeholder="Roll Number" required />
                  <input className="form-control mb-2" name="class_division" value={formData.class_division} onChange={handleChange} placeholder="Class Division" />
                  <input className="form-control mb-2" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" />
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    {editingId ? 'Update' : 'Save'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voters;
