import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './Componentes/NavBar';

import Connection from './Pages/Authentification/Connection';
import Inscription from './Pages/Authentification/Inscription';
import Accueil from './Componentes/Accueil';

import EntrepriseApp from './Routes/EntrepriseApp';
import EtudiantApp from './Routes/EtudiantApp';
import AdminApp from './Routes/AdminApp';
import EncadrantApp from './Routes/EncadrantApp';

function App() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/etudiant",
    "/entreprise",
    "/admin",
    "/encadrant"
  ];

  const hideNavbar = hideNavbarRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="App">
      {!hideNavbar && <NavBar />}

      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Accueil />} />
        <Route path="/connection" element={<Connection />} />
        <Route path="/inscription" element={<Inscription />} />

        <Route path="/entreprise/*" element={<EntrepriseApp />} />
        <Route path="/etudiant/*" element={<EtudiantApp />} />
         <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/encadrant/*" element={<EncadrantApp />} />
      </Routes>
    </div>
  );
}

export default App;