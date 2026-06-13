import React, { useState, useEffect } from 'react';
import soutenanceService from '../../Services/soutenanceService';

const PlanningProfesseur = ({ professeurId }) => {
  const [soutenances, setSoutenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtreStatut, setFiltreStatut] = useState('');

  useEffect(() => {
    const fetchPlanning = async () => {
      try {
        // Récupère le planning complet
        const data = await soutenanceService.getPlanning();

        // Filtrer selon l'ID du professeur
        // ⚠️ Adaptez la condition à la structure réelle de vos données
        // Exemple : data.filter(s => s.stage?.professeur?.id === professeurId)
        const planningFiltre = professeurId
          ? data.filter(s => s.professeurId === professeurId)
          : data;
        setSoutenances(planningFiltre);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanning();
  }, [professeurId]);

  // Filtrage local par statut
  const soutenancesAffichees = filtreStatut
    ? soutenances.filter(s => s.statut === filtreStatut)
    : soutenances;

  if (loading) return <div className="text-center p-4">Chargement du planning...</div>;
  if (error) return <div className="alert alert-danger">Erreur : {error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Planning des soutenances</h2>

      <div className="row mb-3">
        <div className="col-md-4">
          <div className="input-group">
            <label className="input-group-text" htmlFor="filtreStatut">Statut</label>
            <select
              id="filtreStatut"
              className="form-select"
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="PLANIFIEE">Planifiée</option>
              <option value="TERMINEE">Terminée</option>
              <option value="ANNULEE">Annulée</option>
            </select>
          </div>
        </div>
      </div>

      {soutenancesAffichees.length === 0 ? (
        <div className="alert alert-info">Aucune soutenance trouvée.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Heure</th>
                <th scope="col">Salle</th>
                <th scope="col">Durée (min)</th>
                <th scope="col">Statut</th>
                <th scope="col">Stage ID</th>
              </tr>
            </thead>
            <tbody>
              {soutenancesAffichees.map((soutenance) => (
                <tr key={soutenance.id}>
                  <td>{soutenance.date}</td>
                  <td>{soutenance.heure}</td>
                  <td>{soutenance.salle}</td>
                  <td>{soutenance.duree}</td>
                  <td>
                    <span className={`badge ${
                      soutenance.statut === 'PLANIFIEE' ? 'bg-primary' :
                      soutenance.statut === 'TERMINEE' ? 'bg-success' :
                      'bg-danger'
                    }`}>
                      {soutenance.statut}
                    </span>
                  </td>
                  <td>{soutenance.idStage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlanningProfesseur;