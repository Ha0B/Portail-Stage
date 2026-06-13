import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import stageService from '../../Services/stageService';
import encadrantService from '../../Services/encadrantService';

const ListeStages = () => {
    const [stages, setStages] = useState([]);
    const [encadrants, setEncadrants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modale d’affectation
    const [showModal, setShowModal] = useState(false);
    const [selectedStage, setSelectedStage] = useState(null);
    const [selectedEncadrantId, setSelectedEncadrantId] = useState('');

    useEffect(() => {
        const chargerDonnees = async () => {
            try {
                const [stagesData, encadrantsData] = await Promise.all([
                    stageService.getAll(),
                    encadrantService.getAll(),
                ]);
                setStages(stagesData);
                setEncadrants(encadrantsData);
            } catch (err) {
                console.error(err);
                setError('Impossible de charger les données.');
            } finally {
                setLoading(false);
            }
        };
        chargerDonnees();
    }, []);

    const handleAffecter = (stage) => {
        setSelectedStage(stage);
        setSelectedEncadrantId('');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedStage(null);
        setSelectedEncadrantId('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEncadrantId || !selectedStage) return;

        try {
            // Récupérer les données complètes du stage pour ne rien écraser
            const stageComplet = await stageService.getById(selectedStage.id);

            // Construire l’objet conforme à UpdateInput
            const updatedData = {
                titre: stageComplet.titre || '',
                description: stageComplet.description || '',
                dateDebut: stageComplet.dateDebut,
                dateFin: stageComplet.dateFin,
                entrepriseId: stageComplet.entrepriseId || null, // s’il existe dans la réponse de getById
                encadrantId: selectedEncadrantId,                // affectation de l’encadrant
            };

            await stageService.update(selectedStage.id, updatedData);

            // Recharger la liste pour voir le changement
            const updatedStages = await stageService.getAll();
            setStages(updatedStages);
            handleCloseModal();
        } catch (err) {
            alert("Erreur lors de l’affectation de l’encadrant");
            console.error(err);
        }
    };

    // Badge du statut
    const getStatusBadge = (statut) => {
        const statutMap = {
            EN_COURS: { class: 'bg-primary', label: 'En cours' },
            TERMINE: { class: 'bg-success', label: 'Terminé' },
            SUSPENDU: { class: 'bg-warning text-dark', label: 'Suspendu' },
            ANNULE: { class: 'bg-danger', label: 'Annulé' },
        };
        const s = statutMap[statut] || { class: 'bg-secondary', label: statut };
        return <span className={`badge ${s.class}`}>{s.label}</span>;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('fr-FR');
    };

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2">Chargement des stages...</p>
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
            <h2 className="mb-4">Liste des stages</h2>

            <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Titre</th>
                        <th>Date début</th>
                        <th>Date fin</th>
                        <th>Statut</th>
                        <th>Étudiant</th>
                        <th>Entreprise</th>
                        <th>Encadrant</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stages.map((stage) => (
                        <tr key={stage.id}>
                            <td>{stage.id}</td>
                            <td>{stage.titre}</td>
                            <td>{formatDate(stage.dateDebut)}</td>
                            <td>{formatDate(stage.dateFin)}</td>
                            <td>{getStatusBadge(stage.statut)}</td>
                            <td>{stage.prenomEtudiant} {stage.nomEtudiant}</td>
                            <td>{stage.nomEntreprise}</td>
                            <td>{stage.nomEncadrant || <span className="text-muted">Aucun</span>}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleAffecter(stage)}
                                    title="Affecter un encadrant"
                                >
                                    <i className="bi bi-person-plus me-1"></i>
                                    Affecter encadrant
                                </button>
                            </td>
                        </tr>
                    ))}
                    {stages.length === 0 && (
                        <tr>
                            <td colSpan="9" className="text-center text-muted">
                                Aucun stage trouvé.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modale d’affectation */}
            {showModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Affecter un encadrant</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <p>
                                            Stage : <strong>{selectedStage?.titre}</strong> (ID {selectedStage?.id})
                                        </p>
                                        <div className="mb-3">
                                            <label className="form-label">Choisir un encadrant</label>
                                            <select
                                                className="form-select"
                                                value={selectedEncadrantId}
                                                onChange={(e) => setSelectedEncadrantId(e.target.value)}
                                                required
                                            >
                                                <option value="">-- Sélectionnez --</option>
                                                {encadrants.map((enc) => (
                                                    <option key={enc.id} value={enc.id}>
                                                        {enc.prenom} {enc.nom} ({enc.email})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                            Annuler
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Valider
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
};

export default ListeStages;