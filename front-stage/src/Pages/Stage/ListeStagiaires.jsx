import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import stageService from "../../Services/stageService";
import authService from "../../Services/authService";

const StagiairesEntreprise = () => {
  const [stagiaires, setStagiaires] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUser = authService.getCurrentUser();
  const entrepriseId = currentUser?.entrepriseId;

  useEffect(() => {
    if (!entrepriseId) return;

    console.log();
    const load = async () => {
      try {
        setLoading(true);
        const data = await stageService.getStagiairesByEntreprise(entrepriseId);
        setStagiaires(data);
      } catch (err) {
        console.error("Erreur API :", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [entrepriseId]);
  console.log(stagiaires);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Liste des stagiaires</h3>
        <span className="badge bg-secondary">Total : {stagiaires.length}</span>
      </div>

      {loading && (
        <div className="alert alert-info text-center">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
          Chargement des données...
        </div>
      )}

      {!loading && !entrepriseId && (
        <div className="alert alert-danger">
          Session introuvable. Veuillez vous reconnecter.
        </div>
      )}

      {!loading && entrepriseId && stagiaires.length === 0 && (
        <div className="alert alert-warning text-center">
          Aucun stagiaire trouvé.
        </div>
      )}

      {/* TABLEAU CORRESPONDANT À TES ROUTES */}
      {!loading && entrepriseId && stagiaires.length > 0 && (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover table-striped align-middle mb-0 bg-white">
            <thead className="table-dark">
              <tr>
                <th>Nom & Prénom</th>
                <th>Email</th>
                <th>Date Début</th>
                <th>Date Fin</th>
                <th>Statut</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {stagiaires.map((s) => (
                <tr key={s.stageId}>
                  <td className="fw-bold text-capitalize">
                    {s.prenom} {s.nom}
                  </td>
                  <td>{s.email}</td>
                  <td>
                    {s.dateDebut ? new Date(s.dateDebut).toLocaleDateString() : "-"}
                  </td>
                  <td>
                    {s.dateFin ? new Date(s.dateFin).toLocaleDateString() : "-"}
                  </td>
                  <td>
                    <span className={`badge ${s.statut === "EN_COURS" ? "bg-success" : "bg-secondary"}`}>
                      {s.statut}
                    </span>
                  </td>
                  <td className="text-center">
                    <Link
                      to={`/entreprise/suivi/${s.stageId}`}
                      className="btn btn-sm btn-primary px-3 shadow-sm"
                    >
                      Suivre
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StagiairesEntreprise;