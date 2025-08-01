import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useState } from 'react';

// Pages
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ObservedSpeciesPage from "./pages/ObservedSpeciesPage/ObservedSpeciesPage";
import ResearchListPage from "./pages/ResearchListPage/ResearchListPage";
import ResearchDetailPage from "./pages/ResearchDetailPage/ResearchDetailPage";
import SamplingPointDetailPage from "./pages/SamplingPointDetailPage/SamplingPointDetailPage";

// Components
import Sidebar from "./components/Sidebar/Sidebar";

// Component que maneja el layout con sidebar
const LayoutWithSidebar = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <div
        className={`transition-all duration-300 w-full ${isSidebarCollapsed ? 'ml-16' : 'ml-64'
          }`}
      >
        {children}
      </div>
    </div>
  );
};

// Component que maneja las rutas y determina si mostrar sidebar
const AppRoutes = () => {
  const location = useLocation();

  // Rutas que NO deben mostrar el sidebar
  const publicRoutes = ['/', '/login'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (isPublicRoute) {
    // Rutas sin sidebar
    return (
      <div className="w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    );
  }

  // Rutas con sidebar
  return (
    <LayoutWithSidebar>
      <Routes>
        <Route path="/observed-species" element={<ObservedSpeciesPage />} />
        <Route path="/research-list" element={<ResearchListPage />} />
        <Route path="/research-detail/:uuid" element={<ResearchDetailPage />} />
        <Route path="/sampling-point-detail/:uuid" element={<SamplingPointDetailPage />} />
        <Route path="/documentation" element={<div>Documentación</div>} />
        <Route path="/settings" element={<div>Configuraciones</div>} />
      </Routes>
    </LayoutWithSidebar>
  );
};

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <Router>
          <AppRoutes />
        </Router>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App