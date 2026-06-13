import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import stageService from '../../Services/stageService';
import authService from '../../Services/authService';
import '../../Style/Stage/MesStages.css';

const MesStages = () => {
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const currentUser = authService.getCurrentUser();
    const etudiantId = currentUser.etudiantId;

    useEffect(() => {
        const fetchStages = async () => {
            if (!etudiantId) {
                setError("Aucun identifiant étudiant trouvé. Veuillez vous reconnecter.");
                setLoading(false);
                return;
            }

            try {
                const data = await stageService.getByEtudiant(etudiantId);
                setStages(data || []);
            } catch (err) {
                console.error("Erreur lors de la récupération des stages:", err);
                setError("Impossible de charger la liste de vos stages.");
            } finally {
                setLoading(false);
            }
        };

        fetchStages();
    }, [etudiantId]);

    const getStatusBadge = (statut) => {
        switch (statut?.toUpperCase()) {
            case 'EN COURS':
            case 'EN_COURS':
                return <span className="badge badge-primary">En cours</span>;
            case 'TERMINE':
            case 'CLOTURE':
                return <span className="badge badge-success">Terminé</span>;
            case 'ANNULE':
                return <span className="badge badge-danger">Annulé</span>;
            default:
                return <span className="badge badge-warning">{statut || 'En attente'}</span>;
        }
    };

    if (loading) return <div className="container-stages"><p>Chargement de vos stages...</p></div>;
    if (error) return <div className="container-stages"><p className="error-text">{error}</p></div>;

    return (
        <div className="container-stages">
            <div className="header-stages">
                <h2>📁 Mes Stages</h2>
                <p>Retrouvez l'historique et le suivi de vos stages (PFE, PFA, etc.)</p>
            </div>

            <div className="table-responsive">
                <table className="stages-table">
                    <thead>
                        <tr>
                            <th>Sujet / Titre du stage</th>
                            <th>Date de début</th>
                            <th>Date de fin</th>
                            <th>Statut</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stages.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="empty-state">
                                    Aucun stage trouvé pour le moment.
                                </td>
                            </tr>
                        ) : (
                            stages.map((stage) => (
                                <tr key={stage.id}>
                                    <td className="fw-bold">{stage.titre || 'Sujet non défini'}</td>
                                    <td>{stage.dateDebut || '--/--/----'}</td>
                                    <td>{stage.dateFin || '--/--/----'}</td>
                                    <td>{getStatusBadge(stage.statut)}</td>
                                    <td>
                                        <button 
                                            className="btn-suivi"
                                            onClick={() => navigate(`/etudiant/suivi/${stage.id}`)}
                                        >
                                            Accéder au suivi
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MesStages;