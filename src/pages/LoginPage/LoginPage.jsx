import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    Bird,
    Leaf,
    TreePine,
    MapPin,
    Search
} from 'lucide-react';

const LoginPage = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimated, setIsAnimated] = useState(false);

    // Animación de entrada
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimated(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Redireccionar al inicio si el usuario está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/observed-species');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulación de login
        try {
            const response = await axios.post('/api/users/login', {
                email,
                password
            });

            const { user, token } = response.data.data;
            const expirationDate = Date.now() + 21600000; // 6 horas de expiración
            setSuccessMessage('¡Inicio de sesión exitoso! Redirigiendo...');
            login(user, token, expirationDate);

        } catch (err) {
            console.log(err);
            if (err.response) {
                setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
            } else {
                setError('Error de red. Intenta nuevamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = () => {
        setError('');
        setSuccessMessage('');

        if (!email) {
            setError('Por favor, ingresa tu email primero.');
            return;
        }

        alert('Esta funcionalidad no está disponible en este momento. Por favor, revisa más tarde.');
    };

    // Manejar la tecla Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleLogin(e);
        }
    };

    return (
        <>
            <Helmet>
                <title>Iniciar sesión - Amazon Birds Research</title>
                <meta name="description" content="Iniciar sesión en nuestra plataforma" />
                <meta name="keywords" content="login, iniciar sesión, sign in, amazon birds research" />
            </Helmet>
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Elementos decorativos amazónicos */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Hojas flotantes */}
                    <div className="absolute top-20 left-10 text-green-300 opacity-20 animate-bounce">
                        <Leaf className="w-12 h-12 transform rotate-45" />
                    </div>
                    <div className="absolute top-40 right-20 text-emerald-400 opacity-30 animate-pulse">
                        <TreePine className="w-16 h-16" />
                    </div>
                    <div className="absolute bottom-32 left-16 text-teal-300 opacity-25 animate-bounce delay-1000">
                        <Bird className="w-10 h-10" />
                    </div>
                    <div className="absolute bottom-20 right-32 text-green-400 opacity-20 animate-pulse delay-500">
                        <Leaf className="w-8 h-8 transform -rotate-12" />
                    </div>

                    {/* Círculos de fondo */}
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-10 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400 to-green-500 rounded-full opacity-5 animate-spin" style={{ animationDuration: '30s' }}></div>
                </div>

                <div className={`relative w-full max-w-md transform transition-all duration-1000 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    {/* Header con logo amazónico */}
                    <div className="text-center mb-8">
                        <div className="inline-block group cursor-pointer">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                <div className="relative bg-white rounded-full p-6 shadow-2xl group-hover:shadow-3xl transition-all duration-300 transform group-hover:scale-105">
                                    <div className="flex items-center justify-center space-x-1">
                                        <Bird className="w-8 h-8 text-emerald-600" />
                                        <TreePine className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-green-700 bg-clip-text text-transparent">
                                Amazon Birds Research
                            </h1>
                            <h2 className="text-xl font-semibold text-gray-700 flex items-center justify-center space-x-2">
                                <MapPin className="w-5 h-5 text-emerald-600" />
                                <span>Región Amazónica Colombiana</span>
                            </h2>
                            <h3 className="text-lg font-medium text-gray-600">
                                Sistema de Muestreo Ornitológico
                            </h3>
                            <p className="text-gray-500">
                                ¿No tienes cuenta?{" "}
                                <button className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200 hover:underline">
                                    Registrarse aquí
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Formulario principal */}
                    <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl border border-emerald-100/50 p-8 space-y-6" onKeyDown={handleKeyDown}>
                        <div className="text-center mb-6">
                            <h4 className="text-lg font-semibold text-gray-700 flex items-center justify-center space-x-2">
                                <Search className="w-5 h-5 text-teal-600" />
                                <span>Acceso al Sistema</span>
                            </h4>
                        </div>

                        <div className="space-y-6">
                            {/* Campo de email */}
                            <div className="space-y-2">
                                <div className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                                    <Mail className="w-4 h-4 text-emerald-600" />
                                    <span>Correo electrónico institucional</span>
                                </div>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors duration-200" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 hover:bg-emerald-50 focus:bg-white"
                                        placeholder="investigador@amazonia.edu.co"
                                    />
                                </div>
                            </div>

                            {/* Campo de contraseña */}
                            <div className="space-y-2">
                                <div className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                                    <Lock className="w-4 h-4 text-emerald-600" />
                                    <span>Contraseña de acceso</span>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors duration-200" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 hover:bg-emerald-50 focus:bg-white"
                                        placeholder="Tu contraseña segura"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Mensajes de error y éxito */}
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm animate-pulse flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span>{error}</span>
                                </div>
                            )}

                            {successMessage && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm animate-pulse flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span>{successMessage}</span>
                                </div>
                            )}

                            {/* Botón de envío */}
                            <button
                                type="button"
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Verificando acceso...</span>
                                    </div>
                                ) : (
                                    <>
                                        <Bird className="w-5 h-5" />
                                        <span>Ingresar al Sistema</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Divisor */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-emerald-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">opciones adicionales</span>
                            </div>
                        </div>

                        {/* Botón de recuperar contraseña */}
                        <button
                            type="button"
                            onClick={handlePasswordReset}
                            className="w-full py-3 px-4 bg-emerald-50 text-emerald-700 font-medium rounded-xl hover:bg-emerald-100 focus:ring-4 focus:ring-emerald-200 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-emerald-200"
                        >
                            ¿Olvidaste tu contraseña de investigador?
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8 space-y-2">
                        <p className="text-sm text-gray-500">
                            Sistema de Investigación Ornitológica - Amazonía Colombiana
                        </p>
                        <p className="text-xs text-gray-400">
                            © 2025 Amazon Birds Research. Protegiendo la biodiversidad amazónica.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;