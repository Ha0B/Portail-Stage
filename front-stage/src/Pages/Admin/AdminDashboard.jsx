import '../../Style/Admin/Dashboard.css'
const STATS = [
  {
    icon: "bi-mortarboard-fill",
    value: 124,
    label: "Étudiants",
    color: "#d4691e",
    bg: "#fff3e8",
  },
  {
    icon: "bi-building",
    value: 28,
    label: "Entreprises",
    color: "#4a7de8",
    bg: "#e8f0ff",
  },
  {
    icon: "bi-briefcase-fill",
    value: 56,
    label: "Offres",
    color: "#2baa6a",
    bg: "#e8fff3",
  },
  {
    icon: "bi-file-earmark-check-fill",
    value: 34,
    label: "Conventions signées",
    color: "#8a4ad4",
    bg: "#f0e8ff",
  },
];

const ACTIVITIES = [
  {
    icon: "bi-briefcase-fill",
    bg: "#fff3e8",
    color: "#d4691e",
    title: "Nouvelle offre publiée",
    sub: "SmartTech Solutions",
    date: "16/05/2025 10:30",
  },
  {
    icon: "bi-person-fill",
    bg: "#e8f0ff",
    color: "#4a7de8",
    title: "Candidature reçue",
    sub: "Hassan Berra",
    date: "16/05/2025 09:15",
  },
  {
    icon: "bi-file-earmark-text-fill",
    bg: "#e8fff3",
    color: "#2baa6a",
    title: "Convention signée",
    sub: "Imane Zouiri",
    date: "15/05/2025 14:20",
  },
  {
    icon: "bi-pencil-fill",
    bg: "#fff8e8",
    color: "#d4aa1e",
    title: "Note saisie",
    sub: "Omar Lachhab",
    date: "15/05/2025 11:05",
  },
];

const EXPORTS = [
  { label: "Candidatures (Excel)", icon: "bi-file-earmark-excel-fill" },
  { label: "Soutenances (Excel)",  icon: "bi-file-earmark-excel-fill" },
  { label: "Notes (Excel)",        icon: "bi-file-earmark-excel-fill" },
  { label: "Conventions (Excel)",  icon: "bi-file-earmark-excel-fill" },
];

const ACTIONS = [
  { label: "Ajouter un utilisateur",  icon: "bi-person-plus-fill",    bg: "#d4691e" },
  { label: "Créer une offre",          icon: "bi-plus-circle-fill",    bg: "#4a7de8" },
  { label: "Planifier une soutenance", icon: "bi-calendar-plus-fill",  bg: "#2baa6a" },
];

/* ── Sub-components ─────────────────────────────────────── */

function StatCard({ icon, value, label, color, bg }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon" style={{ background: bg, color }}>
        <i className={`bi ${icon}`} />
      </div>
      <div>
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__label">{label}</div>
      </div>
    </div>
  );
}

function ActivityItem({ icon, bg, color, title, sub, date }) {
  return (
    <div className="activity-item">
      <div
        className="activity-item__icon"
        style={{ background: bg, color }}
      >
        <i className={`bi ${icon}`} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="activity-item__title">{title}</div>
        <div className="activity-item__sub">{sub}</div>
      </div>
      <div className="activity-item__date">{date}</div>
    </div>
  );
}


export default function AdminDashboard() {
  return (
    <div className="dashboard-wrapper">

      {/* ── Topbar ── */}
      <header className="topbar">
        <div>
          <div className="topbar__title">Tableau de bord</div>
          <div className="topbar__sub">Bienvenue Administrateur !</div>
        </div>
        <div className="topbar__actions">
          <span className="topbar__flag">🇫🇷 FR</span>
          <button className="topbar__icon-btn" aria-label="Notifications">
            <i className="bi bi-bell" />
          </button>
          <div className="topbar__avatar" aria-label="Profil">
            <i className="bi bi-person-fill" />
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="dashboard-content">

        {/* Stat Cards */}
        <div className="stat-grid">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Activités récentes */}
        <div className="middle-row">
          <div className="section-card" style={{ flex: 1 }}>
            <h6 className="section-card__title">Activités récentes</h6>
            <div className="activity-list">
              {ACTIVITIES.map((a) => (
                <ActivityItem key={a.title} {...a} />
              ))}
            </div>
          </div>
        </div>

        {/* Exports + Actions */}
        <div className="bottom-row">

          {/* Exports rapides */}
          <div className="section-card" style={{ flex: 1 }}>
            <h6 className="section-card__title">Exports rapides</h6>
            <div className="export-grid">
              {EXPORTS.map((e) => (
                <button key={e.label} className="export-btn">
                  <i className={`bi ${e.icon}`} />
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="section-card" style={{ flex: 1 }}>
            <h6 className="section-card__title">Actions rapides</h6>
            <div className="action-grid">
              {ACTIONS.map((a) => (
                <button
                  key={a.label}
                  className="action-btn"
                  style={{ background: a.bg }}
                >
                  <i className={`bi ${a.icon}`} />
                  {a.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}