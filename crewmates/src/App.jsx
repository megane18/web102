import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './styles/styles.css';

const COLORS = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'white', 'brown'];
const SPEEDS = ['Slow', 'Normal', 'Fast'];
const TASKS = ['Electrical', 'Navigation', 'Reactor', 'Medical'];

function NotificationModal({ message, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose} className="modal-close">×</button>
      </div>
    </div>
  );
}
function CrewmateForm({ initialData, onSubmit, isEditing }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    color: '',
    speed: '',
    primary_task: ''
  });

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (showModal) {
      timer = setTimeout(() => {
        setShowModal(false);
        navigate('/');
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [showModal, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setShowModal(true);
  };

  return (
    <>
      <form className="crewmate-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Color</label>
          <div className="color-options">
            {COLORS.map(color => (
              <button
                key={color}
                type="button"
                className={`color-option ${formData.color === color ? 'selected' : ''}`}
                style={{ background: color }}
                onClick={() => setFormData({ ...formData, color })}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Speed</label>
          <select
            className="input"
            value={formData.speed}
            onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
            required
          >
            <option value="">Select Speed</option>
            {SPEEDS.map(speed => (
              <option key={speed} value={speed}>{speed}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Primary Task</label>
          <select
            className="input"
            value={formData.primary_task}
            onChange={(e) => setFormData({ ...formData, primary_task: e.target.value })}
            required
          >
            <option value="">Select Task</option>
            {TASKS.map(task => (
              <option key={task} value={task}>{task}</option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="button">
            {isEditing ? 'Update Crewmate' : 'Create Crewmate'}
          </button>
          <button type="button" className="button" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>

      <NotificationModal 
        message={isEditing ? "Crewmate updated successfully!" : "Crewmate created successfully!"}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

function CrewmateCard({ crewmate, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="crewmate-card">
      <div className="crewmate-avatar">
        <div className="crewmate-body" style={{ color: crewmate.color }}>
          <div className="crewmate-visor" />
        </div>
      </div>
      <h3>{crewmate.name}</h3>
      <p>Speed: {crewmate.speed}</p>
      <p>Task: {crewmate.primary_task}</p>
      <div className="card-actions">
        <button onClick={() => navigate(`/crewmate/${crewmate.id}`)} className="button">
          View
        </button>
        <button onClick={() => navigate(`/edit/${crewmate.id}`)} className="button">
          Edit
        </button>
        <button onClick={() => onDelete(crewmate.id)} className="button">
          Delete
        </button>
      </div>
    </div>
  );
}

function CrewmateDetail() {
  const { id } = useParams();
  const [crewmate, setCrewmate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCrewmate = async () => {
      const { data, error } = await supabase
        .from('crewmates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching crewmate:", error.message);
        navigate('/');
      } else {
        setCrewmate(data);
      }
    };

    fetchCrewmate();
  }, [id, navigate]);

  if (!crewmate) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="crewmate-detail">
        <div className="crewmate-avatar">
          <div className="crewmate-body" style={{ color: crewmate.color }}>
            <div className="crewmate-visor" />
          </div>
        </div>
        <h2>{crewmate.name}</h2>
        <p>Color: {crewmate.color}</p>
        <p>Speed: {crewmate.speed}</p>
        <p>Primary Task: {crewmate.primary_task}</p>
        <button onClick={() => navigate('/')} className="button">
          Back to Gallery
        </button>
      </div>
    </div>
  );
}

function EditCrewmate() {
  const { id } = useParams();
  const [crewmate, setCrewmate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCrewmate = async () => {
      const { data, error } = await supabase
        .from('crewmates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching crewmate:", error.message);
        navigate('/');
      } else {
        setCrewmate(data);
      }
    };

    fetchCrewmate();
  }, [id, navigate]);

  const handleUpdate = async (formData) => {
    const { error } = await supabase
      .from('crewmates')
      .update(formData)
      .eq('id', id);
    
    if (error) {
      console.error("Error updating crewmate:", error.message);
    } else {
      navigate('/');
    }
  };

  if (!crewmate) return <div>Loading...</div>;

  return (
    <CrewmateForm 
      initialData={crewmate} 
      onSubmit={handleUpdate}
      isEditing={true}
    />
  );
}

function App() {
  const [crewmates, setCrewmates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCrewmates();
  }, []);

  useEffect(() => {
    let timer;
    if (showModal) {
      timer = setTimeout(() => {
        setShowModal(false);
      }, 3000); // Modal will automatically close after 3 seconds
    }
    return () => clearTimeout(timer);
  }, [showModal]);

  const fetchCrewmates = async () => {
    try {
      const { data, error } = await supabase
        .from('crewmates')
        .select('*');

      if (error) {
        console.error("Error fetching crewmates:", error.message);
        setModalMessage('Error fetching crewmates');
        setShowModal(true);
      } else {
        setCrewmates(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setModalMessage('An unexpected error occurred');
      setShowModal(true);
    }
  };

  const handleCreate = async (formData) => {
    try {
      const { error } = await supabase
        .from('crewmates')
        .insert([formData]);
    
      if (error) {
        console.error("Error creating crewmate:", error.message);
        setModalMessage('Error creating crewmate');
        setShowModal(true);
      } else {
        await fetchCrewmates();
        setModalMessage('Crewmate created successfully!');
        setShowModal(true);
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setModalMessage('An unexpected error occurred');
      setShowModal(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('crewmates')
        .delete()
        .eq('id', id);
    
      if (error) {
        console.error("Error deleting crewmate:", error.message);
        setModalMessage('Error deleting crewmate');
        setShowModal(true);
      } else {
        await fetchCrewmates();
        setModalMessage('Crewmate deleted successfully!');
        setShowModal(true);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setModalMessage('An unexpected error occurred');
      setShowModal(true);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">Among Us Crewmate Manager</h1>
          <Link 
            style={{
              listStyle: 'none',
              textDecoration: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              backgroundColor: 'red',
            }} 
            to="/create" 
            className="buttons"
          >
            Add New Crewmate
          </Link>
        </header>

        <Routes>
          <Route 
            path="/" 
            element={
              <div className="crewmate-grid">
                {crewmates.length === 0 ? (
                  <div className="empty-state">
                    <h2>No Crewmates Found</h2>
                    <p>Start by adding your first crewmate!</p>
                  </div>
                ) : (
                  crewmates.map(crewmate => (
                    <CrewmateCard
                      key={crewmate.id}
                      crewmate={crewmate}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            }
          />
          <Route 
            path="/create" 
            element={<CrewmateForm onSubmit={handleCreate} />} 
          />
          <Route path="/edit/:id" element={<EditCrewmate />} />
          <Route path="/crewmate/:id" element={<CrewmateDetail />} />
        </Routes>

        <NotificationModal 
          message={modalMessage}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
}

export default App;