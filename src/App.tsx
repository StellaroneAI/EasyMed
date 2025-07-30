import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import HealthRecords from './pages/HealthRecords';
import FamilyHealth from './pages/FamilyHealth';
import AIAssistant from './pages/AIAssistant';
import Emergency from './pages/Emergency';
import Profile from './pages/Profile';
import VoiceAssistant from './components/VoiceAssistant';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/health-records" element={<HealthRecords />} />
            <Route path="/family" element={<FamilyHealth />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
        <VoiceAssistant />
      </div>
    </Router>
  );
}

export default App;
