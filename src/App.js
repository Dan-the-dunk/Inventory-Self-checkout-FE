import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import RegisterForm from './components/RegisterForm';
import StatisticsForm from './components/StatisticForm';
import WorkerManagement from './components/WorkerManagement';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/statistics" element={<StatisticsForm />} />
                <Route path="/worker-management" element={<WorkerManagement />} />
            </Routes>
        </Router>
    );
};

export default App;
