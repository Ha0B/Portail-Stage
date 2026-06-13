import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Icon, { Icons } from "../Icon"; 
import authService from "../../Services/authService";
import "../../Style/Encadrant/SideBar.css"; 

const NAV_ITEMS = [
  { id: "dashboard"     , label: "Tableau de bord"      , icon: "dashboard" , path: "" },
  { id: "etudiants"     , label: "Mes étudiants"        , icon: "users"     , path: "etudiants" },
  // { id: "suivi", label: "Suivi de stage", icon: "clipboard", path: "suivi" },
  { id: "soutenances"   , label: "Planning Soutenances" , icon: "mic"       , path: "soutenances" },
  { id: "notation"      , label: "Notation"             , icon: "edit"      , path: "monPlanning" },
  { id: "rapports"      , label: "Rapports"             , icon: "file"      , path: "rapports" },
];

const NAV_FOOTER = [
  { id: "profil"        , label: "Profil"               , icon: "user"      , path: "profil" },
];

export default function SidebarEncadrant() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/";
  };

  const displayName = user?.prenom && user?.nom 
    ? `${user.prenom} ${user.nom}` 
    : user?.nom || "Utilisateur";

  return (
    <nav className="sidebar">
      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="brand-icon">
          <Icon d={Icons.briefcase} size={18} />
        </div>
        <div>
          <div className="brand-title">Stages</div>
          <div className="brand-sub">Portail des stages</div>
        </div>
      </div>

      {/* ZONE UTILISATEUR DYNAMIQUE */}
      <div className="user-info-box">
        <div className="user-name">{displayName}</div>
        <div className="user-role">Encadrant</div>
      </div>

      {/* MENU PRINCIPAL */}
      <div className="sidebar-nav">
        <div className="nav-section-label">Menu</div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === ""}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Icon d={Icons[item.icon]} />
            {item.label}
          </NavLink>
        ))}

        {/* SECTION COMPTE */}
        <div className="nav-section-label" style={{ marginTop: 24 }}>
          Compte
        </div>
        {NAV_FOOTER.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Icon d={Icons[item.icon]} />
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* BOUTON DÉCONNEXION */}
      <div className="sidebar-footer">
        <button className="nav-link" onClick={handleLogout}>
          <Icon d={Icons.logout} />
          Déconnexion
        </button>
      </div>
    </nav>
  );
}