import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '../style/Dashboard.css';


// Main Dashboard Component
const BreweryDashboard = () => {
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 12;

  useEffect(() => {
    const fetchBreweries = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.openbrewerydb.org/breweries?page=${page}&per_page=${perPage}`
        );
        const data = await response.json();
        
        if (page === 1) {
          setBreweries(data);
        } else {
          setBreweries(prev => [...prev, ...data]);
        }
        
        setHasMore(data.length === perPage);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching breweries:', error);
        setLoading(false);
      }
    };
    
    fetchBreweries();
  }, [page]);

  const getTypeColor = (type) => {
    const colors = {
      micro: '#FF6B6B',
      brewpub: '#4ECDC4',
      regional: '#45B7D1',
      contract: '#96CEB4',
      proprietor: '#FFEEAD',
      large: '#FFD93D',
      planning: '#6C5B7B',
    };
    return colors[type] || '#95A5A6';
  };

  const breweryTypeData = Object.entries(
    breweries.reduce((acc, brewery) => {
      acc[brewery.brewery_type] = (acc[brewery.brewery_type] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const stateData = Object.entries(
    breweries.reduce((acc, brewery) => {
      acc[brewery.state] = (acc[brewery.state] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([state, count]) => ({ state, count }));

  const filteredBreweries = breweries.filter(brewery => {
    const matchesSearch = brewery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brewery.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = stateFilter ? brewery.state === stateFilter : true;
    const matchesType = typeFilter ? brewery.brewery_type === typeFilter : true;
    return matchesSearch && matchesState && matchesType;
  });

  const uniqueStates = [...new Set(breweries.map(b => b.state))].sort();
  const breweryTypes = [...new Set(breweries.map(b => b.brewery_type))].sort();

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">Brewery Explorer</h1>
          <p className="subtitle">
            Discover and explore craft breweries across the United States
          </p>
        </header>

        <div className="charts-grid">
          <div className="chart-container">
            <h3 className="chart-title">Top 10 States by Number of Breweries</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4facfe" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3 className="chart-title">Distribution by Brewery Type</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breweryTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {breweryTypeData.map((entry, index) => (
                    <Cell key={index} fill={getTypeColor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-value">{filteredBreweries.length}</div>
            <div className="stat-label">Total Breweries</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{uniqueStates.length}</div>
            <div className="stat-label">States Covered</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{breweryTypes.length}</div>
            <div className="stat-label">Brewery Types</div>
          </div>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search breweries by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="select-input"
          >
            <option value="">All States</option>
            {uniqueStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="select-input"
          >
            <option value="">All Types</option>
            {breweryTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {filteredBreweries.length > 0 ? (
          <>
            <div className="breweries-grid">
              {filteredBreweries.map(brewery => (
                <Link 
                  to={`/brewery/${brewery.id}`} 
                  key={brewery.id}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="brewery-card">
                    <div 
                      className="brewery-type-banner"
                      style={{ backgroundColor: getTypeColor(brewery.brewery_type) }}
                    />
                    <div className="brewery-content">
                      <h3 className="brewery-name">{brewery.name}</h3>
                      <div className="brewery-info">
                        <span className="brewery-info-icon">📍</span>
                        {brewery.city}, {brewery.state}
                      </div>
                      <div className="brewery-info">
                        <span className="brewery-info-icon">🏭</span>
                        <span style={{ textTransform: 'capitalize' }}>
                          {brewery.brewery_type}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="pagination">
                <button 
                  className="load-more"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">No breweries found</h3>
            <p className="empty-message">
              Try adjusting your search filters or try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


export default BreweryDashboard;
