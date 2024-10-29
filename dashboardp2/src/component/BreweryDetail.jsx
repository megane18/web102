import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../style/Dashboard.css';

const BreweryDetail = () => {
  const { id } = useParams();
  const [brewery, setBrewery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreweryDetails = async () => {
      try {
        const response = await fetch(`https://api.openbrewerydb.org/breweries/${id}`);
        const data = await response.json();
        setBrewery(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching brewery details:', error);
        setLoading(false);
      }
    };

    fetchBreweryDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!brewery) {
    return (
      <div className="app">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h3 className="empty-title">Brewery not found</h3>
          <Link to="/" className="back-button">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="detail-view">
        <div className="detail-header">
          <Link to="/" className="back-button">← Back to Dashboard</Link>
        </div>
        
        <div className="detail-card">
          <h1 className="brewery-name">{brewery.name}</h1>
          
          <div className="detail-info">
            <div className="detail-label">Type</div>
            <div className="detail-value" style={{ textTransform: 'capitalize' }}>
              {brewery.brewery_type}
            </div>
          </div>
          
          <div className="detail-info">
            <div className="detail-label">Address</div>
            <div className="detail-value">
              {brewery.street}<br />
              {brewery.city}, {brewery.state} {brewery.postal_code}
            </div>
          </div>
          
          <div className="detail-info">
            <div className="detail-label">Contact</div>
            <div className="detail-value">
              {brewery.phone ? (
                <div>Phone: {brewery.phone}</div>
              ) : (
                <div>Phone: Not available</div>
              )}
              {brewery.website_url && (
                <a
                  href={brewery.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brewery-website"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
          
          {brewery.latitude && brewery.longitude && (
            <div className="map-container">
              <img
                src={`/api/placeholder/800/300`}
                alt="Map location"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreweryDetail;