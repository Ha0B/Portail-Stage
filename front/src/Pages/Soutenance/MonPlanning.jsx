import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from "../../Services/authService";
import soutenanceService from "../../Services/soutenanceService";

const MonPlanning = () => {
    const [soutenances, setSoutenances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const currentUser = authService.getCurrentUser();
    const idEncadrant = currentUser?.id;

    useEffect(() => {
        const loadSoutenances = async () => {
            if (!idEncadrant) {
                setError("Impossible de récupérer l'identifiant de l'encadrant.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await soutenanceService.getByJuryEncadrant(idEncadrant);
                const data = Array.isArray(response) ? response : response?.data ?? [];
                setSoutenances(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger la liste des soutenances.");
                setSoutenances([]);
            } finally {
                setLoading(false);
            }
        };

        loadSoutenances();
    }, [idEncadrant]);

    const getStatusBadge = (statut) => {
        switch (statut) {
            case 'PLANIFIEE':
                return <span className="badge bg-primary">Planifiée</span>;
            case 'EN_COURS':
                return <span className="badge bg-warning text-dark">En cours</span>;
            case 'TERMINEE':
                return <span className="badge bg-success">Terminée</span>;
            case 'ANNULEE':
                return <span className="badge bg-danger">Annulée</span>;
            default:
                return <span className="badge bg-secondary">{statut}</span>;
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2">Chargement de votre planning...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Mes Évaluations (Jury de Soutenance)</h5>
                    <span className="badge bg-light text-dark">
            ID Encadrant : {idEncadrant ?? 'inconnu'}
          </span>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover mb-0 align-middle">
                            <thead className="table-light">
                            <tr>
                                <th>ID Soutenance</th>
                                <th>ID Stage</th>
                                <th>Date & Heure</th>
                                <th>Salle</th>
                                <th>Durée</th>
                                <th>Statut</th>
                                <th className="text-center">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {soutenances.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-muted">
                                        Aucune soutenance planifiée en tant que jury.
                                    </td>
                                </tr>
                            ) : (
                                soutenances.map((s) => (
                                    <tr key={s.id}>
                                        <td><strong>#{s.id}</strong></td>
                                        <td>#{s.idStage}</td>
                                        <td>
                                            <i className="bi bi-calendar-event me-1"></i> {s.date}
                                            <br />
                                            <small className="text-muted">
                                                <i className="bi bi-clock me-1"></i> {s.heure}
                                            </small>
                                        </td>
                                        <td>{s.salle}</td>
                                        <td>{s.duree} min</td>
                                        <td>{getStatusBadge(s.statut)}</td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-outline-primary btn-sm px-3"
                                                disabled={s.statut === 'ANNULEE'}
                                                onClick={() => navigate(`/encadrant/saisie-notes/${s.id}`)}
                                            >
                                                <i className="bi bi-pencil-square me-1"></i> Noter
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonPlanning;