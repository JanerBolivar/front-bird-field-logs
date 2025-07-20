import { useEffect, useRef, useState } from 'react';
import {
    X,
    Eye,
    Camera,
    Calendar,
    BarChart3,
    MapPin,
    Activity,
    Layers,
    TreePine,
    ImageIcon,
    ChevronLeft,
    ChevronRight,
    Bird,
    Leaf,
    Search,
    Filter,
    Grid,
    List,
    Info,
    Clock,
    Target,
    Database
} from 'lucide-react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SpeciesDetailModal = ({ isOpen, onClose, species, formatDate }) => {
    const modalRef = useRef(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Configuración del carrusel para el modal
    const modalCarouselSettings = {
        dots: true,
        infinite: species?.images?.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        adaptiveHeight: true,
        autoplay: species?.images?.length > 1,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        dotsClass: "slick-dots slick-dots-custom"
    };

    // Componentes de flechas personalizadas
    function CustomPrevArrow(props) {
        const { onClick } = props;
        return (
            <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                onClick={onClick}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
        );
    }

    function CustomNextArrow(props) {
        const { onClick } = props;
        return (
            <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                onClick={onClick}
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        );
    }

    // Manejar el cierre del modal con ESC
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc, false);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc, false);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Manejar click fuera del modal
    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    // Reset tab when modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveTab('overview');
        }
    }, [isOpen]);

    if (!isOpen || !species) return null;

    const tabs = [
        { id: 'overview', label: 'Resumen', icon: Info },
        { id: 'observations', label: 'Observaciones', icon: Eye },
        { id: 'gallery', label: 'Galería', icon: Camera },
        { id: 'details', label: 'Detalles', icon: Database }
    ];

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
            onClick={handleOutsideClick}
        >
            {/* Overlay animado */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-green-900/20"></div>

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-modal-appear flex flex-col"
            >
                {/* Header del modal */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center z-20">
                    <div className="flex-1 pr-4">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="bg-emerald-100 p-2 rounded-full">
                                <Bird className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                {species.totalAbundance} individuos
                            </div>
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 italic line-clamp-2">
                            {species.species}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {species.totalObservations} observaciones • {species.images?.length || 0} imágenes
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="sticky top-[72px] bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 z-10">
                    <div className="flex space-x-1 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${activeTab === tab.id
                                        ? 'text-emerald-600 border-emerald-600 bg-emerald-50/50'
                                        : 'text-gray-600 border-transparent hover:text-emerald-600 hover:bg-emerald-50/30'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Contenido del modal */}
                <div className="overflow-y-auto flex-1 pb-6">
                    {/* Tab: Resumen */}
                    {activeTab === 'overview' && (
                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Imagen principal */}
                                <div className="space-y-4">
                                    <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                                        {species.images && species.images.length > 0 ? (
                                            species.images.length === 1 ? (
                                                <img
                                                    src={species.images[0]}
                                                    alt={species.species}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : (
                                                <Slider {...modalCarouselSettings}>
                                                    {species.images.map((image, index) => (
                                                        <div key={index} className="h-64 sm:h-80">
                                                            <img
                                                                src={image}
                                                                alt={`${species.species} - ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </Slider>
                                            )
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-center">
                                                    <div className="bg-white/80 rounded-full p-6 mb-3 shadow-lg">
                                                        <ImageIcon className="w-16 h-16 text-emerald-400 mx-auto" />
                                                    </div>
                                                    <p className="text-emerald-600 font-medium">Sin imagen disponible</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stats rápidas */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <BarChart3 className="w-5 h-5 text-emerald-600" />
                                                <span className="text-sm font-medium text-emerald-700">Abundancia Total</span>
                                            </div>
                                            <p className="text-2xl font-bold text-emerald-800">{species.totalAbundance}</p>
                                        </div>
                                        <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Eye className="w-5 h-5 text-teal-600" />
                                                <span className="text-sm font-medium text-teal-700">Observaciones</span>
                                            </div>
                                            <p className="text-2xl font-bold text-teal-800">{species.totalObservations}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Información general */}
                                <div className="space-y-6">
                                    {/* Fechas */}
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                            <Calendar className="w-5 h-5 text-gray-600" />
                                            <span>Período de Observación</span>
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Primera observación:</span>
                                                <span className="font-medium text-gray-800">{formatDate(species.firstObservation)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Última observación:</span>
                                                <span className="font-medium text-gray-800">{formatDate(species.lastObservation)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Métodos de detección */}
                                    {species.detectionMethods && species.detectionMethods.length > 0 && (
                                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                            <h3 className="text-lg font-semibold text-emerald-800 mb-3 flex items-center space-x-2">
                                                <Target className="w-5 h-5 text-emerald-600" />
                                                <span>Métodos de Detección</span>
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {species.detectionMethods.map((method, index) => (
                                                    <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                                        {method}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actividades */}
                                    {species.activities && species.activities.length > 0 && (
                                        <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                                            <h3 className="text-lg font-semibold text-teal-800 mb-3 flex items-center space-x-2">
                                                <Activity className="w-5 h-5 text-teal-600" />
                                                <span>Actividades Observadas</span>
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {species.activities.map((activity, index) => (
                                                    <span key={index} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                                                        {activity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Hábitat */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {species.substrates && species.substrates.length > 0 && (
                                            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                                <h4 className="font-semibold text-green-800 mb-2 flex items-center space-x-2">
                                                    <TreePine className="w-4 h-4 text-green-600" />
                                                    <span>Sustratos</span>
                                                </h4>
                                                <div className="space-y-1">
                                                    {species.substrates.map((substrate, index) => (
                                                        <span key={index} className="block text-sm text-green-700">
                                                            • {substrate}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {species.stratums && species.stratums.length > 0 && (
                                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                                <h4 className="font-semibold text-amber-800 mb-2 flex items-center space-x-2">
                                                    <Layers className="w-4 h-4 text-amber-600" />
                                                    <span>Estratos</span>
                                                </h4>
                                                <div className="space-y-1">
                                                    {species.stratums.map((stratum, index) => (
                                                        <span key={index} className="block text-sm text-amber-700">
                                                            • {stratum}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Observaciones */}
                    {activeTab === 'observations' && (
                        <div className="p-4 sm:p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Registro de Observaciones</h3>
                                <p className="text-gray-600">
                                    Detalles de las {species.samples?.length || 0} muestras registradas para esta especie
                                </p>
                            </div>

                            {species.samples && species.samples.length > 0 ? (
                                <div className="space-y-4">
                                    {species.samples.map((sample, index) => (
                                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <Calendar className="w-4 h-4 text-emerald-600" />
                                                        <span className="text-sm font-medium text-gray-700">Fecha</span>
                                                    </div>
                                                    <p className="text-gray-800">{formatDate(sample.date)}</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <BarChart3 className="w-4 h-4 text-teal-600" />
                                                        <span className="text-sm font-medium text-gray-700">Abundancia</span>
                                                    </div>
                                                    <p className="text-gray-800 font-semibold">{sample.abundance}</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <Search className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm font-medium text-gray-700">Investigación</span>
                                                    </div>
                                                    <p className="text-gray-800 text-sm line-clamp-2">{sample.researchName}</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <MapPin className="w-4 h-4 text-purple-600" />
                                                        <span className="text-sm font-medium text-gray-700">Punto</span>
                                                    </div>
                                                    <p className="text-gray-800 text-sm font-mono">{sample.samplingPointId.slice(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4">
                                        <Eye className="w-8 h-8 text-gray-400 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin observaciones detalladas</h3>
                                    <p className="text-gray-500">No hay datos de muestras disponibles para esta especie</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Galería */}
                    {activeTab === 'gallery' && (
                        <div className="p-4 sm:p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Galería de Imágenes</h3>
                                <p className="text-gray-600">
                                    {species.images?.length || 0} imágenes disponibles de {species.species}
                                </p>
                            </div>

                            {species.images && species.images.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {species.images.map((image, index) => (
                                        <div key={index} className="group relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100 hover:shadow-xl transition-all duration-300">
                                            <img
                                                src={image}
                                                alt={`${species.species} - Imagen ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="bg-white/90 rounded-full p-2">
                                                    <Camera className="w-5 h-5 text-gray-700" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                                                {index + 1}/{species.images.length}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4">
                                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin imágenes disponibles</h3>
                                    <p className="text-gray-500">No hay imágenes registradas para esta especie</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Detalles */}
                    {activeTab === 'details' && (
                        <div className="p-4 sm:p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Información Detallada</h3>
                                <p className="text-gray-600">Datos técnicos y estadísticas completas</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Estadísticas */}
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100">
                                    <h4 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center space-x-2">
                                        <BarChart3 className="w-5 h-5" />
                                        <span>Estadísticas</span>
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-emerald-200/50">
                                            <span className="text-emerald-700">Abundancia total:</span>
                                            <span className="font-bold text-emerald-800">{species.totalAbundance}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-emerald-200/50">
                                            <span className="text-emerald-700">Total observaciones:</span>
                                            <span className="font-bold text-emerald-800">{species.totalObservations}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-emerald-200/50">
                                            <span className="text-emerald-700">Investigaciones:</span>
                                            <span className="font-bold text-emerald-800">{species.researchCount}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-emerald-700">Imágenes:</span>
                                            <span className="font-bold text-emerald-800">{species.images?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Información técnica */}
                                <div className="space-y-4">
                                    {/* IDs de investigación */}
                                    {species.researchList && species.researchList.length > 0 && (
                                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                                <Database className="w-4 h-4 text-gray-600" />
                                                <span>IDs de Investigación</span>
                                            </h4>
                                            <div className="space-y-2">
                                                {species.researchList.map((researchId, index) => (
                                                    <div key={index} className="bg-gray-50 p-2 rounded font-mono text-sm text-gray-700">
                                                        {researchId}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Resumen de comportamiento */}
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <h4 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                                            <Activity className="w-4 h-4 text-blue-600" />
                                            <span>Resumen de Comportamiento</span>
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <span className="text-blue-700 font-medium">Métodos de detección únicos: </span>
                                                <span className="text-blue-800">{species.detectionMethods?.length || 0}</span>
                                            </div>
                                            <div>
                                                <span className="text-blue-700 font-medium">Actividades registradas: </span>
                                                <span className="text-blue-800">{species.activities?.length || 0}</span>
                                            </div>
                                            <div>
                                                <span className="text-blue-700 font-medium">Sustratos utilizados: </span>
                                                <span className="text-blue-800">{species.substrates?.length || 0}</span>
                                            </div>
                                            <div>
                                                <span className="text-blue-700 font-medium">Estratos ocupados: </span>
                                                <span className="text-blue-800">{species.stratums?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Línea de tiempo */}
                            <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-gray-600" />
                                    <span>Línea de Tiempo</span>
                                </h4>
                                <div className="flex items-center justify-between">
                                    <div className="text-center">
                                        <div className="w-4 h-4 bg-emerald-500 rounded-full mx-auto mb-2"></div>
                                        <p className="text-xs text-gray-600">Primera observación</p>
                                        <p className="text-sm font-medium text-gray-800">{formatDate(species.firstObservation)}</p>
                                    </div>
                                    <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 mx-4"></div>
                                    <div className="text-center">
                                        <div className="w-4 h-4 bg-teal-500 rounded-full mx-auto mb-2"></div>
                                        <p className="text-xs text-gray-600">Última observación</p>
                                        <p className="text-sm font-medium text-gray-800">{formatDate(species.lastObservation)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpeciesDetailModal;