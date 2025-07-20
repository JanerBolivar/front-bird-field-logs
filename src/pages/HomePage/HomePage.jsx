import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Bird, TreePine, Leaf, MapPin, ArrowRight, Users, Database, BarChart3 } from 'lucide-react';

const Homepage = () => {
    const [isAnimated, setIsAnimated] = useState(false);

    const navigate = useNavigate();

    // Animación de entrada
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimated(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <>
            <Helmet>
                <title>Amazon Birds Research</title>
                <meta name="description" content="Pagina principal de la plataforma de investigación" />
                <meta name="keywords" content="amazon birds research, investigación, plataforma, inicio" />
            </Helmet>
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Elementos decorativos amazónicos flotantes */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Hojas y elementos naturales animados */}
                    <div className="absolute top-20 left-10 text-green-300 opacity-20 animate-bounce">
                        <Leaf className="w-16 h-16 transform rotate-45" />
                    </div>
                    <div className="absolute top-32 right-16 text-emerald-400 opacity-25 animate-pulse">
                        <TreePine className="w-20 h-20" />
                    </div>
                    <div className="absolute bottom-40 left-20 text-teal-300 opacity-30 animate-bounce delay-1000">
                        <Bird className="w-14 h-14" />
                    </div>
                    <div className="absolute bottom-32 right-24 text-green-400 opacity-20 animate-pulse delay-500">
                        <Leaf className="w-12 h-12 transform -rotate-12" />
                    </div>
                    <div className="absolute top-1/3 left-1/4 text-emerald-300 opacity-15 animate-bounce delay-700">
                        <Bird className="w-10 h-10 transform rotate-12" />
                    </div>
                    <div className="absolute top-2/3 right-1/3 text-teal-400 opacity-25 animate-pulse delay-300">
                        <TreePine className="w-12 h-12" />
                    </div>

                    {/* Círculos de fondo con gradientes amazónicos */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-10 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-teal-400 to-green-500 rounded-full opacity-5 animate-spin" style={{ animationDuration: '40s' }}></div>
                </div>

                {/* Contenido principal */}
                <div className={`relative text-center transform transition-all duration-1500 ${isAnimated ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`}>

                    {/* Logo principal con elementos amazónicos */}
                    <div className="mb-12">
                        <div className="inline-block group cursor-pointer">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                                <div className="relative bg-white rounded-full p-8 shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-110">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Bird className="w-12 h-12 text-emerald-600 animate-bounce" style={{ animationDuration: '3s' }} />
                                        <TreePine className="w-10 h-10 text-green-600" />
                                        <Bird className="w-8 h-8 text-teal-600 animate-bounce delay-500" style={{ animationDuration: '3s' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Título principal */}
                    <div className="mb-8 space-y-4">
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-green-700 bg-clip-text text-transparent leading-tight">
                            Amazon Birds
                            <br />
                            <span className="text-4xl md:text-5xl">Research</span>
                        </h1>

                        <div className="flex items-center justify-center space-x-2 text-xl md:text-2xl font-semibold text-gray-700 mt-6">
                            <MapPin className="w-6 h-6 text-emerald-600" />
                            <span>Región Amazónica Colombiana</span>
                        </div>
                    </div>

                    {/* Subtítulo descriptivo */}
                    <div className="mb-12 max-w-2xl mx-auto">
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-4">
                            Sistema de investigación y monitoreo ornitológico para la conservación
                            de la biodiversidad aviar en el ecosistema amazónico.
                        </p>

                        {/* Pequeños indicadores de características */}
                        <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm">
                            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                                <Database className="w-4 h-4 text-emerald-600" />
                                <span className="text-gray-700 font-medium">Base de Datos Científica</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                                <BarChart3 className="w-4 h-4 text-teal-600" />
                                <span className="text-gray-700 font-medium">Análisis Estadístico</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                                <Users className="w-4 h-4 text-green-600" />
                                <span className="text-gray-700 font-medium">Colaboración Científica</span>
                            </div>
                        </div>
                    </div>

                    {/* Botón principal de acceso */}
                    <div className="space-y-4">
                        <button
                            onClick={handleLoginClick}
                            className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 focus:ring-4 focus:ring-emerald-200 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-3xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <div className="relative flex items-center space-x-3">
                                <Bird className="w-6 h-6 group-hover:animate-bounce" />
                                <span>Acceder al Sistema</span>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </button>

                        <p className="text-gray-500 text-sm">
                            Plataforma exclusiva para investigadores y colaboradores autorizados
                        </p>
                    </div>
                </div>

                {/* Footer minimalista */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                    <p className="text-sm text-gray-400">
                        © 2025 Amazon Birds Research - Protegiendo la biodiversidad amazónica
                    </p>
                </div>
            </div>
        </>
    );
};

export default Homepage;