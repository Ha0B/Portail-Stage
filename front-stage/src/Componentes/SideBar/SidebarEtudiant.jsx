import { NavLink } from "react-router-dom";
import Icon, { Icons } from "../Icon";
import authService from "../../Services/authService";
import "../../Style/Etudiant/Sidebar.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Tableau de bord", icon: "dashboard", path: "" },
  { id: "offres", label: "Offres de stage", icon: "search", path: "offres" },
  { id: "candidatures", label: "Mes candidatures", icon: "send", path: "candidatures" },
  { id: "conventions", label: "Mes conventions", icon: "file", path: "conventions" },
  { id: "suivi", label: "Suivi de stage", icon: "clipboard", path: "mesStages" },
  { id: "soutenances", label: "Soutenances", icon: "mic", path: "soutenances" },
  { id: "notes", label: "Mes notes", icon: "chart", path: "notes" },
];

const NAV_FOOTER = [
  { id: "profil", label: "Profil", icon: "user", path: "profil" },
];

export default function SidebarEtudiant() {
  const handleLogout = () => {
    authService.logout();
    window.location.href = "/";
  };

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

        {/* FOOTER MENU */}
        <div className="nav-section-label" style={{ marginTop: 24 }}>Compte</div>
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

      {/* LOGOUT */}
      <div className="sidebar-footer">
        <button className="nav-link" onClick={handleLogout}>
          <Icon d={Icons.logout} />
          Déconnexion
        </button>
      </div>
    </nav>
  );
}