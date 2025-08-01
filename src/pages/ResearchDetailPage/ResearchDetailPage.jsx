import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from 'react-router-dom';
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
    ArrowDown,
    Mountain,
    Compass,
    Clock,
    Eye,
    Globe,
    BarChart3,
    Activity,
    Edit
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import EditResearchModal from '../../components/EditResearchModal/EditResearchModal';

const ResearchDetailPage = () => {
    const { user, token } = useAuth();
    const { uuid } = useParams();
    const [research, setResearch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimated(true);
        }, 300);
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

    const handleViewMore = (uuid) => {
        navigate(`/sampling-point-detail/${uuid}`);
    };

    const handleDownloadReport = () => {
        alert('Función no disponible aún');
    };

    const handleExportData = () => {
        alert('Función no disponible aún');
    };

    const handleUpdateResearch = (updatedData) => {
        setResearch(prev => ({ ...prev, ...updatedData }));
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    // Custom icons for Leaflet
    const createCustomIcon = (color = 'emerald', number = '') => {
        return new L.DivIcon({
            html: `
                <div class="relative">
                    <div class="w-8 h-8 bg-${color}-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <span class="text-white text-xs font-bold">${number}</span>
                    </div>
                    <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-${color}-600"></div>
                </div>
            `,
            className: 'custom-marker',
            iconSize: [32, 40],
            iconAnchor: [16, 40],
            popupAnchor: [0, -40]
        });
    };

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
        const icons = [Bird, TreePine, Leaf, FlaskConical, Target, Eye, Compass];
        const IconComponent = icons[index % icons.length];
        return IconComponent;
    };

    // Calculate center point for main map
    const getMapCenter = () => {
        if (!research?.samplingPoints?.length) {
            return research?.coordinates ? [research.coordinates.latitude, research.coordinates.longitude] : [4.711, -74.0721];
        }

        const validPoints = research.samplingPoints.filter(point =>
            point.coordinates.latitude !== 0 && point.coordinates.longitude !== 0
        );

        if (validPoints.length === 0) {
            return research?.coordinates ? [research.coordinates.latitude, research.coordinates.longitude] : [4.711, -74.0721];
        }

        const avgLat = validPoints.reduce((sum, point) => sum + point.coordinates.latitude, 0) / validPoints.length;
        const avgLng = validPoints.reduce((sum, point) => sum + point.coordinates.longitude, 0) / validPoints.length;

        return [avgLat, avgLng];
    };

    // Sort sampling points
    const sortedSamplingPoints = research?.samplingPoints ? [...research.samplingPoints].sort((a, b) => {
        return sortOrder === 'asc' ? a.pointNumber - b.pointNumber : b.pointNumber - a.pointNumber;
    }) : [];

    // Get statistics
    const getStatistics = () => {
        if (!research) return {};

        const validCoordinates = research.samplingPoints?.filter(point =>
            point.coordinates.latitude !== 0 && point.coordinates.longitude !== 0
        ).length || 0;

        const activePoints = research.samplingPoints?.filter(point =>
            new Date(point.endDate) > new Date()
        ).length || 0;

        return {
            totalPoints: research.samplingPoints?.length || 0,
            validCoordinates,
            activePoints,
            completedPoints: (research.samplingPoints?.length || 0) - activePoints,
            avgRadius: research.samplingPoints?.length > 0
                ? Math.round(research.samplingPoints.reduce((sum, p) => sum + p.fixedRadius, 0) / research.samplingPoints.length)
                : 0,
            avgPeriod: research.samplingPoints?.length > 0
                ? Math.round(research.samplingPoints.reduce((sum, p) => sum + p.censusPeriod, 0) / research.samplingPoints.length)
                : 0
        };
    };

    const stats = getStatistics();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Elementos decorativos de loading */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 text-green-300 opacity-20 animate-bounce">
                        <Leaf className="w-16 h-16 transform rotate-45" />
                    </div>
                    <div className="absolute top-32 right-16 text-emerald-400 opacity-25 animate-pulse">
                        <TreePine className="w-20 h-20" />
                    </div>
                    <div className="absolute bottom-40 left-20 text-teal-300 opacity-30 animate-bounce delay-1000">
                        <Bird className="w-14 h-14" />
                    </div>
                </div>

                <div className="relative text-center">
                    <div className="inline-block group mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-white rounded-full p-8 shadow-2xl">
                                <div className="flex items-center justify-center space-x-2">
                                    <Bird className="w-12 h-12 text-emerald-600 animate-bounce" />
                                    <TreePine className="w-10 h-10 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-emerald-700 font-medium text-lg">Cargando investigación...</p>
                    <p className="text-gray-500 text-sm mt-2">Preparando datos del ecosistema amazónico</p>
                </div>
            </div>
        );
    }

    if (!research) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Elementos decorativos */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 text-red-300 opacity-20 animate-bounce">
                        <Leaf className="w-16 h-16 transform rotate-45" />
                    </div>
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-red-400 to-orange-500 rounded-full opacity-10 animate-pulse"></div>
                </div>

                <div className="relative text-center">
                    <div className="inline-block group mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-600 rounded-full blur-xl opacity-30"></div>
                            <div className="relative bg-white rounded-full p-8 shadow-2xl">
                                <div className="flex items-center justify-center">
                                    <Bird className="w-12 h-12 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">Investigación no encontrada</h3>
                    <p className="text-gray-500 text-lg">No se pudo encontrar la investigación solicitada en nuestra base de datos.</p>
                    <p className="text-sm text-gray-400 mt-2">Verifica el enlace o contacta al administrador del sistema</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{research.name} - Amazon Birds Research</title>
                <meta name="description" content={`Investigación ornitológica: ${research.name} en ${research.locality.city}, ${research.locality.state}`} />
                <meta name="keywords" content="investigación, ornitología, amazon birds research, biodiversidad, conservación" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 p-4 relative overflow-hidden">
                {/* Elementos decorativos flotantes */}
                <div className="absolute inset-0 overflow-hidden">
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

                    {/* Círculos de fondo */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-10 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400 to-green-500 rounded-full opacity-5 animate-spin" style={{ animationDuration: '40s' }}></div>
                </div>

                <div className={`relative w-full max-w-7xl mx-auto transform transition-all duration-1500 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

                    {/* Header Principal */}
                    <div className="text-center mb-12">
                        <div className="inline-block group cursor-pointer mb-8">
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

                        <div className="space-y-6">
                            <div className="flex items-center justify-center space-x-4">
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-green-700 bg-clip-text text-transparent leading-tight">
                                    {research.name}
                                </h1>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600"
                                    title="Editar Investigación"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex items-center justify-center space-x-2 text-xl md:text-2xl font-semibold text-gray-700">
                                <MapPin className="w-6 h-6 text-emerald-600" />
                                <span>{research.locality.city}, {research.locality.state}</span>
                            </div>

                            <div className="flex items-center justify-center space-x-2 text-lg text-gray-600">
                                <Globe className="w-5 h-5 text-teal-600" />
                                <span>{research.locality.name} - {research.locality.country}</span>
                            </div>
                        </div>
                    </div>

                    {/* Descripción Principal con más estilo */}
                    <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-emerald-100/50 p-8 mb-12 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl opacity-50"></div>
                        <div className="relative">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <FlaskConical className="w-6 h-6 text-emerald-600 mr-3" />
                                Descripción de la Investigación
                            </h2>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                {research.description || 'Esta investigación forma parte del programa de monitoreo y conservación de la biodiversidad aviar en el ecosistema amazónico colombiano, contribuyendo al conocimiento científico y la protección de especies endémicas.'}
                            </p>
                        </div>
                    </div>

                    {/* Estadísticas Generales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <MapPin className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{stats.totalPoints}</div>
                            <div className="text-sm text-gray-600">Puntos Totales</div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Activity className="w-6 h-6 text-teal-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{stats.activePoints}</div>
                            <div className="text-sm text-gray-600">Puntos Activos</div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Compass className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{stats.avgRadius}m</div>
                            <div className="text-sm text-gray-600">Radio Promedio</div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{stats.avgPeriod}</div>
                            <div className="text-sm text-gray-600">Días Promedio</div>
                        </div>
                    </div>

                    {/* Mapa Principal con todos los puntos */}
                    <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-emerald-100/50 p-8 mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                <Globe className="w-6 h-6 text-emerald-600 mr-3" />
                                Mapa General de Puntos de Muestreo
                            </h2>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 bg-emerald-600 rounded-full"></div>
                                    <span>Puntos de Muestreo</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-96 rounded-2xl overflow-hidden shadow-lg">
                            <MapContainer
                                center={getMapCenter()}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                    attribution='&copy; Google Satellite'
                                    maxZoom={20}
                                />

                                {/* Marker para la ubicación principal de la investigación */}
                                {research.coordinates && (
                                    <Marker
                                        position={[research.coordinates.latitude, research.coordinates.longitude]}
                                        icon={createCustomIcon('red', 'HQ')}
                                    >
                                        <Popup>
                                            <div className="text-center">
                                                <h3 className="font-bold text-gray-800">{research.name}</h3>
                                                <p className="text-sm text-gray-600">Sede Principal</p>
                                                <p className="text-xs text-gray-500">{research.locality.name}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}

                                {/* Markers para cada punto de muestreo */}
                                {research.samplingPoints?.map((point) => {
                                    if (point.coordinates.latitude === 0 && point.coordinates.longitude === 0) return null;

                                    return (
                                        <Marker
                                            key={point.uuid}
                                            position={[point.coordinates.latitude, point.coordinates.longitude]}
                                            icon={createCustomIcon('emerald', point.pointNumber.toString())}
                                        >
                                            <Popup>
                                                <div className="text-center min-w-40">
                                                    <h3 className="font-bold text-gray-800">Punto {point.pointNumber}</h3>
                                                    <p className="text-sm text-gray-600">{point.samplingType}</p>
                                                    <p className="text-xs text-gray-500">{point.detailSamplingType}</p>
                                                    <div className="mt-2 space-y-1">
                                                        <p className="text-xs"><strong>Radio:</strong> {point.fixedRadius}m</p>
                                                        <p className="text-xs"><strong>Período:</strong> {point.censusPeriod} días</p>
                                                        <p className="text-xs"><strong>Detección:</strong> {point.detection}</p>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                })}
                            </MapContainer>
                        </div>
                    </div>

                    {/* Información detallada en grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

                        {/* Detalles Generales */}
                        <div className={`bg-gradient-to-br ${getBackgroundGradient(0)} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group relative`}>
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <h3 className="font-bold text-gray-800 text-xl">Información General</h3>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                                        <Target className="w-6 h-6 text-emerald-700" />
                                    </div>
                                </div>
                                <div className="space-y-4 text-gray-700">
                                    <div className="flex items-start space-x-3">
                                        <Calendar className="w-5 h-5 text-emerald-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium">Período de Estudio</p>
                                            <p className="text-sm">{formatDate(research.startDate)} - {formatDate(research.endDate)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Mountain className="w-5 h-5 text-teal-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium">Características del Hábitat</p>
                                            <p className="text-sm"><strong>Tipo:</strong> {research.habitatType || 'No especificado'}</p>
                                            <p className="text-sm"><strong>Vegetación:</strong> {research.dominantVegetation || 'No especificada'}</p>
                                            <p className="text-sm"><strong>Altitud:</strong> {research.height || 0}m</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <BarChart3 className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium">Estado del Proyecto</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${research.status === 'Ejecución' ? 'bg-green-100 text-green-800' :
                                                research.status === 'Completado' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {research.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Objetivos */}
                        <div className={`bg-gradient-to-br ${getBackgroundGradient(1)} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group relative`}>
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <h3 className="font-bold text-gray-800 text-xl">Objetivos</h3>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                                        <Target className="w-6 h-6 text-teal-700" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {research.objectives && research.objectives.length > 0 ? (
                                        research.objectives.map((objective, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center text-xs font-bold text-teal-700 mt-0.5">
                                                    {index + 1}
                                                </div>
                                                <p className="text-gray-700 text-sm">{objective}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-600 text-sm italic">
                                            Los objetivos específicos de esta investigación están siendo definidos como parte del proceso de conservación y monitoreo de la biodiversidad aviar amazónica.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Equipo y Resultados */}
                        <div className={`bg-gradient-to-br ${getBackgroundGradient(2)} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group relative`}>
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <h3 className="font-bold text-gray-800 text-xl">Equipo de Investigación</h3>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                                        <Users className="w-6 h-6 text-green-700" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {/* Líder del proyecto */}
                                    <div className="bg-white/60 rounded-2xl p-4">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">Líder de Investigación</p>
                                                <p className="text-sm text-gray-600">
                                                    {research.leader.first_name} {research.leader.middle_name || ''} {research.leader.first_last_name} {research.leader.middle_last_name || ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Miembros del equipo */}
                                    {research.team && research.team.length > 0 ? (
                                        research.team.map((member, index) => (
                                            <div key={index} className="bg-white/60 rounded-2xl p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-green-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-sm font-bold">{index + 1}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-700">
                                                            {member.first_name} {member.middle_name || ''} {member.first_last_name} {member.middle_last_name || ''}
                                                        </p>
                                                        <p className="text-xs text-gray-500">Investigador</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-white/60 rounded-2xl p-4">
                                            <p className="text-gray-600 text-sm italic flex items-center">
                                                <Users className="w-4 h-4 mr-2 text-gray-400" />
                                                Equipo en proceso de conformación
                                            </p>
                                        </div>
                                    )}

                                    {/* Resultados */}
                                    <div className="mt-6">
                                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                            <FlaskConical className="w-4 h-4 mr-2 text-green-600" />
                                            Resultados ({research.results?.length || 0})
                                        </h4>
                                        {research.results && research.results.length > 0 ? (
                                            <div className="space-y-2">
                                                {research.results.map((result, index) => (
                                                    <div key={index} className="bg-white/60 rounded-xl p-3">
                                                        <p className="text-sm text-gray-700">{result}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-white/60 rounded-xl p-3">
                                                <p className="text-gray-600 text-sm italic">
                                                    Los resultados se actualizarán conforme avance la investigación
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Puntos de Muestreo Detallados */}
                    <div className={`bg-gradient-to-br ${getBackgroundGradient(3)} rounded-3xl p-8 shadow-lg mb-12`}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-4">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                                    <MapPin className="w-6 h-6 text-emerald-700" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Puntos de Muestreo Detallados</h2>
                                    <p className="text-gray-600">Información específica de cada punto de observación</p>
                                </div>
                            </div>

                            <button
                                onClick={toggleSortOrder}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all group"
                                title={`Ordenar ${sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
                            >
                                {sortOrder === 'asc' ? (
                                    <ArrowUp className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
                                ) : (
                                    <ArrowDown className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
                                )}
                            </button>
                        </div>

                        {sortedSamplingPoints.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {sortedSamplingPoints.map((point, index) => {
                                    const IconComponent = getNatureIcon(index);
                                    const hasValidCoordinates = point.coordinates.latitude !== 0 && point.coordinates.longitude !== 0;

                                    return (
                                        <div
                                            key={point.uuid}
                                            className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group relative border border-emerald-100/30 transform hover:scale-105`}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>

                                            <div className="relative z-10">
                                                {/* Header del punto */}
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                                            <span className="text-white font-bold text-lg">{point.pointNumber}</span>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-800">Punto {point.pointNumber}</h3>
                                                            <p className="text-sm text-gray-600">{point.samplingType}</p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
                                                        <IconComponent className="w-5 h-5 text-emerald-700" />
                                                    </div>
                                                </div>

                                                {/* Información del punto */}
                                                <div className="space-y-4 mb-6">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-emerald-50/80 rounded-xl p-3">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <Target className="w-4 h-4 text-emerald-600" />
                                                                <span className="text-xs font-medium text-emerald-800">Detalle</span>
                                                            </div>
                                                            <p className="text-sm text-gray-700">{point.detailSamplingType || 'No especificado'}</p>
                                                        </div>

                                                        <div className="bg-teal-50/80 rounded-xl p-3">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <Eye className="w-4 h-4 text-teal-600" />
                                                                <span className="text-xs font-medium text-teal-800">Detección</span>
                                                            </div>
                                                            <p className="text-sm text-gray-700">{point.detection || 'No especificado'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-green-50/80 rounded-xl p-3">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <Compass className="w-4 h-4 text-green-600" />
                                                                <span className="text-xs font-medium text-green-800">Radio</span>
                                                            </div>
                                                            <p className="text-sm text-gray-700 font-semibold">{point.fixedRadius} metros</p>
                                                        </div>

                                                        <div className="bg-blue-50/80 rounded-xl p-3">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <Clock className="w-4 h-4 text-blue-600" />
                                                                <span className="text-xs font-medium text-blue-800">Período</span>
                                                            </div>
                                                            <p className="text-sm text-gray-700 font-semibold">{point.censusPeriod} días</p>
                                                        </div>
                                                    </div>

                                                    {/* Fechas */}
                                                    <div className="bg-gray-50/80 rounded-xl p-3">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <Calendar className="w-4 h-4 text-gray-600" />
                                                            <span className="text-xs font-medium text-gray-800">Cronograma</span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-xs text-gray-600">
                                                                <strong>Inicio:</strong> {formatDate(point.startDate)}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                <strong>Fin:</strong> {formatDate(point.endDate)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Mapa individual o mensaje de coordenadas */}
                                                <div className="mb-4">
                                                    <div className="flex items-center space-x-2 mb-3">
                                                        <MapPin className="w-4 h-4 text-gray-600" />
                                                        <span className="text-sm font-medium text-gray-800">Ubicación</span>
                                                    </div>

                                                    {hasValidCoordinates ? (
                                                        <div className="h-48 rounded-xl overflow-hidden shadow-lg">
                                                            <MapContainer
                                                                center={[point.coordinates.latitude, point.coordinates.longitude]}
                                                                zoom={16}
                                                                style={{ height: '100%', width: '100%' }}
                                                            >
                                                                <TileLayer
                                                                    url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                                                    attribution='&copy; Google Satellite'
                                                                    maxZoom={20}
                                                                />
                                                                <Marker
                                                                    position={[point.coordinates.latitude, point.coordinates.longitude]}
                                                                    icon={createCustomIcon('emerald', point.pointNumber.toString())}
                                                                >
                                                                    <Popup>
                                                                        <div className="text-center">
                                                                            <h4 className="font-bold">Punto {point.pointNumber}</h4>
                                                                            <p className="text-sm">{point.samplingType}</p>
                                                                        </div>
                                                                    </Popup>
                                                                </Marker>
                                                            </MapContainer>
                                                        </div>
                                                    ) : (
                                                        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                                            <div className="text-center">
                                                                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                                <p className="text-gray-600 font-medium">Coordenadas no definidas</p>
                                                                <p className="text-sm text-gray-500">Pendiente de georreferenciación</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Coordenadas exactas */}
                                                {hasValidCoordinates && (
                                                    <div className="bg-indigo-50/80 rounded-xl p-3 mb-4">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <Globe className="w-4 h-4 text-indigo-600" />
                                                            <span className="text-xs font-medium text-indigo-800">Coordenadas</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <p className="text-gray-700">
                                                                <strong>Lat:</strong> {point.coordinates.latitude.toFixed(6)}
                                                            </p>
                                                            <p className="text-gray-700">
                                                                <strong>Lng:</strong> {point.coordinates.longitude.toFixed(6)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Botón de acción */}
                                                <button
                                                    onClick={() => handleViewMore(point.uuid)}
                                                    className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                                >
                                                    Ver detalles completos
                                                </button>

                                                {/* Status indicator */}
                                                <div className="absolute top-4 right-4">
                                                    <div className={`w-3 h-3 rounded-full ${hasValidCoordinates ? 'bg-green-400' : 'bg-yellow-400'
                                                        } shadow-lg`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-block mb-4">
                                    <div className="w-20 h-20 bg-white/80 rounded-3xl flex items-center justify-center shadow-lg">
                                        <MapPin className="w-10 h-10 text-gray-400" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">No hay puntos de muestreo</h3>
                                <p className="text-gray-500">Esta investigación aún no tiene puntos de muestreo definidos.</p>
                            </div>
                        )}
                    </div>

                    {/* Resumen de la Investigación */}
                    <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-emerald-100/50 p-8 mb-12">
                        <div className="text-center mb-8">
                            <div className="inline-block mb-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <BarChart3 className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Resumen del Proyecto</h2>
                            <p className="text-gray-600">Contribuyendo al conocimiento y conservación de la biodiversidad amazónica</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <MapPin className="w-7 h-7 text-emerald-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-800 mb-1">{stats.totalPoints}</div>
                                <div className="text-sm text-gray-600">Puntos de Muestreo</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {stats.validCoordinates} con coordenadas
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Users className="w-7 h-7 text-teal-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-800 mb-1">{research.team.length + 1}</div>
                                <div className="text-sm text-gray-600">Investigadores</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    1 líder + {research.team.length} miembros
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Target className="w-7 h-7 text-green-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-800 mb-1">{research.objectives?.length || 0}</div>
                                <div className="text-sm text-gray-600">Objetivos</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Definidos
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <FlaskConical className="w-7 h-7 text-blue-600" />
                                </div>
                                <div className="text-2xl font-bold text-gray-800 mb-1">{research.results?.length || 0}</div>
                                <div className="text-sm text-gray-600">Resultados</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Obtenidos
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center mb-12">
                        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 rounded-3xl p-8 text-white shadow-2xl">
                            <div className="mb-6">
                                <div className="inline-block mb-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <Bird className="w-8 h-8 text-white animate-bounce" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Protegiendo la Biodiversidad Amazónica</h2>
                                <p className="text-lg opacity-90">
                                    Cada punto de muestreo contribuye al conocimiento científico y la conservación de especies únicas
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4">
                                <button
                                    onClick={handleExportData}
                                    className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Explorar Datos
                                </button>
                                <button
                                    onClick={handleDownloadReport}
                                    className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/20"
                                >
                                    Descargar Reporte
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Informativo */}
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-4 text-gray-600">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                <span className="text-sm">Proyecto Activo</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Globe className="w-4 h-4 text-teal-600" />
                                <span className="text-sm">Impacto Global</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Leaf className="w-4 h-4 text-green-600" />
                                <span className="text-sm">Conservación</span>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                            Sistema de Investigación Ornitológica - Amazonía Colombiana
                        </p>
                        <p className="text-gray-400 text-xs">
                            © 2025 Amazon Birds Research. Protegiendo la biodiversidad amazónica a través de la ciencia.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal de edición */}
            <EditResearchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                research={research}
                token={token}
                onUpdate={handleUpdateResearch}
            />
        </>
    );
};

export default ResearchDetailPage;