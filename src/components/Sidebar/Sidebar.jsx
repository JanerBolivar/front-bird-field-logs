import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Bird, Leaf, TreePine, MapPin, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from "../../contexts/useAuth";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/observed-species', icon: <Leaf className="w-5 h-5" />, label: 'Especies Observadas' },
        { path: '/research-list', icon: <TreePine className="w-5 h-5" />, label: 'Lista de Investigaciones' },
        { path: '/documentation', icon: <MapPin className="w-5 h-5" />, label: 'Documentación' },
        { path: '/settings', icon: <BarChart3 className="w-5 h-5" />, label: 'Configuraciones' },
    ];

    // Función para obtener las iniciales del usuario
    const getUserInitials = () => {
        if (!user) return 'U';
        const firstInitial = user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
        const lastInitial = user.first_last_name ? user.first_last_name.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial || 'U';
    };

    // Función para obtener el nombre completo
    const getFullName = () => {
        if (!user) return 'Usuario';
        const firstName = user.first_name || '';
        const middleName = user.middle_name || '';
        return `${firstName} ${middleName}`.trim() || 'Usuario';
    };

    // Función para manejar el logout
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className={`fixed inset-y-0 left-0 z-50 bg-white/95 backdrop-blur-sm shadow-xl transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-screen`}>
            {/* Botón de colapso */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-4 top-6 bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-emerald-700 transition-colors duration-200 z-10"
            >
                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Logo y título */}
            <div className="flex items-center p-4 border-b border-emerald-100/50">
                <div className="flex items-center space-x-2">
                    <Bird className="w-6 h-6 text-emerald-600" />
                    {!isCollapsed && <span className="text-xl font-bold text-emerald-700">Amazon Birds</span>}
                </div>
            </div>

            {/* Menú */}
            <nav className="mt-6">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center p-4 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 ${isActive ? 'bg-emerald-100 text-emerald-800 font-medium' : ''} ${isCollapsed ? 'justify-center' : 'space-x-3'}`
                        }
                    >
                        {item.icon}
                        {!isCollapsed && <span className="text-sm">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* User Info */}
            <div className="absolute bottom-4 w-full px-4 space-y-3">
                {/* Botón de cerrar sesión */}
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center p-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 rounded-lg ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                    title={isCollapsed ? 'Cerrar sesión' : ''}
                >
                    <LogOut className="w-5 h-5" />
                    {!isCollapsed && <span className="text-sm font-medium">Cerrar sesión</span>}
                </button>

                {/* Información del usuario */}
                <div className={`flex items-center p-2 bg-emerald-50 rounded-xl shadow-md transition-all duration-300 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                    <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-700 font-medium text-sm">
                            {getUserInitials()}
                        </span>
                    </div>
                    {!isCollapsed && (
                        <div className="text-sm min-w-0 flex-1">
                            <p className="font-medium text-gray-800 truncate">
                                {getFullName()}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.role || 'Usuario'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;