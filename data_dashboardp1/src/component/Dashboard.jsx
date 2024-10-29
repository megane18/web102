import React, { useState, useEffect } from 'react';

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  .app {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1c20 0%, #2d3436 100%);
    color: #ffffff;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  .header {
    text-align: center;
    padding: 2rem 0 4rem;
    animation: fadeDown 0.8s ease-out;
  }

  .title {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #00f2fe 30%, #4facfe 90%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 30px rgba(79, 172, 254, 0.5);
  }

  .subtitle {
    font-size: 1.2rem;
    color: #a0aec0;
    max-width: 600px;
    margin: 0 auto;
  }

  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
    animation: fadeUp 0.8s ease-out;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 2rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(79, 172, 254, 0.3);
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, #00f2fe 30%, #4facfe 90%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .stat-label {
    color: #a0aec0;
    font-size: 1.1rem;
  }

  .filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
    animation: fadeUp 1s ease-out;
  }

  .search-input,
  .select-input {
    width: 100%;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .search-input::placeholder {
    color: #a0aec0;
  }

  .search-input:focus,
  .select-input:focus {
    outline: none;
    border-color: #4facfe;
    box-shadow: 0 0 0 2px rgba(79, 172, 254, 0.2);
  }

  .select-input {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    padding-right: 3rem;
  }

  .select-input option {
    background: #2d3436;
    color: #ffffff;
  }

  .breweries-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    animation: fadeUp 1.2s ease-out;
  }

  .brewery-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
  }

  .brewery-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .brewery-type-banner {
    height: 4px;
    width: 100%;
  }

  .brewery-content {
    padding: 2rem;
  }

  .brewery-name {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #ffffff;
  }

  .brewery-info {
    display: flex;
    align-items: center;
    margin-bottom: 0.8rem;
    color: #a0aec0;
  }

  .brewery-info-icon {
    margin-right: 0.8rem;
    opacity: 0.8;
  }

  .brewery-website {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 0.8rem 1.5rem;
    background: linear-gradient(45deg, #00f2fe 30%, #4facfe 90%);
    color: white;
    text-decoration: none;
    border-radius: 10px;
    font-weight: 500;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .brewery-website:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(79, 172, 254, 0.3);
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #a0aec0;
    animation: fadeUp 0.8s ease-out;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    opacity: 0.5;
  }

  .empty-title {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #ffffff;
  }

  .empty-message {
    font-size: 1.1rem;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(79, 172, 254, 0.1);
    border-top-color: #4facfe;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 3rem;
    padding-bottom: 2rem;
  }

  .load-more {
    padding: 1rem 2rem;
    background: linear-gradient(45deg, #00f2fe 30%, #4facfe 90%);
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .load-more:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(79, 172, 254, 0.3);
  }

  .load-more:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes fadeDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .title {
      font-size: 2.5rem;
    }

    .stat-card {
      padding: 1.5rem;
    }

    .brewery-card {
      margin: 0 1rem;
    }
  }
`;

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
      <>
        <style>{styles}</style>
        <div className="app">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="container">
          <header className="header">
            <h1 className="title">Brewery Explorer</h1>
            <p className="subtitle">
              Discover and explore craft breweries across the United States
            </p>
          </header>

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
                  <div key={brewery.id} className="brewery-card">
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
                      <div className="brewery-info">
                        <span className="brewery-info-icon">📞</span>
                        {brewery.phone || 'No phone listed'}
                      </div>
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
    </>
  );
};

export default BreweryDashboard;

