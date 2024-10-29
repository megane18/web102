import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BreweryDashboard from './component/BreweryDashboard'
import BreweryDetail from './component/BreweryDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BreweryDashboard />} />
        <Route path="/brewery/:id" element={<BreweryDetail />} />
      </Routes>
    </Router>
  );
};

export default App;


