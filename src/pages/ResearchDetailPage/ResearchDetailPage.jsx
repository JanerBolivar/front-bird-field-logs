import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../../contexts/useAuth";
import {
    MapPin,
    Calendar,
    Users,
    Bird,
    Leaf,
    TreePine,
    Target,
    FlaskConical,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const ResearchDetailPage = () => {
    const { user, token } = useAuth();
    const { uuid } = useParams();
    const [research, setResearch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimated(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchResearch = async () => {
            try {
                const response = await axios.get(`/api/sampling-points/research/${uuid}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setResearch(response.data.data.research);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching research:', error);
                setIsLoading(false);
            }
        };

        if (token && user && uuid) {
            fetchResearch();
        }
    }, [token, user, uuid]);

    const formatDate = (dateString) => {
        if (!dateString) return 'No definida';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-CO', options);
    };

    const handleViewMore = () => {
        alert('Función no disponible aún');
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    // Custom icon for Leaflet
    const customIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41]
    });

    const getBackgroundGradient = (index) => {
        const gradients = [
            'from-emerald-200 via-emerald-100 to-teal-200',
            'from-teal-200 via-cyan-100 to-blue-200',
            'from-green-200 via-emerald-100 to-teal-200',
            'from-blue-200 via-teal-100 to-emerald-200',
            'from-cyan-200 via-blue-100 to-teal-200',
            'from-emerald-200 via-green-100 to-lime-200'
        ];
        return gradients[index % gradients.length];
    };

    const getNatureIcon = (index) => {
        const icons = [Bird, TreePine, Leaf, FlaskConical, Target];
        const IconComponent = icons[index % icons.length];
        return IconComponent;
    };

    // Sort sampling points based on current sort order
    const sortedSamplingPoints = research?.samplingPoints ? [...research.samplingPoints].sort((a, b) => {
        return sortOrder === 'asc'
            ? a.pointNumber - b.pointNumber
            : b.pointNumber - a.pointNumber;
    }) : [];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-emerald-700 font-medium text-sm sm:text-base">Cargando investigación...</p>
                </div>
            </div>
        );
    }

    if (!research) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3">Investigación no encontrada</h3>
                    <p className="text-gray-500">No se pudo encontrar la investigación solicitada.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{research.name} - Amazon Birds Research</title>
                <meta name="description" content={`Detalles de la investigación ${research.name}`} />
                <meta name="keywords" content="investigación, ornitología, amazon birds research" />
            </Helmet>
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 p-4 sm:p-6 relative overflow-hidden">
                {/* Elementos decorativos amazónicos flotantes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 sm:top-20 left-4 sm:left-10 text-green-300 opacity-20 animate-bounce">
                        <Leaf className="w-8 h-8 sm:w-12 sm:h-12 transform rotate-45" />
                    </div>
                    <div className="absolute top-20 sm:top-40 right-8 sm:right-20 text-emerald-400 opacity-30 animate-pulse">
                        <TreePine className="w-10 h-10 sm:w-16 sm:h-16" />
                    </div>
                    <div className="absolute bottom-16 sm:bottom-32 left-6 sm:left-16 text-teal-300 opacity-25 animate-bounce delay-1000">
                        <Bird className="w-6 h-6 sm:w-10 sm:h-10" />
                    </div>
                    <div className="absolute bottom-10 sm:bottom-20 right-12 sm:right-32 text-green-400 opacity-20 animate-pulse delay-500">
                        <Leaf className="w-6 h-6 sm:w-8 sm:h-8 transform -rotate-12" />
                    </div>
                    <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-10 animate-pulse"></div>
                    <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-teal-400 to-green-500 rounded-full opacity-5 animate-spin" style={{ animationDuration: '30s' }}></div>
                </div>

                <div className={`relative w-full max-w-7xl mx-auto transform transition-all duration-1000 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-block group cursor-pointer mb-4 sm:mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                <div className="relative bg-white rounded-full p-4 sm:p-6 shadow-2xl group-hover:shadow-3xl transition-all duration-300 transform group-hover:scale-105">
                                    <div className="flex items-center justify-center space-x-1">
                                        <Bird className="w-5 h-5 sm:w-8 sm:h-8 text-emerald-600" />
                                        <TreePine className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-6 space-y-3">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-green-700 bg-clip-text text-transparent">
                                {research.name}
                            </h1>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 flex items-center justify-center space-x-2">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                                <span>{research.locality.city}, {research.locality.state}</span>
                            </h2>
                        </div>
                    </div>

                    {/* Descripción principal */}
                    <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-emerald-100/50 p-4 sm:p-6 mb-6 sm:mb-8">
                        <p className="text-gray-700 text-sm sm:text-lg">{research.description || 'Sin descripción disponible'}</p>
                    </div>

                    {/* Detalles y Equipo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className={`bg-gradient-to-br ${getBackgroundGradient(0)} rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group relative`}>
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-3 sm:mb-4">
                                    <h3 className="font-bold text-gray-800 text-base sm:text-lg">Detalles</h3>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
                                        <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm sm:text-base text-gray-700">
                                    <p className="flex items-center"><Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-emerald-600" />{formatDate(research.startDate)} - {formatDate(research.endDate)}</p>
                                    <p className="flex items-center"><MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-teal-600" />{research.locality.name}, {research.locality.country}</p>
                                    <p className="flex items-center"><Target className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-emerald-600" />{research.objectives.length} objetivos</p>
                                    <p className="flex items-center"><FlaskConical className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-teal-600" />{research.results.length} resultados</p>
                                    <p className="flex items-center"><Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-purple-600" />{research.team.length + 1} miembros</p>
                                    <p className="flex items-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${research.status === 'Ejecución' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {research.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`bg-gradient-to-br ${getBackgroundGradient(1)} rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group relative`}>
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-3 sm:mb-4">
                                    <h3 className="font-bold text-gray-800 text-base sm:text-lg">Equipo</h3>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
                                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-teal-700" />
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm sm:text-base text-gray-700">
                                    <p><strong>Líder:</strong> {research.leader.first_name} {research.leader.first_last_name}</p>
                                    {research.team.map((member, index) => (
                                        <p key={index}><strong>Miembro:</strong> {member.first_name} {member.first_last_name}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Puntos de Muestreo */}
                    <div className={`bg-gradient-to-br ${getBackgroundGradient(2)} rounded-3xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8`}>
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <h3 className="font-bold text-gray-800 text-base sm:text-lg">Puntos de Muestreo</h3>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={toggleSortOrder}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg hover:shadow-xl transition-all"
                                    title={`Ordenar ${sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
                                >
                                    {sortOrder === 'asc' ? (
                                        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                                    ) : (
                                        <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                                    )}
                                </button>
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sortedSamplingPoints.map((point, index) => {
                                const IconComponent = getNatureIcon(index);
                                return (
                                    <div
                                        key={point.uuid}
                                        className={`bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-2xl transition-all duration-500 group relative border border-emerald-100/30`}
                                    >
                                        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                                <h4 className="font-semibold text-gray-800 text-base sm:text-md">Punto {point.pointNumber}</h4>
                                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
                                                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                                                <p><strong>Tipo:</strong> {point.samplingType || 'No especificado'}</p>
                                                <p><strong>Detalle:</strong> {point.detailSamplingType || 'No especificado'}</p>
                                                <p><strong>Detección:</strong> {point.detection || 'No especificado'}</p>
                                                <p><strong>Figura:</strong> {point.figure || 'No especificada'}</p>
                                                <p><strong>Período de Censo:</strong> {point.censusPeriod} días</p>
                                                <p><strong>Radio Fijo:</strong> {point.fixedRadius} m</p>
                                                <p><strong>Inicio:</strong> {formatDate(point.startDate)}</p>
                                                <p><strong>Fin:</strong> {formatDate(point.endDate)}</p>
                                                <p><strong>Creado:</strong> {formatDate(point.createdAt)}</p>
                                                <p><strong>Actualizado:</strong> {formatDate(point.updatedAt)}</p>
                                            </div>
                                            {point.coordinates.latitude && point.coordinates.longitude && (
                                                <div className="mt-3 sm:mt-4">
                                                    <h5 className="font-semibold text-gray-800 text-sm mb-2">Mapa</h5>
                                                    <MapContainer
                                                        center={[point.coordinates.latitude, point.coordinates.longitude]}
                                                        zoom={16}
                                                        style={{ height: '200px', width: '100%' }}
                                                        className="rounded-lg overflow-hidden"
                                                    >
                                                        <TileLayer
                                                            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                                            attribution='&copy; Google Satellite'
                                                            maxZoom={20}
                                                        />
                                                        <Marker
                                                            position={[point.coordinates.latitude, point.coordinates.longitude]}
                                                            icon={customIcon}
                                                        >
                                                            <Popup>Punto {point.pointNumber}</Popup>
                                                        </Marker>
                                                    </MapContainer>
                                                </div>
                                            )}
                                            <button
                                                onClick={handleViewMore}
                                                className="mt-3 sm:mt-4 w-full px-3 py-2 bg-emerald-50 text-emerald-700 font-medium rounded-xl hover:bg-emerald-100 transition-all duration-200"
                                            >
                                                Ver más
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8 sm:mt-12 space-y-2">
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

export default ResearchDetailPage;