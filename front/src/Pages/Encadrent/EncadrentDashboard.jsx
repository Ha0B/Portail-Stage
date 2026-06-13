import React, { useEffect, useState } from "react";
import { 
  FaUsers, 
  FaFileSignature, 
  FaCalendarCheck, 
  FaPenFancy, 
  FaChalkboard,    
  FaFileAlt        
} from "react-icons/fa";
import "../../Style/Encadrant/EncadrantDashboard.css";
import authService from "../../Services/authService";
import etudiantService from "../../Services/etudiantService";
import rapportService from "../../Services/rapportService";
import soutenanceService from "../../Services/soutenanceService";
import noteService from "../../Services/noteService";

const EncadrantDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    etudiants: 0,
    rapports: 0,
    soutenances: 0,
    notes: 0,
  });
  const [prochainesSoutenances, setProchainesSoutenances] = useState([]);
  const [rapportsRecents, setRapportsRecents] = useState([]);
  const [notesASaisir, setNotesASaisir] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);

      // Fetch étudiants encadrés
      const etudiants = await etudiantService.getAll();
      const mesEtudiants = etudiants.filter(
        (etudiant) => etudiant.encadrant?.id === currentUser?.id
      );

      // Fetch rapports
      const rapports = await rapportService.getAll();
      const mesRapports = rapports.filter(
        (rapport) => rapport.etudiant?.encadrant?.id === currentUser?.id
      );
      const rapportsAValider = mesRapports.filter(
        (r) => r.statut === "EN_ATTENTE" || r.statut === "SOUMIS"
      );

      // Fetch soutenances
      const soutenances = await soutenanceService.getAll();
      const mesSoutenances = soutenances.filter(
        (soutenance) => soutenance.jury?.some((j) => j.id === currentUser?.id)
      );

      // Fetch notes
      const notes = await noteService.getAll();
      const mesNotes = notes.filter(
        (note) => note.encadrant?.id === currentUser?.id
      );

      setStats({
        etudiants: mesEtudiants.length,
        rapports: rapportsAValider.length,
        soutenances: mesSoutenances.filter((s) => new Date(s.date) > new Date()).length,
        notes: mesNotes.length,
      });

      setProchainesSoutenances(mesSoutenances.slice(0, 3));
      setRapportsRecents(mesRapports.slice(0, 4));
      setNotesASaisir(mesNotes.slice(0, 3));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-encadrant">
        <div style={{ textAlign: "center", padding: "40px" }}>
          Chargement des données...
        </div>
      </div>
    );
  }

  const displayName = user?.prenom && user?.nom 
    ? `${user.prenom} ${user.nom}` 
    : user?.nom || "Encadrant";

  const statItems = [
    { id: 1, value: stats.etudiants, label: "Étudiants encadrés", icon: <FaUsers />, color: "#2c7da0" },
    { id: 2, value: stats.rapports, label: "Rapports à valider", icon: <FaFileSignature />, color: "#e67e22" },
    { id: 3, value: stats.soutenances, label: "Soutenances à venir", icon: <FaCalendarCheck />, color: "#27ae60" },
    { id: 4, value: stats.notes, label: "Notes à saisir", icon: <FaPenFancy />, color: "#8e44ad" },
  ];

  return (
    <div className="dashboard-encadrant">
      {/* Bienvenue */}
      <div className="welcome-card">
        <h2>Bienvenue {displayName} !</h2>
        <p>Suivez vos étudiants, validez les rapports et gérez les soutenances depuis ce tableau de bord.</p>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        {statItems.map((stat) => (
          <div className="stat-card" key={stat.id}>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
            <div className="stat-icon" style={{ color: stat.color, backgroundColor: `${stat.color}10` }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Deux colonnes */}
      <div className="dashboard-columns">
        {/* Prochaines soutenances */}
        <div className="panel">
          <div className="panel-header">
            <FaChalkboard className="panel-icon" />
            <h3>Prochaines soutenances</h3>
          </div>
          {prochainesSoutenances.length > 0 ? (
            prochainesSoutenances.map((sout) => (
              <div className="soutenance-item" key={sout.id}>
                <div className="soutenance-left">
                  <div className="date-badge">
                    <span className="day">{new Date(sout.date).getDate()}</span>
                    <span className="month">{new Date(sout.date).toLocaleString('fr-FR', { month: 'short' }).toUpperCase()}</span>
                  </div>
                  <div className="soutenance-details">
                    <h4>{sout.etudiant?.nom || "N/A"}</h4>
                    <p>{sout.heure || "N/A"} - {sout.salle || "N/A"} | Jury : {sout.jury?.length || 0} membres</p>
                  </div>
                </div>
                <button className="btn-detail">Détails</button>
              </div>
            ))
          ) : (
            <p style={{ padding: "16px 24px" }}>Aucune soutenance à venir</p>
          )}
        </div>

        {/* Rapports récents */}
        <div className="panel">
          <div className="panel-header">
            <FaFileAlt className="panel-icon" />
            <h3>Rapports récents</h3>
          </div>
          {rapportsRecents.length > 0 ? (
            rapportsRecents.map((rapport) => (
              <div className="rapport-item" key={rapport.id}>
                <div className="rapport-info">
                  <strong>{rapport.etudiant?.nom || "N/A"} - {rapport.titre || "Rapport"}</strong>
                  <span>Soumis le {rapport.dateCreation ? new Date(rapport.dateCreation).toLocaleDateString('fr-FR') : "N/A"}</span>
                </div>
                <span className={`badge-status ${rapport.statut === "VALIDE" ? "badge-success" : "badge-warning"}`}>
                  {rapport.statut || "EN_ATTENTE"}
                </span>
              </div>
            ))
          ) : (
            <p style={{ padding: "16px 24px" }}>Aucun rapport</p>
          )}
        </div>
      </div>

      {/* Notes à saisir */}
      <div className="notes-panel">
        <div className="panel">
          <div className="panel-header">
            <FaPenFancy className="panel-icon" />
            <h3>Notes à saisir</h3>
          </div>
          {notesASaisir.length > 0 ? (
            notesASaisir.map((note) => (
              <div className="note-item" key={note.id}>
                <div className="note-info">
                  <h4>{note.etudiant?.nom || "N/A"}</h4>
                  <p>{note.etudiant?.projet || "N/A"}</p>
                </div>
                <span className="note-rubrics">{note.rubrique || "0"} rubriques</span>
              </div>
            ))
          ) : (
            <p style={{ padding: "16px 24px" }}>Aucune note à saisir</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EncadrantDashboard;