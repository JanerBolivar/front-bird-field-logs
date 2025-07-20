import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ObservedSpeciesPage from "./pages/ObservedSpeciesPage/ObservedSpeciesPage";
import ResearchListPage from "./pages/ResearchListPage/ResearchListPage";
import ResearchDetailPage from "./pages/ResearchDetailPage/ResearchDetailPage";


function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/observed-species" element={<ObservedSpeciesPage />} />
            <Route path="/research-list" element={<ResearchListPage />} />
            <Route path="/research-detail/:uuid" element={<ResearchDetailPage />} />
          </Routes>
        </Router>
      </HelmetProvider>
    </AuthProvider>
  )
}

export default App
