import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import axios from 'axios';
import { useAuth } from "../../contexts/useAuth";
import {
    Search,
    Filter,
    MapPin,
    Calendar,
    Users,
    ChevronLeft,
    ChevronRight,
    Bird,
    Leaf,
    TreePine,
    Target,
    FlaskConical
} from 'lucide-react';

const ResearchListPage = () => {
    const { user, token } = useAuth();
    const [researches, setResearches] = useState([]);
    const [filteredResearches, setFilteredResearches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [researchesPerPage] = useState(6);
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimated(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchResearches = async () => {
            try {
                const endpoint = user?.role === 'admin' ? '/api/research' : '/api/research?myRole=all';
                const response = await axios.get(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setResearches(response.data.data);
                setFilteredResearches(response.data.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching researches:', error);
                setIsLoading(false);
            }
        };

        if (token && user) {
            fetchResearches();
        }
    }, [token, user]);

    useEffect(() => {
        const filtered = researches.filter(research =>
            research.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredResearches(filtered);
        setCurrentPage(1);
    }, [searchTerm, researches]);

    const indexOfLastResearch = currentPage * researchesPerPage;
    const indexOfFirstResearch = indexOfLastResearch - researchesPerPage;
    const currentResearches = filteredResearches.slice(indexOfFirstResearch, indexOfLastResearch);
    const totalPages = Math.ceil(filteredResearches.length / researchesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const isLeader = (research) => research.leader.uuid === user?.uuid;

    const isTeamMember = (research) =>
        research.team.some(member => member.uuid === user?.uuid);

    const formatDate = (dateString) => {
        if (!dateString) return 'No definida';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-CO', options);
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
        const icons = [Bird, TreePine, Leaf, FlaskConical, Target];
        const IconComponent = icons[index % icons.length];
        return IconComponent;
    };

    return (
        <>
            <Helmet>
                <title>Investigaciones - Amazon Birds Research</title>
                <meta name="description" content="Listado de investigaciones ornitológicas" />
                <meta name="keywords" content="investigaciones, proyectos, ornitología, amazon birds research" />
            </Helmet>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-emerald-100 p-4 sm:p-6 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
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
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-10 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400 to-green-500 rounded-full opacity-5 animate-spin" style={{ animationDuration: '30s' }}></div>
                </div>

                <div className={`relative w-full max-w-7xl mx-auto transform transition-all duration-1000 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
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
                                Listado de Investigaciones
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-emerald-100/50 p-6 mb-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors duration-200" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 hover:bg-emerald-50 focus:bg-white"
                                    placeholder="Buscar investigación por nombre..."
                                />
                            </div>
                            <button className="flex items-center justify-center px-4 py-3 bg-emerald-50 text-emerald-700 font-medium rounded-xl hover:bg-emerald-100 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 border border-emerald-200">
                                <Filter className="w-5 h-5 mr-2" />
                                <span>Filtrar</span>
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
                            <p className="text-gray-600">Cargando investigaciones...</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                                {currentResearches.length > 0 ? (
                                    currentResearches.map((research, index) => {
                                        const IconComponent = getNatureIcon(index);

                                        return (
                                            <div
                                                key={research.uuid}
                                                className={`bg-gradient-to-br ${getBackgroundGradient(index)} rounded-3xl overflow-hidden border transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] group relative h-[300px] ${isLeader(research)
                                                    ? 'border-emerald-400 shadow-emerald-200/50'
                                                    : isTeamMember(research)
                                                        ? 'border-teal-400 shadow-teal-200/50'
                                                        : 'border-white/60 shadow-gray-200/30'
                                                    } shadow-lg`}
                                            >
                                                <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                <div className={`absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${isLeader(research)
                                                    ? 'bg-emerald-500/80 text-white'
                                                    : isTeamMember(research)
                                                        ? 'bg-teal-500/80 text-white'
                                                        : 'bg-gray-500/80 text-white'
                                                    }`}>
                                                    {isLeader(research) ? '🏆 Líder' : isTeamMember(research) ? '👥 Miembro' : '👁️ Otra'}
                                                </div>

                                                <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
                                                                <IconComponent className="w-5 h-5 text-emerald-700" />
                                                            </div>
                                                        </div>

                                                        <h3 className="font-bold text-gray-800 line-clamp-2 text-lg">
                                                            {research.name || 'Investigación sin nombre'}
                                                        </h3>

                                                        {research.description && (
                                                            <p className="text-gray-700 line-clamp-2 text-sm mt-1">
                                                                {research.description}
                                                            </p>
                                                        )}

                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {research.objectives && research.objectives.length > 0 && (
                                                                <div className="bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center">
                                                                    <Target className="w-3 h-3 mr-1" />
                                                                    {research.objectives.length} objetivos
                                                                </div>
                                                            )}
                                                            {research.results && research.results.length > 0 && (
                                                                <div className="bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center">
                                                                    <FlaskConical className="w-3 h-3 mr-1" />
                                                                    {research.results.length} resultados
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mt-2 space-y-1 border-t border-white/30 pt-2">
                                                        {(research.startDate || research.endDate) && (
                                                            <div className="flex items-center text-xs text-gray-700">
                                                                <Calendar className="w-3 h-3 mr-1 text-emerald-600" />
                                                                <span className="truncate">
                                                                    {formatDate(research.startDate)} - {formatDate(research.endDate)}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {research.locality && (
                                                            <div className="flex items-center text-xs text-gray-700">
                                                                <MapPin className="w-3 h-3 mr-1 text-teal-600" />
                                                                <span className="truncate">
                                                                    {research.locality.city}, {research.locality.state}
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center text-xs text-gray-700">
                                                                <Users className="w-3 h-3 mr-1 text-purple-600" />
                                                                <span>{research.team.length + 1} miembros</span>
                                                            </div>

                                                            {research.status && (
                                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${research.status === 'Ejecución'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                                    }`}>
                                                                    {research.status}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full text-center py-12">
                                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                                            <Search className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-700 mb-3">
                                            No se encontraron investigaciones
                                        </h3>
                                        <p className="text-gray-500 text-lg">
                                            {searchTerm
                                                ? 'No hay coincidencias con tu búsqueda'
                                                : 'No hay investigaciones disponibles'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {filteredResearches.length > researchesPerPage && (
                                <div className="flex justify-center items-center space-x-2">
                                    <button
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        disabled={currentPage === 1}
                                        className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 hover:bg-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-semibold ${currentPage === number
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                                                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg'
                                                } transition-all duration-200`}
                                        >
                                            {number}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 hover:bg-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    <div className="text-center mt-12 space-y-2">
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

export default ResearchListPage;