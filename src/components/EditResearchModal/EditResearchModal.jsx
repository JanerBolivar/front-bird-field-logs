import { useState, useEffect, useRef } from 'react';
import { X, Save, Trash2, Users } from 'lucide-react';
import axios from 'axios';

const EditResearchModal = ({ isOpen, onClose, research, token, onUpdate }) => {
    const modalRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        objectives: [],
        results: [],
        startDate: '',
        endDate: '',
        habitatType: '',
        dominantVegetation: '',
        height: 0,
        coordinates: { latitude: 0, longitude: 0 },
        locality: { name: '', village: '', neighborhood: '', city: '', state: '', country: '' },
        status: 'Ejecución'
    });
    const [newObjective, setNewObjective] = useState('');
    const [newResult, setNewResult] = useState('');
    const [leaderCedula, setLeaderCedula] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Inicializar el formulario con los datos de la investigación
    useEffect(() => {
        if (research && isOpen) {
            setFormData({
                name: research.name || '',
                description: research.description || '',
                objectives: research.objectives || [],
                results: research.results || [],
                startDate: research.startDate ? research.startDate.split('T')[0] : '',
                endDate: research.endDate ? research.endDate.split('T')[0] : '',
                habitatType: research.habitatType || '',
                dominantVegetation: research.dominantVegetation || '',
                height: research.height || 0,
                coordinates: research.coordinates || { latitude: 0, longitude: 0 },
                locality: research.locality || { name: '', village: '', neighborhood: '', city: '', state: '', country: '' },
                status: research.status || 'Ejecución'
            });
            setNewObjective('');
            setNewResult('');
            setLeaderCedula('');
            setError(null);
        }
    }, [research, isOpen]);

    // Manejar el cierre del modal con ESC y clic fuera
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                onClose();
            }
        };
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc, false);
            document.addEventListener('mousedown', handleOutsideClick, false);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc, false);
            document.removeEventListener('mousedown', handleOutsideClick, false);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Manejar cambios en los inputs
    const handleInputChange = (e, field, subField = null) => {
        if (subField) {
            setFormData(prev => ({
                ...prev,
                [field]: { ...prev[field], [subField]: e.target.value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: e.target.value }));
        }
    };

    // Agregar objetivo
    const addObjective = () => {
        if (newObjective.trim()) {
            setFormData(prev => ({
                ...prev,
                objectives: [...prev.objectives, newObjective.trim()]
            }));
            setNewObjective('');
        }
    };

    // Agregar resultado
    const addResult = () => {
        if (newResult.trim()) {
            setFormData(prev => ({
                ...prev,
                results: [...prev.results, newResult.trim()]
            }));
            setNewResult('');
        }
    };

    // Eliminar objetivo
    const removeObjective = (index) => {
        setFormData(prev => ({
            ...prev,
            objectives: prev.objectives.filter((_, i) => i !== index)
        }));
    };

    // Eliminar resultado
    const removeResult = (index) => {
        setFormData(prev => ({
            ...prev,
            results: prev.results.filter((_, i) => i !== index)
        }));
    };

    // Enviar actualización de la investigación
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await axios.patch(`/api/research/${research.uuid}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            onUpdate(formData);
            onClose();
        } catch (err) {
            setError('Error al actualizar la investigación. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    // Cambiar líder
    const handleChangeLeader = async () => {
        if (!leaderCedula.trim()) {
            setError('Por favor, ingresa un número de cédula válido.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await axios.patch(`/api/research/${research.uuid}/change-leader`, { cedula: leaderCedula }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            onUpdate({ ...formData, leader: { ...formData.leader, cedula: leaderCedula } });
            setLeaderCedula('');
        } catch (err) {
            setError('Error al cambiar el líder. Por favor, verifica el número de cédula.');
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar investigación (simulado)
    const handleDelete = () => {
        alert('Función de eliminación no disponible aún');
    };

    if (!isOpen || !research) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-green-900/20"></div>
            <div
                ref={modalRef}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-modal-appear p-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Editar Investigación</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre y Descripción */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange(e, 'name')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Estado</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleInputChange(e, 'status')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="Ejecución">Ejecución</option>
                                <option value="Finalizada">Finalizada</option>
                                <option value="Cancelada">Cancelada</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange(e, 'description')}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                            rows="4"
                        />
                    </div>

                    {/* Objetivos */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Objetivos</label>
                        <div className="flex gap-2 mt-1">
                            <input
                                type="text"
                                value={newObjective}
                                onChange={(e) => setNewObjective(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                placeholder="Nuevo objetivo"
                            />
                            <button
                                type="button"
                                onClick={addObjective}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                            >
                                Agregar
                            </button>
                        </div>
                        <div className="mt-2 space-y-2">
                            {formData.objectives.map((obj, index) => (
                                <div key={index} className="flex items-center justify-between bg-emerald-50 p-2 rounded-lg">
                                    <span className="Advice: text-gray-700">{obj}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeObjective(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resultados */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Resultados</label>
                        <div className="flex gap-2 mt-1">
                            <input
                                type="text"
                                value={newResult}
                                onChange={(e) => setNewResult(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                placeholder="Nuevo resultado"
                            />
                            <button
                                type="button"
                                onClick={addResult}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                            >
                                Agregar
                            </button>
                        </div>
                        <div className="mt-2 space-y-2">
                            {formData.results.map((res, index) => (
                                <div key={index} className="flex items-center justify-between bg-teal-50 p-2 rounded-lg">
                                    <span className="text-gray-700">{res}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeResult(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleInputChange(e, 'startDate')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => handleInputChange(e, 'endDate')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Hábitat */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo de Hábitat</label>
                            <input
                                type="text"
                                value={formData.habitatType}
                                onChange={(e) => handleInputChange(e, 'habitatType')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vegetación Dominante</label>
                            <input
                                type="text"
                                value={formData.dominantVegetation}
                                onChange={(e) => handleInputChange(e, 'dominantVegetation')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Altitud</label>
                            <input
                                type="number"
                                value={formData.height}
                                onChange={(e) => handleInputChange(e, 'height')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Coordenadas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Latitud</label>
                            <input
                                type="number"
                                value={formData.coordinates.latitude}
                                onChange={(e) => handleInputChange(e, 'coordinates', 'latitude')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                                step="0.000001"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Longitud</label>
                            <input
                                type="number"
                                value={formData.coordinates.longitude}
                                onChange={(e) => handleInputChange(e, 'coordinates', 'longitude')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                                step="0.000 IELD001"
                            />
                        </div>
                    </div>

                    {/* Localidad */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre de Localidad</label>
                            <input
                                type="text"
                                value={formData.locality.name}
                                onChange={(e) => handleInputChange(e, 'locality', 'name')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vereda</label>
                            <input
                                type="text"
                                value={formData.locality.village}
                                onChange={(e) => handleInputChange(e, 'locality', 'village')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Barrio</label>
                            <input
                                type="text"
                                value={formData.locality.neighborhood}
                                onChange={(e) => handleInputChange(e, 'locality', 'neighborhood')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                            <input
                                type="text"
                                value={formData.locality.city}
                                onChange={(e) => handleInputChange(e, 'locality', 'city')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Departamento</label>
                            <input
                                type="text"
                                value={formData.locality.state}
                                onChange={(e) => handleInputChange(e, 'locality', 'state')}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">País</label>
                            <input
                                type="text"
                                value={formData.locality.country}
                                onChange={(e) => handleInputChange(e, 'locality', 'country')}
                                className="mt-1 finali w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Cambiar Líder */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700">Cambiar Líder (Cédula)</label>
                        <div className="flex gap-2 mt-1">
                            <input
                                type="text"
                                value={leaderCedula}
                                onChange={(e) => setLeaderCedula(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                placeholder="Número de cédula"
                            />
                            <button
                                type="button"
                                onClick={handleChangeLeader}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                disabled={isLoading}
                            >
                                <Users className="w-4 h-4 inline mr-2" />
                                Cambiar
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 p-3 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center"
                            disabled={isLoading}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditResearchModal;