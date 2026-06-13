// ListeSoutenances.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import soutenanceService from '../../Services/soutenanceService';

const ListeSoutenances = () => {
    const navigate = useNavigate();

    const [soutenances, setSoutenances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États pour le formulaire (modification uniquement, l'ajout se fait sur une page séparée)
    const [showFormModal, setShowFormModal] = useState(false);
    const [formMode, setFormMode] = useState('modification');
    const [currentSoutenance, setCurrentSoutenance] = useState(null);

    // État pour la confirmation d'annulation
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [soutenanceToCancel, setSoutenanceToCancel] = useState(null);

    // Chargement initial
    const chargerSoutenances = async () => {
        try {
            const data = await soutenanceService.getAll();
            setSoutenances(data);
        } catch (err) {
            setError('Impossible de charger les soutenances.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chargerSoutenances();
    }, []);

    // Redirection vers la page d'ajout
    const handleAjouter = () => {
        navigate('/admin/soutenances/ajouter');
    };

    const handleModifier = (soutenance) => {
        setFormMode('modification');
        setCurrentSoutenance(soutenance);
        setShowFormModal(true);
    };

    const handleAnnulerClick = (soutenance) => {
        setSoutenanceToCancel(soutenance);
        setShowCancelModal(true);
    };

    const confirmAnnuler = async () => {
        try {
            await soutenanceService.annuler(soutenanceToCancel.id);
            await chargerSoutenances();
        } catch (err) {
            alert('Erreur lors de l’annulation');
            console.error(err);
        } finally {
            setShowCancelModal(false);
            setSoutenanceToCancel(null);
        }
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            date: formData.get('date'),
            heure: formData.get('heure'),
            salle: formData.get('salle'),
            duree: parseInt(formData.get('duree'), 10),
            idStage: parseInt(formData.get('idStage'), 10),
        };

        try {
            if (formMode === 'ajout') {
                // Ce cas n'est plus utilisé, mais conservé par sécurité
                await soutenanceService.create(data);
            } else {
                await soutenanceService.update(currentSoutenance.id, {
                    ...data,
                    statut: currentSoutenance.statut,
                });
            }
            setShowFormModal(false);
            await chargerSoutenances();
        } catch (err) {
            alert('Erreur lors de l’enregistrement');
            console.error(err);
        }
    };

    const getStatusBadge = (statut) => {
        const statutMap = {
            PLANIFIEE: { class: 'bg-primary', label: 'Planifiée' },
            EN_COURS: { class: 'bg-warning text-dark', label: 'En cours' },
            TERMINEE: { class: 'bg-success', label: 'Terminée' },
            ANNULEE: { class: 'bg-danger', label: 'Annulée' },
        };
        const s = statutMap[statut] || { class: 'bg-secondary', label: statut };
        return <span className={`badge ${s.class}`}>{s.label}</span>;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR');
    };

    const formatHeure = (heureStr) => {
        return heureStr ? heureStr.substring(0, 5) : '';
    };

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2">Chargement des soutenances...</p>
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
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Liste des soutenances</h2>
                <button className="btn btn-primary" onClick={handleAjouter}>
                    <i className="bi bi-plus-circle me-1"></i> Ajouter
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Salle</th>
                        <th>Durée (min)</th>
                        <th>Statut</th>
                        <th>Stage ID</th>
                        <th style={{ width: '240px' }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {soutenances.map((sout) => (
                        <tr key={sout.id}>
                            <td>{sout.id}</td>
                            <td>{formatDate(sout.date)}</td>
                            <td>{formatHeure(sout.heure)}</td>
                            <td>{sout.salle}</td>
                            <td>{sout.duree}</td>
                            <td>{getStatusBadge(sout.statut)}</td>
                            <td>{sout.idStage}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-outline-primary me-1"
                                    onClick={() => handleModifier(sout)}
                                    title="Modifier"
                                >
                                    <i className="bi bi-pencil-square"></i> Modifier
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger me-1"
                                    onClick={() => handleAnnulerClick(sout)}
                                    title="Annuler"
                                >
                                    <i className="bi bi-x-circle"></i> Annuler
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => navigate(`/admin/soutenances/${sout.id}/jury`)}
                                    title="Affecter un jury"
                                >
                                    <i className="bi bi-people-fill"></i> Jury
                                </button>
                            </td>
                        </tr>
                    ))}
                    {soutenances.length === 0 && (
                        <tr>
                            <td colSpan="8" className="text-center text-muted">
                                Aucune soutenance trouvée.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal de modification (l'ajout se fait via la page dédiée) */}
            {showFormModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {formMode === 'ajout' ? 'Nouvelle soutenance' : 'Modifier la soutenance'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowFormModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmitForm}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Date (JJ-MM-AAAA)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="date"
                                            defaultValue={currentSoutenance?.date || ''}
                                            placeholder="dd-mm-yyyy"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Heure (HH:MM)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="heure"
                                            defaultValue={currentSoutenance?.heure || ''}
                                            placeholder="HH:MM"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Salle</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="salle"
                                            defaultValue={currentSoutenance?.salle || ''}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Durée (minutes)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="duree"
                                            defaultValue={currentSoutenance?.duree || ''}
                                            min="15"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">ID du stage</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="idStage"
                                            defaultValue={currentSoutenance?.idStage || ''}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowFormModal(false)}
                                    >
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showFormModal && <div className="modal-backdrop fade show"></div>}

            {/* Modal de confirmation d'annulation */}
            {showCancelModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmer l'annulation</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowCancelModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Voulez-vous vraiment annuler la soutenance #{soutenanceToCancel?.id} ?</p>
                                <p className="text-muted">Le statut passera à « Annulée ».</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowCancelModal(false)}
                                >
                                    Fermer
                                </button>
                                <button className="btn btn-danger" onClick={confirmAnnuler}>
                                    Confirmer l'annulation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showCancelModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default ListeSoutenances;