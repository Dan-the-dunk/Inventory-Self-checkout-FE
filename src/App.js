import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import RegisterForm from './components/RegisterForm';
import StatisticsForm from './components/StatisticForm';
import WorkerManagement from './components/WorkerManagement';
import FacialRecognition from './components/FacialRecognition';
import SelfCheckout from './components/SelfCheckout';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/statistics" element={<StatisticsForm />} />
                <Route path="/worker-management" element={<WorkerManagement />} />
                <Route path="/facial-recognition" element={<FacialRecognition />} />
                <Route path="/self-checkout" element={<SelfCheckout />} />
            </Routes>
        </Router>
    );
};

export default App;
