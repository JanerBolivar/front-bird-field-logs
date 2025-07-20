import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const updateUser = (updatedUser) => {
        // Obtener las credenciales actuales del localStorage
        const storedCredentials = localStorage.getItem('credentials_bird-field-logs');

        if (storedCredentials) {
            const credentials = JSON.parse(storedCredentials);

            // Actualizar las credenciales con el nuevo usuario
            const updatedCredentials = {
                ...credentials,
                user: updatedUser
            };

            // Guardar en el estado y en localStorage
            setUser(updatedUser);
            localStorage.setItem('credentials_bird-field-logs', JSON.stringify(updatedCredentials));
        }
    };

    // Función de inicio de sesión que recibe los datos y la fecha de expiración desde el backend
    const login = (user, token, expirationDate) => {
        // Guarda toda la información en localStorage
        const credentials = {
            user,
            token,
            expirationDate
        };
        localStorage.setItem('credentials_bird-field-logs', JSON.stringify(credentials));

        // ✅ Establecer todos los estados necesarios
        setUser(user);
        setToken(token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('credentials_bird-field-logs');
    };

    // Función para verificar si el token ha expirado
    const isTokenExpired = (expirationDate) => {
        return Date.now() > expirationDate;
    };

    // Función para autenticar al usuario verificando el token en localStorage
    const authenticateUser = () => {
        const storedCredentials = localStorage.getItem('credentials_bird-field-logs');

        if (!storedCredentials) {
            setIsLoading(false);
            return;
        }

        const { user, token, expirationDate } = JSON.parse(storedCredentials);

        // Verificar si el token ha expirado
        if (isTokenExpired(expirationDate)) {
            logout();
        } else {
            // Si el token es válido, establecer los estados
            setUser(user);
            setToken(token);
            setIsAuthenticated(true);
        }

        setIsLoading(false);
    };

    // Ejecuta la autenticación al montar el componente
    useEffect(() => {
        authenticateUser();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            isLoading,
            login,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };