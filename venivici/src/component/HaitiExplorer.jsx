import React, { useState, useEffect } from 'react';
import '../styles/haiti.css'

// Simulated local API data
const haitiFacts = [
  { id: 1, title: "Capital", content: "Port-au-Prince", category: "Geography" },
  { id: 2, title: "Languages", content: "Haitian Creole, French", category: "Culture" },
  { id: 3, title: "Independence Year", content: "1804", category: "History" },
  { id: 4, title: "National Dish", content: "Griot with Pikliz", category: "Cuisine" },
  { id: 5, title: "Highest Point", content: "Pic la Selle", category: "Geography" },
];

// Haitian cities
const haitianCities = [
  "Port-au-Prince",
  "Cap-Haïtien",
  "Gonaïves",
  "Les Cayes",
  "Jacmel",
  "Jérémie",
];

const getRandomFact = (usedFacts) => {
  const availableFacts = haitiFacts.filter(fact => !usedFacts.some(usedFact => usedFact.id === fact.id));
  return availableFacts.length > 0 ? availableFacts[Math.floor(Math.random() * availableFacts.length)] : null;
};

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_APP_IMAGE_API;
const WEATHER_API_KEY = import.meta.env.VITE_APP_WEATHER_API;

const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};


//was not giving me the correct images
// const getCityImage = async (city) => {
//   try {
//     // Use a more specific query to get better results
//     const query = encodeURIComponent(`${city} haiti landscape`);
//     const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=10`);
//     const data = await response.json();
//     if (data.results && data.results.length > 0) {
//       // Select a random image from the results instead of always using the first one
//       const randomImage = getRandomElement(data.results);
//       return randomImage.urls.regular;
//     }
//   } catch (error) {
//     console.error('Error fetching city image:', error);
//   }
//   return `/api/placeholder/800/600?text=${encodeURIComponent(city)}`; // Fallback to a city-specific placeholder
// };


//fixed it

const getCityImage = async (city) => {
  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${city},haiti&client_id=${UNSPLASH_ACCESS_KEY}`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      // return data.results[0].urls.regular;
      // Select a random image from the results instead of always using the first one
      const randomImage = getRandomElement(data.results);
      return randomImage.urls.regular;
    }
  } catch (error) {
    console.error('Error fetching city image:', error);
  }
  return "/api/placeholder/800/600?text=Haiti"; // Fallback to placeholder if fetch fails
};

const Button = ({ onClick, children, className }) => (
  <button onClick={onClick} className={`btn ${className || ''}`}>
    {children}
  </button>
);

const Card = ({ title, children, className }) => (
  <div className={`card ${className || ''}`}>
    <h2 className="card-title">{title}</h2>
    {children}
  </div>
);

const HaitiExplorer = () => {
  const [currentFact, setCurrentFact] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Port-au-Prince');
  const [cityImage, setCityImage] = useState('');
  const [error, setError] = useState(null);

  const fetchNewFact = () => {
    let newFact = null;
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loop

    while (!newFact && attempts < maxAttempts) {
      newFact = getRandomFact(history);
      if (newFact && (banList.includes(newFact.category) || banList.includes(newFact.title) || history.some(fact => fact.id === newFact.id))) {
        newFact = null;
      }
      attempts++;
    }

    if (newFact) {
      setCurrentFact(newFact);
      setHistory(prevHistory => [...prevHistory, newFact]);
    } else {
      setError("No more unique facts available.");
    }
  };

  const fetchWeatherData = async () => {
    setError(null);
    try {
      const [weatherResponse, imageUrl] = await Promise.all([
        fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${WEATHER_API_KEY}&contentType=json`),
        getCityImage(city)
      ]);
      
      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);
      setCityImage(imageUrl);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchNewFact();
    fetchWeatherData();
  }, [city]); // Fetch new data when city changes

  const handleBan = (attribute) => {
    if (!banList.includes(attribute)) {
      setBanList(prevList => [...prevList, attribute]);
    }
  };

  return (
    <div className="haiti-explorer">
      <h1 className="text-2xl font-bold mb-4">Haiti Explorer</h1>
      
      <Button onClick={fetchNewFact} className="new-fact-btn bg-blue-500 text-white px-4 py-2 rounded">New Fact</Button>

      <div className="content-grid grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {currentFact && (
          <Card title={currentFact.title} className="fact-card bg-white p-4 rounded shadow">
            <p>{currentFact.content}</p>
            <div className="btn-group mt-2">
              <Button onClick={() => handleBan(currentFact.category)} className="bg-red-500 text-white px-2 py-1 rounded mr-2">Ban Category</Button>
              <Button onClick={() => handleBan(currentFact.title)} className="bg-red-500 text-white px-2 py-1 rounded">Ban Title</Button>
            </div>
          </Card>
        )}

        <Card title="Weather & City Explorer" className="weather-card bg-white p-4 rounded shadow">
          <div className="input-group flex mb-2">
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              className="border p-2 rounded mr-2"
            >
              {haitianCities.map((cityName) => (
                <option key={cityName} value={cityName}>{cityName}</option>
              ))}
            </select>
          </div>
          {error && (
            <div className="error-alert bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          {weatherData && (
            <div className="weather-data mt-4">
              <div className="city-image-container">
                <img src={cityImage} alt={city} className="city-image" />
                <div className="city-name-overlay">{city}</div>
              </div>
              <p className="mt-2">Temperature: {weatherData.currentConditions.temp}°C</p>
              <p>Weather: {weatherData.currentConditions.conditions}</p>
              <p>Humidity: {weatherData.currentConditions.humidity}%</p>
            </div>
          )}
        </Card>

        <Card title="Ban List" className="ban-list-card bg-white p-4 rounded shadow">
          <ul className="list-disc pl-5">
            {banList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card title="History" className="history-card bg-white p-4 rounded shadow">
          <ul className="list-disc pl-5">
            {history.map((item, index) => (
              <li key={index}>{item.title}: {item.content}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default HaitiExplorer;