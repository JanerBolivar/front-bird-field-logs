import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import axios from 'axios';
import { useAuth } from "../../contexts/useAuth";
import {
    Bird,
    Leaf,
    TreePine,
    MapPin,
    Search,
    Calendar,
    Eye,
    Camera,
    ChevronLeft,
    ChevronRight,
    Filter,
    BarChart3,
    ImageIcon,
} from 'lucide-react';
import Slider from "react-slick";
import SpeciesDetailModal from '../../components/SpeciesDetailModal/SpeciesDetailModal';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ObservedSpeciesPage = () => {
    const { user, token } = useAuth();

    const [species, setSpecies] = useState([]);
    const [filteredSpecies, setFilteredSpecies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAnimated, setIsAnimated] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSpecies, setSelectedSpecies] = useState(null);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);

    // Animación de entrada
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimated(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Cargar especies observadas
    useEffect(() => {
        const fetchObservedSpecies = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/observedSpecies/summary', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setSpecies(response.data.data);
                setFilteredSpecies(response.data.data);
            } catch (err) {
                console.error('Error fetching observed species:', err);
                setError('Error al cargar las especies observadas');
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchObservedSpecies();
        }
    }, [token]);

    // Filtrar especies por término de búsqueda
    useEffect(() => {
        const filtered = species.filter(specie =>
            specie.species.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSpecies(filtered);
        setCurrentPage(1);
    }, [searchTerm, species]);

    // Calcular paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSpecies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSpecies.length / itemsPerPage);

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Configuración del carrusel mejorada
    const carouselSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        adaptiveHeight: false,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        fade: true,
        cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)'
    };

    const openModal = (specie) => {
        setSelectedSpecies(specie);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSpecies(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-emerald-700 font-medium text-sm sm:text-base">Cargando especies observadas...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Especies Observadas - Amazon Birds Research</title>
                <meta name="description" content="Resumen de todas las especies observadas en la investigación" />
                <meta name="keywords" content="especies observadas, aves, amazonía, investigación ornitológica" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 relative overflow-hidden">
                {/* Elementos decorativos amazónicos - Responsivos */}
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

                    {/* Círculos de fondo - Responsivos */}
                    <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-10 animate-pulse"></div>
                    <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
                </div>

                <div className={`relative z-10 container mx-auto px-4 py-6 sm:py-8 transform transition-all duration-1000 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    {/* Header - Responsivo */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-block group cursor-pointer mb-4 sm:mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                <div className="relative bg-white rounded-full p-3 sm:p-4 shadow-2xl group-hover:shadow-3xl transition-all duration-300 transform group-hover:scale-105">
                                    <div className="flex items-center justify-center space-x-1">
                                        <Bird className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                                        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-green-700 bg-clip-text text-transparent mb-2">
                            Especies Observadas
                        </h1>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                            <span className="text-center">Región Amazónica Colombiana</span>
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 px-4">
                            Resumen de {species.length} especies documentadas en nuestras investigaciones
                        </p>
                    </div>

                    {/* Barra de búsqueda - Mejorada y responsiva */}
                    <div className="w-full mb-6 sm:mb-8">
                        <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-emerald-100/50 p-4 sm:p-6 mx-2 sm:mx-0">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-emerald-500 transition-colors duration-200" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 hover:bg-emerald-50 focus:bg-white text-sm sm:text-base"
                                    placeholder="Buscar especies por nombre científico..."
                                />
                            </div>
                            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-600">
                                <span className="flex items-center space-x-2">
                                    <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Mostrando {filteredSpecies.length} de {species.length} especies</span>
                                </span>
                                <span className="text-emerald-600 font-medium">
                                    Página {currentPage} de {totalPages}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="max-w-2xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
                            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                                {error}
                            </div>
                        </div>
                    )}

                    {/* Grid de especies - Mejorado y responsivo */}
                    {filteredSpecies.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8 px-2 sm:px-0">
                                {currentItems.map((specie, index) => (
                                    <div
                                        key={index}
                                        className="group bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer border border-emerald-100/30"
                                        onClick={() => openModal(specie)}
                                    >
                                        {/* Contenedor de imagen mejorado */}
                                        <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                                            {/* Overlay gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {specie.images && specie.images.length > 1 ? (
                                                <div className="h-full">
                                                    <Slider {...carouselSettings}>
                                                        {specie.images.map((image, imgIndex) => (
                                                            <div key={imgIndex} className="h-48 sm:h-52 lg:h-56">
                                                                <img
                                                                    src={image}
                                                                    alt={`${specie.species} - ${imgIndex + 1}`}
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.closest('.slick-slide').style.display = 'none';
                                                                    }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </Slider>
                                                </div>
                                            ) : specie.images && specie.images.length === 1 ? (
                                                <img
                                                    src={specie.images[0]}
                                                    alt={specie.species}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}

                                            {/* Fallback cuando no hay imagen */}
                                            {(!specie.images || specie.images.length === 0) && (
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="text-center">
                                                        <div className="bg-white/80 rounded-full p-4 mb-3 shadow-lg">
                                                            <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-400 mx-auto" />
                                                        </div>
                                                        <p className="text-emerald-600 font-medium text-sm">Sin imagen</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Badge de abundancia mejorado */}
                                            <div className="absolute top-3 right-3 z-20">
                                                <div className="bg-emerald-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg border border-white/20">
                                                    {specie.totalAbundance}
                                                </div>
                                            </div>

                                            {/* Indicador de múltiples imágenes */}
                                            {specie.images && specie.images.length > 1 && (
                                                <div className="absolute bottom-3 left-3 z-20">
                                                    <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                                        <Camera className="w-3 h-3" />
                                                        <span>{specie.images.length}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Contenido de la card mejorado */}
                                        <div className="p-4 sm:p-5">
                                            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 italic line-clamp-2 group-hover:text-emerald-700 transition-colors duration-300">
                                                {specie.species}
                                            </h3>

                                            <div className="space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                                        <Eye className="w-3 h-3 text-emerald-600" />
                                                    </div>
                                                    <span className="truncate">{specie.totalObservations} observaciones</span>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center">
                                                        <Camera className="w-3 h-3 text-teal-600" />
                                                    </div>
                                                    <span className="truncate">{specie.images ? specie.images.length : 0} imágenes</span>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                                        <Calendar className="w-3 h-3 text-green-600" />
                                                    </div>
                                                    <span className="truncate">Última: {formatDate(specie.lastObservation)}</span>
                                                </div>
                                            </div>

                                            {/* Tags mejorados */}
                                            <div className="space-y-2">
                                                {specie.detectionMethods && specie.detectionMethods.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {specie.detectionMethods.slice(0, 2).map((method, idx) => (
                                                            <span key={idx} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium truncate max-w-20">
                                                                {method}
                                                            </span>
                                                        ))}
                                                        {specie.detectionMethods.length > 2 && (
                                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                                +{specie.detectionMethods.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {specie.activities && specie.activities.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {specie.activities.slice(0, 2).map((activity, idx) => (
                                                            <span key={idx} className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-medium truncate max-w-20">
                                                                {activity}
                                                            </span>
                                                        ))}
                                                        {specie.activities.length > 2 && (
                                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                                +{specie.activities.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Paginación mejorada y responsiva */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center space-x-1 sm:space-x-2 px-4 sm:px-0">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border border-emerald-100/50 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation"
                                    >
                                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>

                                    <div className="flex space-x-1 overflow-x-auto max-w-xs sm:max-w-none">
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            let page;
                                            if (totalPages <= 5) {
                                                page = i + 1;
                                            } else if (currentPage <= 3) {
                                                page = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                page = totalPages - 4 + i;
                                            } else {
                                                page = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => goToPage(page)}
                                                    className={`px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm touch-manipulation ${currentPage === page
                                                        ? 'bg-emerald-600 text-white shadow-lg'
                                                        : 'bg-white/90 backdrop-blur-sm shadow-lg border border-emerald-100/50 text-emerald-600 hover:bg-emerald-50'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl border border-emerald-100/50 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation"
                                    >
                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 px-4">
                            <div className="bg-white/80 rounded-full p-6 w-20 h-20 mx-auto mb-4 shadow-lg">
                                <Bird className="w-8 h-8 text-emerald-300 mx-auto" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                                No se encontraron especies
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500">
                                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Aún no hay especies observadas registradas'}
                            </p>
                        </div>
                    )}

                </div>
            </div>
            {/* Modal de detalles */}
            <SpeciesDetailModal
                isOpen={isModalOpen}
                onClose={closeModal}
                species={selectedSpecies}
                formatDate={formatDate}
            />
        </>
    );
};

export default ObservedSpeciesPage;