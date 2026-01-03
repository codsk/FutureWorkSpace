import React, { useState , Suspense} from 'react';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';
import HostDashboard from './pages/hostComponents/hostDashboard';
import AddPropertyDetailsForm from './pages/hostComponents/addPropertyDetailsForm';
import AddSpaceDetails from './pages/hostComponents/addSpaceDetails';
import AddSpaceDetailsForm from './pages/hostComponents/addSpaceDetailsForm';
import Spaces from './pages/components/spaces';


// This i need to handle (the user is still logged in or not)
// const [token, setToken] = useState(() => {
//   return sessionStorage.getItem('token');
// });
function App() {
  return (
    <div className="App">

      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/addPropertyDetails" element={<AddPropertyDetailsForm />} />
        <Route path="/HostDashboard" element={
          <Suspense fallback={<div>Loading...</div>}>
          <HostDashboard />
          </Suspense>} />
        <Route path='/addSpaceDetails' element={<AddSpaceDetails />} />
        <Route path='/addSpaceDetailsForm' element={<AddSpaceDetailsForm />} />
        <Route path='/space' element={<Spaces />} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
