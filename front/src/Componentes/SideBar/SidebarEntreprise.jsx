import { NavLink } from "react-router-dom";
import Icon, { Icons } from "../Icon";
import authService from "../../Services/authService";
import "../../Style/Entreprise/Sidebar.css"

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: "dashboard",
    path: "",
  },
  {
    id: "offres",
    label: "Mes offres",
    icon: "briefcase",
    path: "offres",
  },
  {
    id: "candidatures",
    label: "Candidatures reçues",
    icon: "file",
    path: "candidatures",
  },
  {
    id: "conventions",
    label: "Conventions",
    icon: "clipboard",
    path: "conventions",
  },
  {
    id: "stagiaires",
    label: "Suivi des stagiaires",
    icon: "users",
    path: "stagiaires",
  },
];

const NAV_FOOTER = [
  {
    id: "profil",
    label: "Profil",
    icon: "user",
    path: "profil",
  },
];

export default function SidebarEntreprise() {

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/";
  };

  return (
    <nav className="sidebar-entreprise">

      {/* HEADER */}
      <div>

        {/* LOGO */}
        <div className="sidebar-logo">

          <div className="brand-icon">
            <Icon d={Icons.briefcase} size={18} />
          </div>

          <div>
            <div className="brand-title">
              Stages
            </div>

            <div className="brand-sub">
              Portail des stages
            </div>
          </div>

        </div>

        {/* ENTREPRISE CARD */}
        <div className="company-card">


          <div>
            <div className="company-name">
              SmartTech Solutions
            </div>

            <div className="company-role">
              Entreprise
            </div>
          </div>

        </div>

        {/* NAVIGATION */}
        <div className="sidebar-nav">

          {NAV_ITEMS.map((item) => (

            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === ""}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >

              <Icon d={Icons[item.icon]} />

              {item.label}

            </NavLink>

          ))}

          {/* SECTION */}
          <div className="nav-section-label">
            Compte
          </div>

          {NAV_FOOTER.map((item) => (

            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >

              <Icon d={Icons[item.icon]} />

              {item.label}

            </NavLink>

          ))}

        </div>
      </div>

      {/* FOOTER */}
      <div className="sidebar-footer">

        <button
          className="nav-link logout-btn"
          onClick={handleLogout}
        >

          <Icon d={Icons.logout} />

          Déconnexion

        </button>

      </div>

    </nav>
  );
}