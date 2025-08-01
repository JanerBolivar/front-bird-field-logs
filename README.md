# Amazon Birds Research - Frontend

Plataforma web para la gestión y monitoreo de investigaciones ornitológicas en la región amazónica colombiana. Desarrollada con **React** y **Vite**, utiliza TailwindCSS para estilos y varias librerías modernas para mapas, iconos y navegación.

## Características

- Gestión de investigaciones y especies observadas
- Visualización de mapas interactivos con Leaflet
- Interfaz moderna y responsiva con TailwindCSS
- Autenticación y control de acceso
- Animaciones e iconografía amazónica

## Estructura del proyecto

```
.env
.gitignore
eslint.config.js
index.html
package.json
pnpm-lock.yaml
README.md
vite.config.js
public/
  vite.svg
src/
  App.jsx
  index.css
  main.jsx
  assets/
    react.svg
  components/
    EditResearchModal/
      EditResearchModal.jsx
    Sidebar/
      Sidebar.jsx
    SpeciesDetailModal/
      SpeciesDetailModal.jsx
  config/
    envs.js
  contexts/
    AuthContext.jsx
    useAuth.js
  pages/
    HomePage/
    LoginPage/
    ObservedSpeciesPage/
    ResearchDetailPage/
    ResearchListPage/
    SamplingPointDetailPage/
```

## Tecnologías principales

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/)
- [React Router DOM](https://reactrouter.com/)
- [React Helmet Async](https://github.com/staylor/react-helmet-async)
- [React Leaflet](https://react-leaflet.js.org/)
- [Axios](https://axios-http.com/)

## Instalación

1. Clona el repositorio:
   ```sh
   git clone https://github.com/tu-usuario/front-bird-field-logs.git
   cd front-bird-field-logs
   ```

2. Instala las dependencias:
   ```sh
   pnpm install
   # o npm install
   ```

3. Configura las variables de entorno en `.env` si es necesario.

## Scripts disponibles

- `pnpm dev` — Inicia el servidor de desarrollo
- `pnpm build` — Compila la aplicación para producción
- `pnpm preview` — Previsualiza la build de producción
- `pnpm lint` — Ejecuta ESLint

## Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

##