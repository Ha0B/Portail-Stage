import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarEtudiant from '../Componentes/SideBar/SidebarEtudiant';
import '../Style/Etudiant/Layout.css';

export default function EtudiantLayout() {
  return (
    <div className="layout-wrapper">
      {/* La Sidebar reste fixe à gauche */}
      <SidebarEtudiant />
      
      {/* Le conteneur principal qui change selon l'URL */}
      <main className="layout-main-content">
        <Outlet />
      </main>
    </div>
  );
}