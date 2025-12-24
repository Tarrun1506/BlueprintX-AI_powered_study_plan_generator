import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Import Page Components
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import SyllabusUploadPage from './pages/SyllabusUploadPage';
import AboutPage from './pages/AboutPage';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AnalysisResultPage from './pages/AnalysisResultPage';

// Import Layout Component
import Layout from './components/layout/Layout';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route
                    path="/upload"
                    element={
                        <ProtectedRoute>
                            <SyllabusUploadPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <HistoryPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/analysis/:id" element={<ProtectedRoute><AnalysisResultPage /></ProtectedRoute>} />
            </Routes>
        </Layout>
    );
}

export default App;
