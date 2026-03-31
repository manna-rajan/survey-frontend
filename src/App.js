import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';

// Surveyor Components
import SurveyerDashboard from './components/SurveyerDashboard';
import SurveyerSignin from './components/SurveyerSignin';
import SurveyerSetPassword from './components/SurveyerSetPassword';
import HomeSurveyForm from './components/HomeSurveyForm';

// Admin Components
import AdminDashboard from './components/AdminDashboard';
import AdminSignin from './components/AdminSignin';
import AdminSignup from './components/AdminSignup';
import AddSurveyer from './components/AddSurveyer';
import AdminCheck from './components/AdminCheck';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/surveyer/signin" element={<SurveyerSignin />} />
        <Route path="/surveyer/set-password" element={<SurveyerSetPassword />} />
        <Route path="/surveyer/dashboard" element={<SurveyerDashboard />} />
        <Route path="/surveyer/new-survey" element={<HomeSurveyForm />} />

        <Route path="/admin/signin" element={<AdminSignin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-surveyer" element={<AddSurveyer />} />
        <Route path="/admin/review" element={<AdminCheck />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
