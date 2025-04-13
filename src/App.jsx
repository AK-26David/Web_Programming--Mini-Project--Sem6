import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import necessary router components
import './App.css';
import Navbar from './components/Navbar.jsx';  // Your Navbar component
import HomePage from './pages/Homepage.jsx';  // Your HomePage component
import AddProject from './pages/Addproject.jsx';  // Your AddProject component

function App() {
  return (
    <Router>  {/* Wrap the app with Router for routing */}
      <Navbar />  {/* Include the Navbar */}
      <Routes>  {/* Define routes */}
        <Route path="/" element={<HomePage />} />  {/* HomePage route */}
        <Route path="/add-project" element={<AddProject />} />  {/* Add Project page route */}
      </Routes>
    </Router>
  );
}

export default App;
