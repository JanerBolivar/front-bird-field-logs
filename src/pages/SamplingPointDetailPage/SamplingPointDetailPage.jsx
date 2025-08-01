import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { useParams, Link } from 'react-router-dom';
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
    Thermometer,
    Droplets,
    CloudRain,
    Cloud,
    Sun,
    Zap,
    Camera,
    Ruler,
    ArrowLeft,
    Filter,
    Search,
    ImageIcon,
    Info
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const SamplingPointDetailPage = () => {
    const { user, token } = useAuth();
    const { uuid } = useParams();
    const [samplingPoint, setSamplingPoint] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnimated, setIsAnimated] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedSample, setSelectedSample] = useState(null);
    const [filterSpecies, setFilterSpecies] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimated(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchSamplingPoint = async () => {
            try {
                const response = await axios.get(`/api/sampling-points/${uuid}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSamplingPoint(response.data.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching sampling point:', error);
                setIsLoading(false);
            }
        };

        if (token && user && uuid) {
            fetchSamplingPoint();
        }
    }, [token, user, uuid]);

    const formatDate = (dateString) => {
        if (!dateString) return 'No definida';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-CO', options);
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

    const getWeatherIcon = (condition) => {
        switch (condition?.toLowerCase()) {
            case 'soleado': case 'despejado': return Sun;
            case 'nublado': case 'parcialmente nublado': return Cloud;
            case 'lluvia': case 'llovizna': return CloudRain;
            default: return Sun;
        }
    };

    const getPrecipitationColor = (state) => {
        switch (state?.toLowerCase()) {
            case 'seco': return 'text-yellow-600 bg-yellow-100';
            case 'normal': return 'text-green-600 bg-green-100';
            case 'húmedo': case 'humedo': return 'text-blue-600 bg-blue-100';
            case 'lluvia': return 'text-indigo-600 bg-indigo-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    // Sort samples
    const sortedSamples = samplingPoint?.samples ? [...samplingPoint.samples].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }) : [];

    // Filter species
    const getFilteredSpecies = (observedSpecies) => {
        if (!filterSpecies) return observedSpecies || [];
        return (observedSpecies || []).filter(species =>
            species.species?.toLowerCase().includes(filterSpecies.toLowerCase()) ||
            species.activity?.toLowerCase().includes(filterSpecies.toLowerCase()) ||
            species.substrate?.toLowerCase().includes(filterSpecies.toLowerCase())
        );
    };

    // Get statistics
    const getStatistics = () => {
        if (!samplingPoint) return {};

        const totalSamples = samplingPoint.samples?.length || 0;
        const totalSpecies = samplingPoint.samples?.reduce((total, sample) =>
            total + (sample.observedSpecies?.length || 0), 0) || 0;

        const uniqueSpecies = new Set();
        samplingPoint.samples?.forEach(sample => {
            sample.observedSpecies?.forEach(species => {
                uniqueSpecies.add(species.species);
            });
        });

        const totalIndividuals = samplingPoint.samples?.reduce((total, sample) =>
            total + (sample.observedSpecies?.reduce((sampleTotal, species) =>
                sampleTotal + (species.abundance || 0), 0) || 0), 0) || 0;

        const avgTemperature = totalSamples > 0 ?
            Math.round(samplingPoint.samples.reduce((sum, sample) =>
                sum + (sample.temperature || 0), 0) / totalSamples) : 0;

        const avgHumidity = totalSamples > 0 ?
            Math.round(samplingPoint.samples.reduce((sum, sample) =>
                sum + (sample.relativeHumidity || 0), 0) / totalSamples) : 0;

        return {
            totalSamples,
            totalSpecies,
            uniqueSpecies: uniqueSpecies.size,
            totalIndividuals,
            avgTemperature,
            avgHumidity
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
                                    <MapPin className="w-12 h-12 text-emerald-600 animate-bounce" />
                                    <FlaskConical className="w-10 h-10 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-emerald-700 font-medium text-lg">Cargando punto de muestreo...</p>
                    <p className="text-gray-500 text-sm mt-2">Preparando datos de observación</p>
                </div>
            </div>
        );
    }

    if (!samplingPoint) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="relative text-center">
                    <div className="inline-block group mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-600 rounded-full blur-xl opacity-30"></div>
                            <div className="relative bg-white rounded-full p-8 shadow-2xl">
                                <div className="flex items-center justify-center">
                                    <MapPin className="w-12 h-12 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">Punto de muestreo no encontrado</h3>
                    <p className="text-gray-500 text-lg">No se pudo encontrar el punto de muestreo solicitado.</p>
                    <p className="text-sm text-gray-400 mt-2">Verifica el enlace o contacta al administrador del sistema</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{`Punto ${samplingPoint?.pointNumber} - ${samplingPoint?.research?.name || 'Investigación'}`}</title>
                <meta
                    name="description"
                    content={`Punto de muestreo ${samplingPoint?.pointNumber} - ${samplingPoint?.samplingType} en ${samplingPoint?.research?.locality?.city || 'ubicación desconocida'}`}
                />
                <meta
                    name="keywords"
                    content="punto de muestreo, ornitología, biodiversidad, amazon birds research"
                />
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
                </div>

                <div className={`relative w-full max-w-7xl mx-auto transform transition-all duration-1500 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

                    {/* Navigation Back */}
                    <div className="mb-8">
                        <Link
                            to={`/research-detail/${samplingPoint.research.uuid}`}
                            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Volver a {samplingPoint.research.name}</span>
                        </Link>
                    </div>

                    {/* Header Principal */}
                    <div className="text-center mb-12">
                        <div className="inline-block group cursor-pointer mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
                                <div className="relative bg-white rounded-full p-8 shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-110">
                                    <div className="flex items-center justify-center space-x-2">
                                        <MapPin className="w-12 h-12 text-emerald-600 animate-bounce" style={{ animationDuration: '3s' }} />
                                        <FlaskConical className="w-10 h-10 text-green-600" />
                                        <span className="text-2xl font-bold text-emerald-700">{samplingPoint.pointNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-green-700 bg-clip-text text-transparent leading-tight">
                                Punto de Muestreo {samplingPoint.pointNumber}
                            </h1>

                            <div className="flex items-center justify-center space-x-2 text-xl md:text-2xl font-semibold text-gray-700">
                                <Target className="w-6 h-6 text-emerald-600" />
                                <span>{samplingPoint.samplingType}</span>
                            </div>

                            <div className="flex items-center justify-center space-x-2 text-lg text-gray-600">
                                <Eye className="w-5 h-5 text-teal-600" />
                                <span>{samplingPoint.detailSamplingType} - {samplingPoint.detection}</span>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas Generales */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FlaskConical className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{stats.totalSamples}</div>
                            <div className="text-sm text-gray-600">Muestras</div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Bird className="w-6 h-6 text-teal-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{stats.uniqueSpecies}</div>
                            <div className="text-sm text-gray-600">Especies Únicas</div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <BarChart3 className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{stats.totalIndividuals}</div>
                            <div className="text-sm text-gray-600">Individuos</div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Compass className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{samplingPoint.fixedRadius}m</div>
                            <div className="text-sm text-gray-600">Radio</div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Clock className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{samplingPoint.censusPeriod}</div>
                            <div className="text-sm text-gray-600">Días</div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Thermometer className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{stats.avgTemperature}°C</div>
                            <div className="text-sm text-gray-600">Temp. Promedio</div>
                        </div>
                    </div>

                    {/* Información general del punto */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Detalles del Punto */}
                        <div className={`bg-gradient-to-br ${getBackgroundGradient(0)} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group relative`}>
                            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <h3 className="font-bold text-gray-800 text-xl">Detalles del Punto</h3>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                                        <Target className="w-6 h-6 text-emerald-700" />
                                    </div>
                                </div>
                                <div className="space-y-4 text-gray-700">
                                    <div className="flex items-start space-x-3">
                                        <Calendar className="w-5 h-5 text-emerald-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium">Período de Muestreo</p>
                                            <p className="text-sm">{formatDate(samplingPoint.startDate)} - {formatDate(samplingPoint.endDate)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Eye className="w-5 h-5 text-teal-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium">Método de Detección</p>
                                            <p className="text-sm">{samplingPoint.detection}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Compass className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="font-medium">Características Técnicas</p>
                                            <p className="text-sm"><strong>Radio fijo:</strong> {samplingPoint.fixedRadius} metros</p>
                                            <p className="text-sm"><strong>Período de censo:</strong> {samplingPoint.censusPeriod} días</p>
                                        </div>
                                    </div>

                                    {samplingPoint.coordinates && samplingPoint.coordinates.latitude !== 0 && (
                                        <div className="flex items-start space-x-3">
                                            <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium">Coordenadas</p>
                                                <p className="text-sm"><strong>Latitud:</strong> {samplingPoint.coordinates.latitude.toFixed(6)}</p>
                                                <p className="text-sm"><strong>Longitud:</strong> {samplingPoint.coordinates.longitude.toFixed(6)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mapa del Punto */}
                        <div className={`bg-gradient-to-br ${getBackgroundGradient(1)} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500`}>
                            <div className="flex items-start justify-between mb-6">
                                <h3 className="font-bold text-gray-800 text-xl">Ubicación</h3>
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                                    <MapPin className="w-6 h-6 text-teal-700" />
                                </div>
                            </div>

                            {samplingPoint.coordinates && samplingPoint.coordinates.latitude !== 0 ? (
                                <div className="h-80 rounded-2xl overflow-hidden shadow-lg">
                                    <MapContainer
                                        center={[samplingPoint.coordinates.latitude, samplingPoint.coordinates.longitude]}
                                        zoom={16}
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                            attribution='&copy; Google Satellite'
                                            maxZoom={20}
                                        />
                                        <Marker
                                            position={[samplingPoint.coordinates.latitude, samplingPoint.coordinates.longitude]}
                                            icon={createCustomIcon('emerald', samplingPoint.pointNumber.toString())}
                                        >
                                            <Popup>
                                                <div className="text-center">
                                                    <h4 className="font-bold">Punto {samplingPoint.pointNumber}</h4>
                                                    <p className="text-sm">{samplingPoint.samplingType}</p>
                                                    <p className="text-xs">{samplingPoint.detailSamplingType}</p>
                                                </div>
                                            </Popup>
                                        </Marker>
                                        <Circle
                                            center={[samplingPoint.coordinates.latitude, samplingPoint.coordinates.longitude]}
                                            radius={samplingPoint.fixedRadius}
                                            pathOptions={{
                                                color: '#10b981',
                                                fillColor: '#10b981',
                                                fillOpacity: 0.2,
                                                weight: 2
                                            }}
                                        />
                                    </MapContainer>
                                </div>
                            ) : (
                                <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 font-medium">Coordenadas no definidas</p>
                                        <p className="text-sm text-gray-500">Pendiente de georreferenciación</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Muestras y Observaciones */}
                    <div className={`bg-gradient-to-br ${getBackgroundGradient(2)} rounded-3xl p-8 shadow-lg mb-12`}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-4">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                                    <FlaskConical className="w-6 h-6 text-emerald-700" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Muestras y Observaciones</h2>
                                    <p className="text-gray-600">Datos recolectados en este punto de muestreo</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all group"
                                    title="Filtros"
                                >
                                    <Filter className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
                                </button>

                                <button
                                    onClick={toggleSortOrder}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all group"
                                    title={`Ordenar por fecha ${sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
                                >
                                    {sortOrder === 'asc' ? (
                                        <ArrowUp className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
                                    ) : (
                                        <ArrowDown className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Filtros */}
                        {showFilters && (
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
                                <div className="flex items-center space-x-4">
                                    <Search className="w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Filtrar especies por nombre, actividad o sustrato..."
                                        value={filterSpecies}
                                        onChange={(e) => setFilterSpecies(e.target.value)}
                                        className="flex-1 bg-white/80 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Lista de Muestras */}
                        <div className="space-y-6">
                            {sortedSamples.length === 0 ? (
                                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg">
                                    <FlaskConical className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-600 mb-2">No hay muestras registradas</h3>
                                    <p className="text-gray-500">Este punto de muestreo aún no tiene datos recolectados.</p>
                                </div>
                            ) : (
                                sortedSamples.map((sample, index) => {
                                    const filteredSpecies = getFilteredSpecies(sample.observedSpecies);
                                    const WeatherIcon = getWeatherIcon(sample.overallConditions);

                                    return (
                                        <div
                                            key={sample.uuid}
                                            className={`bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 group relative ${selectedSample === sample.uuid ? 'ring-2 ring-emerald-500' : ''}`}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 via-teal-100/20 to-green-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                                            <div className="relative z-10">
                                                {/* Header de la muestra */}
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`bg-gradient-to-br ${getBackgroundGradient(index)} rounded-2xl p-4 shadow-lg`}>
                                                            <FlaskConical className="w-8 h-8 text-emerald-700" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-800">
                                                                Muestra #{index + 1}
                                                            </h3>
                                                            <div className="flex items-center space-x-2 text-gray-600">
                                                                <Calendar className="w-4 h-4" />
                                                                <span className="font-medium">{formatDate(sample.date)}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-gray-600 mt-1">
                                                                <Users className="w-4 h-4" />
                                                                <span className="text-sm">
                                                                    {sample.collectedBy ?
                                                                        `${sample.collectedBy.first_name} ${sample.collectedBy.first_last_name}` :
                                                                        'Recolector no especificado'
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => setSelectedSample(selectedSample === sample.uuid ? null : sample.uuid)}
                                                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all group"
                                                        title={selectedSample === sample.uuid ? 'Colapsar' : 'Expandir'}
                                                    >
                                                        {selectedSample === sample.uuid ? (
                                                            <ArrowUp className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
                                                        ) : (
                                                            <ArrowDown className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Condiciones ambientales */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow">
                                                        <Thermometer className="w-6 h-6 text-red-500 mx-auto mb-2" />
                                                        <div className="text-lg font-bold text-gray-800">{sample.temperature || 'N/A'}°C</div>
                                                        <div className="text-xs text-gray-600">Temperatura</div>
                                                    </div>

                                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow">
                                                        <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                                        <div className="text-lg font-bold text-gray-800">{sample.relativeHumidity || 'N/A'}%</div>
                                                        <div className="text-xs text-gray-600">Humedad</div>
                                                    </div>

                                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow">
                                                        <div className={`inline-flex items-center justify-center w-6 h-6 mx-auto mb-2 rounded-full text-xs font-bold ${getPrecipitationColor(sample.precipitationState)}`}>
                                                            <CloudRain className="w-4 h-4" />
                                                        </div>
                                                        <div className="text-sm font-bold text-gray-800">{sample.precipitationState || 'N/A'}</div>
                                                        <div className="text-xs text-gray-600">Precipitación</div>
                                                    </div>

                                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow">
                                                        <Cloud className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                                                        <div className="text-lg font-bold text-gray-800">{sample.cloudCoverage || 'N/A'}%</div>
                                                        <div className="text-xs text-gray-600">Nubosidad</div>
                                                    </div>

                                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow">
                                                        <Sun className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                                                        <div className="text-sm font-bold text-gray-800">{sample.luminosity || 'N/A'}</div>
                                                        <div className="text-xs text-gray-600">Luminosidad</div>
                                                    </div>

                                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow">
                                                        <WeatherIcon className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                                        <div className="text-sm font-bold text-gray-800">{sample.overallConditions || 'N/A'}</div>
                                                        <div className="text-xs text-gray-600">Condiciones</div>
                                                    </div>
                                                </div>

                                                {/* Resumen de especies */}
                                                <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 mb-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Bird className="w-5 h-5 text-emerald-600" />
                                                                <span className="font-semibold text-gray-800">
                                                                    {filteredSpecies.length} especies observadas
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <BarChart3 className="w-5 h-5 text-teal-600" />
                                                                <span className="font-semibold text-gray-800">
                                                                    {filteredSpecies.reduce((total, species) => total + (species.abundance || 0), 0)} individuos
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {filterSpecies && (
                                                            <div className="text-sm text-gray-600">
                                                                Filtro aplicado: "{filterSpecies}"
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Detalles expandidos de especies */}
                                                {selectedSample === sample.uuid && (
                                                    <div className="space-y-4 animate-in slide-in-from-top duration-500">
                                                        {filteredSpecies.length === 0 ? (
                                                            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-8 text-center">
                                                                <Bird className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                                <p className="text-gray-600 font-medium">
                                                                    {filterSpecies ?
                                                                        'No se encontraron especies que coincidan con el filtro' :
                                                                        'No hay especies registradas en esta muestra'
                                                                    }
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            filteredSpecies.map((species, speciesIndex) => (
                                                                <div
                                                                    key={species.uuid}
                                                                    className={`bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow hover:shadow-lg transition-all duration-300 border-l-4 ${getBackgroundGradient(speciesIndex)} border-emerald-500`}
                                                                >
                                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                                        {/* Información básica de la especie */}
                                                                        <div className="lg:col-span-2">
                                                                            <div className="flex items-start justify-between mb-4">
                                                                                <div>
                                                                                    <h4 className="text-lg font-bold text-gray-800 italic mb-1">
                                                                                        {species.species || 'Especie no identificada'}
                                                                                    </h4>
                                                                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                                                        <div className="flex items-center space-x-1">
                                                                                            <BarChart3 className="w-4 h-4" />
                                                                                            <span><strong>Abundancia:</strong> {species.abundance || 0}</span>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-1">
                                                                                            <Ruler className="w-4 h-4" />
                                                                                            <span><strong>Distancia:</strong> {species.distance || 'N/A'} m</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="bg-emerald-100 rounded-lg px-3 py-1">
                                                                                    <span className="text-emerald-700 font-medium text-sm">
                                                                                        {species.detection || 'N/A'}
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            {/* Detalles demográficos */}
                                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                                                                <div className="bg-blue-50 rounded-lg p-3 text-center">
                                                                                    <div className="text-lg font-bold text-blue-700">{species.males || 0}</div>
                                                                                    <div className="text-xs text-blue-600">Machos</div>
                                                                                </div>
                                                                                <div className="bg-pink-50 rounded-lg p-3 text-center">
                                                                                    <div className="text-lg font-bold text-pink-700">{species.females || 0}</div>
                                                                                    <div className="text-xs text-pink-600">Hembras</div>
                                                                                </div>
                                                                                <div className="bg-green-50 rounded-lg p-3 text-center">
                                                                                    <div className="text-lg font-bold text-green-700">{species.numberAdults || 0}</div>
                                                                                    <div className="text-xs text-green-600">Adultos</div>
                                                                                </div>
                                                                                <div className="bg-orange-50 rounded-lg p-3 text-center">
                                                                                    <div className="text-lg font-bold text-orange-700">{species.JuvenileCount || 0}</div>
                                                                                    <div className="text-xs text-orange-600">Juveniles</div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Información ecológica */}
                                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                                                <div className="bg-white/80 rounded-lg p-3">
                                                                                    <div className="flex items-center space-x-2 mb-1">
                                                                                        <Activity className="w-4 h-4 text-emerald-600" />
                                                                                        <span className="font-medium text-gray-700">Actividad</span>
                                                                                    </div>
                                                                                    <span className="text-sm text-gray-600">{species.activity || 'No especificada'}</span>
                                                                                </div>
                                                                                <div className="bg-white/80 rounded-lg p-3">
                                                                                    <div className="flex items-center space-x-2 mb-1">
                                                                                        <TreePine className="w-4 h-4 text-green-600" />
                                                                                        <span className="font-medium text-gray-700">Sustrato</span>
                                                                                    </div>
                                                                                    <span className="text-sm text-gray-600">{species.substrate || 'No especificado'}</span>
                                                                                </div>
                                                                                <div className="bg-white/80 rounded-lg p-3">
                                                                                    <div className="flex items-center space-x-2 mb-1">
                                                                                        <Mountain className="w-4 h-4 text-blue-600" />
                                                                                        <span className="font-medium text-gray-700">Estrato</span>
                                                                                    </div>
                                                                                    <span className="text-sm text-gray-600">{species.stratum || 'No especificado'}</span>
                                                                                </div>
                                                                            </div>

                                                                            {/* Observaciones */}
                                                                            {species.observation && (
                                                                                <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 mb-4">
                                                                                    <div className="flex items-start space-x-2">
                                                                                        <Info className="w-4 h-4 text-amber-600 mt-0.5" />
                                                                                        <div>
                                                                                            <p className="font-medium text-amber-800 mb-1">Observaciones</p>
                                                                                            <p className="text-sm text-amber-700">{species.observation}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {/* Datos morfométricos */}
                                                                            {species.morphology && Object.values(species.morphology).some(val => val && val !== 0) && (
                                                                                <div className="bg-indigo-50 rounded-lg p-4">
                                                                                    <div className="flex items-center space-x-2 mb-3">
                                                                                        <Ruler className="w-4 h-4 text-indigo-600" />
                                                                                        <span className="font-medium text-indigo-800">Datos Morfométricos (mm)</span>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                                                                                        {species.morphology.billLength && (
                                                                                            <div className="text-center">
                                                                                                <div className="font-semibold text-indigo-700">{species.morphology.billLength}</div>
                                                                                                <div className="text-indigo-600">Pico</div>
                                                                                            </div>
                                                                                        )}
                                                                                        {species.morphology.wingChord && (
                                                                                            <div className="text-center">
                                                                                                <div className="font-semibold text-indigo-700">{species.morphology.wingChord}</div>
                                                                                                <div className="text-indigo-600">Ala</div>
                                                                                            </div>
                                                                                        )}
                                                                                        {species.morphology.tarsusLength && (
                                                                                            <div className="text-center">
                                                                                                <div className="font-semibold text-indigo-700">{species.morphology.tarsusLength}</div>
                                                                                                <div className="text-indigo-600">Tarso</div>
                                                                                            </div>
                                                                                        )}
                                                                                        {species.morphology.tailLength && (
                                                                                            <div className="text-center">
                                                                                                <div className="font-semibold text-indigo-700">{species.morphology.tailLength}</div>
                                                                                                <div className="text-indigo-600">Cola</div>
                                                                                            </div>
                                                                                        )}
                                                                                        {species.morphology.totalLength && (
                                                                                            <div className="text-center">
                                                                                                <div className="font-semibold text-indigo-700">{species.morphology.totalLength}</div>
                                                                                                <div className="text-indigo-600">Total</div>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Imágenes */}
                                                                        <div className="lg:col-span-1">
                                                                            {species.images && species.images.length > 0 ? (
                                                                                <div className="bg-white/80 rounded-lg p-4">
                                                                                    <div className="flex items-center space-x-2 mb-3">
                                                                                        <Camera className="w-4 h-4 text-gray-600" />
                                                                                        <span className="font-medium text-gray-700">
                                                                                            Imágenes ({species.images.length})
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-1 gap-3">
                                                                                        {species.images.slice(0, 2).map((image, imgIndex) => (
                                                                                            <div key={imgIndex} className="relative group">
                                                                                                <img
                                                                                                    src={image}
                                                                                                    alt={`${species.species} - ${imgIndex + 1}`}
                                                                                                    className="w-full h-24 object-cover rounded-lg shadow hover:shadow-lg transition-all cursor-pointer"
                                                                                                    onError={(e) => {
                                                                                                        e.target.style.display = 'none';
                                                                                                    }}
                                                                                                />
                                                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg flex items-center justify-center">
                                                                                                    <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-all" />
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                        {species.images.length > 2 && (
                                                                                            <div className="text-center text-sm text-gray-500 font-medium">
                                                                                                +{species.images.length - 2} imágenes más
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                                                                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                                                    <p className="text-sm text-gray-500">Sin imágenes</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Información del proyecto */}
                    <div className={`bg-gradient-to-br ${getBackgroundGradient(3)} rounded-3xl p-8 shadow-lg mb-12`}>
                        <div className="flex items-start justify-between mb-6">
                            <h3 className="font-bold text-gray-800 text-xl">Información del Proyecto</h3>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                                <Globe className="w-6 h-6 text-blue-700" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">{samplingPoint.research.name}</h4>
                                    <p className="text-gray-600 text-sm">{samplingPoint.research.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-medium text-gray-700">Tipo de hábitat</p>
                                        <p className="text-gray-600">{samplingPoint.research.habitatType}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Vegetación dominante</p>
                                        <p className="text-gray-600">{samplingPoint.research.dominantVegetation}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Altitud</p>
                                        <p className="text-gray-600">{samplingPoint.research.height} m</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Estado</p>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${samplingPoint.research.status === 'Ejecución' ? 'bg-green-100 text-green-800' :
                                            samplingPoint.research.status === 'Planeación' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {samplingPoint.research.status}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-medium text-gray-700 mb-2">Líder del proyecto</p>
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-600">
                                            {samplingPoint.research.leader ?
                                                `${samplingPoint.research.leader.first_name} ${samplingPoint.research.leader.first_last_name}` :
                                                'No especificado'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="font-medium text-gray-700 mb-2">Localización</p>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{samplingPoint.research.locality.name}</span>
                                        </div>
                                        <p className="ml-6">{samplingPoint.research.locality.neighborhood}, {samplingPoint.research.locality.city}</p>
                                        <p className="ml-6">{samplingPoint.research.locality.state}, {samplingPoint.research.locality.country}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-medium text-gray-700 mb-2">Período del proyecto</p>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(samplingPoint.research.startDate)} - {formatDate(samplingPoint.research.endDate)}</span>
                                    </div>
                                </div>

                                {samplingPoint.research.objectives && samplingPoint.research.objectives.length > 0 && (
                                    <div>
                                        <p className="font-medium text-gray-700 mb-2">Objetivos</p>
                                        <ul className="space-y-1 text-sm text-gray-600">
                                            {samplingPoint.research.objectives.map((objective, index) => (
                                                <li key={index} className="flex items-start space-x-2">
                                                    <Target className="w-3 h-3 mt-1 text-emerald-600" />
                                                    <span>{objective}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SamplingPointDetailPage;