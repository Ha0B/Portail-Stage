import { useState } from "react";
import "../../Style/Etudiant/Dashboard.css";
import Icon, { Icons } from "../../Componentes/Icon";

export default function EtudiantDashboard() {
  const [stats] = useState({
    offresConsultees: 0,
    candidatures: 3,
    conventions: 0,
    soutenances: 0,
  });

  const [offres] = useState([
    { id: 1, titre: "Stage Développeur Full Stack Java/Angular" },
    { id: 2, titre: "Stage Marketing Digital & Réseaux Sociaux" },
    { id: 3, titre: "Stage Data Analyst (Python/SQL)" },
  ]);

  const [candidatures] = useState([
    { id: 1, statut: "EN_ATTENTE" },
    { id: 2, statut: "EN_ATTENTE" },
    { id: 3, statut: "EN_ATTENTE" },
  ]);


  return (
    <div className="dashboard-content fade-up">
      
      {/* LIGNE 1 : STATISTIQUES */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-icon blue"><Icon d={Icons.eye} size={20} /></div>
          <div className="stat-info">
            <div className="stat-num">{stats.offresConsultees}</div>
            <div className="stat-lbl">Offres consultées</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green"><Icon d={Icons.send} size={20} /></div>
          <div className="stat-info">
            <div className="stat-num">{stats.candidatures}</div>
            <div className="stat-lbl">Candidatures</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange"><Icon d={Icons.file} size={20} /></div>
          <div className="stat-info">
            <div className="stat-num">{stats.conventions}</div>
            <div className="stat-lbl">Conventions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple"><Icon d={Icons.mic} size={20} /></div>
          <div className="stat-info">
            <div className="stat-num">{stats.soutenances}</div>
            <div className="stat-lbl">Soutenances</div>
          </div>
        </div>
      </div>

      {/* LIGNE 2 : OFFRES ET CANDIDATURES */}
      <div className="grid-2">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Offres récentes</h2>
            <a href="/offres" className="link-primary">Voir toutes</a>
          </div>
          <div className="section-body">
            {offres.map((offre) => (
              <div className="list-row" key={offre.id}>
                <div className="list-title">{offre.titre}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Mes candidatures</h2>
            <a href="/candidatures" className="link-primary">Voir toutes</a>
          </div>
          <div className="section-body">
            {candidatures.map((cand) => (
              <div className="list-row right-align" key={cand.id}>
                <span className="badge badge-gray">{cand.statut}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIGNE 3 : CONVENTIONS ET SOUTENANCES */}
      <div className="grid-2">
        <div className="section-card min-h">
          <div className="section-header">
            <h2 className="section-title">Mes conventions</h2>
          </div>
          <div className="section-body">
            <span className="badge badge-light">EN_ATTENTE</span>
          </div>
        </div>

        <div className="section-card min-h">
          <div className="section-header">
            <h2 className="section-title">Soutenances</h2>
          </div>
          <div className="section-body">
            <span className="badge badge-light">EN_ATTENTE</span>
          </div>
        </div>
      </div>

    </div>
  );
}