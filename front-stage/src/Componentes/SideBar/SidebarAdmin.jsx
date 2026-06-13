// Sidebar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../Style/Admin/Sidebar.css";
import Icon, {Icons} from "../Icon";
import authService from "../../Services/authService";

// Définition des items avec un sous-menu pour "Utilisateur"
const NAV_ITEMS = [
    { id: "dashboard", icon: "bi-grid-1x2-fill", label: "Tableau de bord", path: "." },
    {
        id: "utilisateur",
        icon: "bi-people-fill",
        label: "Utilisateur",
        subItems: [
            { id: "etudiants", label: "Étudiants", path: "etudiants" },
            { id: "entreprises", label: "Entreprises", path: "entreprises" },
            { id: "encadrants", label: "Encadrants", path: "encadrants" },
            { id: "admins", label: "Administrateurs", path: "admins" },
        ],
    },
    { id: "offres", icon: "bi-briefcase-fill", label: "Offres", path: "offres" },
    { id: "stages", icon: "bi-briefcase-fill", label: "Stages", path: "stages" },
    { id: "conventions", icon: "bi-file-earmark-text-fill", label: "Conventions", path: "conventions" },
    { id: "soutenances", icon: "bi-easel-fill", label: "Soutenances", path: "soutenances" },
    { id: "rubrique", icon: "bi-star-fill", label: "Rubrique", path: "rubriques" },
    { id: "exports", icon: "bi-download", label: "Exports", path: "exports" },
    // { id: "audit", icon: "bi-journal-text", label: "Journaux d'audit", path: "audit" },
];

const handleLogout = () => {
    authService.logout();
    window.location.href = "/";
};

export default function Sidebar() {
    // État qui garde en mémoire quel sous-menu est ouvert (par id)
    const [openSubmenus, setOpenSubmenus] = useState({});

    const toggleSubmenu = (id) => {
        setOpenSubmenus((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <aside className="sidebar">
            {/* Brand */}
            <div className="sidebar-brand">
                <div className="sidebar-brand__icon">
                    <span>S</span>
                </div>
                <div>
                    <div className="sidebar-brand__name">Stages</div>
                    <div className="sidebar-brand__sub">Portail des stages</div>
                </div>
            </div>

            {/* User info */}
            <div className="sidebar-user">
                <div className="sidebar-user__avatar">
                    <i className="bi bi-person-fill" />
                </div>
                <div>
                    <div className="sidebar-user__name">Admin</div>
                    <div className="sidebar-user__role">Administrateur</div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {NAV_ITEMS.map((item) => {
                    // Si l'item a un sous-menu
                    if (item.subItems) {
                        const isOpen = openSubmenus[item.id] || false;
                        return (
                            <div key={item.id} className="sidebar-nav__item">
                                <button
                                    className="sidebar-nav__link sidebar-nav__link--parent"
                                    onClick={() => toggleSubmenu(item.id)}
                                    aria-expanded={isOpen}
                                >
                                    <i className={`bi ${item.icon} sidebar-nav__icon`} />
                                    {item.label}
                                    <i
                                        className={`bi bi-chevron-down sidebar-nav__arrow ${
                                            isOpen ? "sidebar-nav__arrow--open" : ""
                                        }`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="sidebar-nav__submenu">
                                        {item.subItems.map((sub) => (
                                            <NavLink
                                                key={sub.id}
                                                to={sub.path}
                                                className={({ isActive }) =>
                                                    `sidebar-nav__link sidebar-nav__sublink ${
                                                        isActive ? "sidebar-nav__link--active" : ""
                                                    }`
                                                }
                                                end
                                            >
                                                {sub.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // Item normal
                    return (
                        <div key={item.id} className="sidebar-nav__item">
                            <NavLink
                                to={item.path}
                                end={item.path === "."}
                                className={({ isActive }) =>
                                    `sidebar-nav__link ${isActive ? "sidebar-nav__link--active" : ""}`
                                }
                            >
                                <i className={`bi ${item.icon} sidebar-nav__icon`} />
                                {item.label}
                            </NavLink>
                        </div>
                    );
                })}

                {/* Logout – reste un bouton car ce n'est pas une navigation */}
                <div className="sidebar-nav__item sidebar-nav__item--logout">
                    <button
                        className="nav-link logout-btn"
                        onClick={handleLogout}
                    >

                        <Icon d={Icons.logout} />

                        Déconnexion

                    </button>
                </div>
            </nav>
        </aside>
    );
}