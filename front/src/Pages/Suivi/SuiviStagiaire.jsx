import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../Style/Suivi/SuiviStagiaire.css';

import objectifService from '../../Services/objectifService';
import rapportService from '../../Services/rapportService';
import stageService from '../../Services/stageService';
import etudiantService from '../../Services/etudiantService';

const SuiviStagiaire = () => {
    const params = useParams();
    const stageId = params.stageId || params.id;
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stageDetails, setStageDetails] = useState(null);
    const [objectifs, setObjectifs] = useState([]);
    const [rapports, setRapports] = useState([]);
    const [stagiaire, setStagiaire] = useState(null);

    // Formatage de date (dd-MM-yyyy)
    const formatDate = (dateValue) => {
        if (!dateValue) return '—';
        try {
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) return dateValue;
            const jour = date.getDate().toString().padStart(2, '0');
            const mois = (date.getMonth() + 1).toString().padStart(2, '0');
            const annee = date.getFullYear();
            return `${jour}-${mois}-${annee}`;
        } catch {
            return dateValue;
        }
    };

    // --- PARTIE TRAITEMENT CORRIGÉE ---

    const fetchDonneesSuivi = useCallback(async () => {
        if (!stageId) {
            setLoading(false);
            setError("Erreur : L'ID du stage est introuvable.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // Chargement parallèle des données liées au stage
            const [dataStage, dataObjectifs, dataRapports] = await Promise.all([
                stageService.getById(stageId).catch(() => null),
                objectifService.getByStage(stageId).catch(() => []),
                rapportService.getRapportsParStage(stageId).catch(() => []),
            ]);

            if (!dataStage) {
                setError("Impossible de récupérer les détails du stage.");
                return;
            }

            // Chargement des infos étudiant si l'ID est présent
            const etuId = dataStage.etudiantId || dataStage.etudiant?.id;
            const dataStagiaire = etuId
                ? await etudiantService.getById(etuId).catch(() => null)
                : null;

            setStageDetails(dataStage);
            setObjectifs(dataObjectifs || []);
            setRapports(dataRapports || []);
            setStagiaire(dataStagiaire);
        } catch (err) {
            console.error("Erreur API Suivi :", err);
            setError("Erreur de communication avec le serveur.");
        } finally {
            setLoading(false);
        }
    }, [stageId]);

    useEffect(() => {
        fetchDonneesSuivi();
    }, [fetchDonneesSuivi]);

    const handleValiderObjectif = async (obj) => {
        try {
            await objectifService.valider(obj.id);
            alert("Objectif validé avec succès !");
            fetchDonneesSuivi();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la validation.");
        }
    };

    const handleVoirRapport = async (rapportId, type) => {
        try {
            const blobData = await rapportService.getFichier(rapportId);
            const file = new Blob([blobData], { type: type || 'application/pdf' });

            const url = window.URL.createObjectURL(file);
            window.open(url, '_blank');

            // Nettoyage de l'URL locale après 10 secondes pour liberer la memoire
            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        } catch (err) {
            console.error("Erreur lors de la lecture du fichier :", err);
            alert("Impossible d'afficher le fichier. Vérifiez vos permissions.");
        }
    };

    const handleRefuserObjectif = async (obj) => {
        if (window.confirm("Confirmez-vous le refus de cet objectif ?")) {
            try {
                // On met à jour avec le statut REJETE
                await objectifService.update(obj.id, {
                    ...obj,
                    statut: 'REJETE'
                });
                alert("Objectif refusé.");
                fetchDonneesSuivi();
            } catch (err) {
                console.error(err);
                alert("Erreur lors du refus.");
            }
        }
    };

    const handleValiderStage = async (id) => {
        if (window.confirm("Voulez-vous marquer ce stage comme terminé ?")) {
            try {
                // Correction : On utilise 'TERMINE' ou 'VALIDE' selon votre logique métier
                await stageService.updateStatus(id, 'TERMINE');
                alert("Stage marqué comme terminé.");
                navigate('/entreprise'); 
            } catch (err) {
                console.error(err);
                alert("Erreur lors de la validation finale.");
            }
        }
    };

    const handleModifierObjectif = (id) => navigate(`/entreprise/modifierObjectif/${id}`);

    // --- FIN PARTIE TRAITEMENT ---

    if (loading) return (
        <div className="suivi-loader">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3 text-muted">Chargement de l'espace entreprise...</p>
        </div>
    );
    
    if (error) return (
        <div className="alert alert-danger alert-modern m-5" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
        </div>
    );

    const etudiantNom = stagiaire?.nom || stageDetails?.etudiant?.nom || "Non renseigné";
    const etudiantPrenom = stagiaire?.prenom || stageDetails?.etudiant?.prenom || "";
    const etudiantInitiales = `${etudiantNom.charAt(0)}${etudiantPrenom.charAt(0)}`.toUpperCase();
    const entrepriseNom = stageDetails?.nomEntreprise || "Entreprise non renseignée";
    const objectifsValides = objectifs.filter(obj => obj.statut === 'VALIDE').length;
    const tauxCompletion = objectifs.length ? Math.round((objectifsValides / objectifs.length) * 100) : 0;
    
    // Correction de la condition de validation (prend en compte TERMINE et VALIDE)
    const estStageTermine = stageDetails?.statut === 'TERMINE' || stageDetails?.statut === 'VALIDE';

    return (
        <div className="suivi-container">
            <div className="container-lg py-4">
                {/* En-tête */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 g-3">
                    <div>
                        <h1 className="suivi-title mb-1">
                            <i className="bi bi-building-check me-2 text-primary"></i>
                            Espace Évaluation Entreprise
                        </h1>
                        <p className="text-muted">Suivi opérationnel et validation finale du parcours de stage</p>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        <span className={`badge ${estStageTermine ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'} px-3 py-2 rounded-pill`}>
                            <i className={`bi ${estStageTermine ? 'bi-check-all' : 'bi-calendar-week'} me-1`}></i> 
                            {estStageTermine ? 'Stage Validé / Terminé' : 'Stage en cours'}
                        </span>
                        {!estStageTermine && (
                            <button 
                                className="btn btn-success btn-modern shadow-sm d-flex align-items-center gap-2"
                                onClick={() => handleValiderStage(stageId)}
                            >
                                <i className="bi bi-patch-check-fill fs-5"></i>
                                <strong>Valider le stage</strong>
                            </button>
                        )}
                    </div>
                </div>

                {/* KPI */}
                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div className="kpi-card">
                            <div className="kpi-icon bg-success-subtle text-success">
                                <i className="bi bi-check2-circle"></i>
                            </div>
                            <div className="kpi-content">
                                <span className="kpi-label">Objectifs validés</span>
                                <h3 className="kpi-value">{objectifsValides}/{objectifs.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="kpi-card">
                            <div className="kpi-icon bg-info-subtle text-info">
                                <i className="bi bi-file-earmark-text"></i>
                            </div>
                            <div className="kpi-content">
                                <span className="kpi-label">Rapports déposés</span>
                                <h3 className="kpi-value">{rapports.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="kpi-card">
                            <div className="kpi-icon bg-warning-subtle text-warning">
                                <i className="bi bi-bar-chart-steps"></i>
                            </div>
                            <div className="kpi-content">
                                <span className="kpi-label">Progression</span>
                                <h3 className="kpi-value">{tauxCompletion}%</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stagiaire + Stage */}
                <div className="row g-4 mb-4">
                    <div className="col-md-5">
                        <div className="card-glass h-100">
                            <div className="card-header-glass">
                                <i className="bi bi-person-badge me-2"></i> Informations du Stagiaire
                            </div>
                            <div className="card-body-glass">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="avatar-large me-3">
                                        {etudiantInitiales}
                                    </div>
                                    <div>
                                        <h4 className="mb-0">{etudiantPrenom} {etudiantNom}</h4>
                                        <span className="text-muted small">ID Étudiant: {stagiaire?.numeroEtudiant || '—'}</span>
                                    </div>
                                </div>
                                <div className="info-row">
                                    <i className="bi bi-envelope"></i>
                                    <span>{stagiaire?.email || '—'}</span>
                                </div>
                                <div className="info-row">
                                    <i className="bi bi-journal-bookmark-fill"></i>
                                    <span>Niveau : {stagiaire?.niveau || '—'}</span>
                                </div>
                                <div className="info-row">
                                    <i className="bi bi-mortarboard"></i>
                                    <span>Filière : {stagiaire?.filiere || '—'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="card-glass h-100">
                            <div className="card-header-glass">
                                <i className="bi bi-building me-2"></i> Détails du Stage
                            </div>
                            <div className="card-body-glass">
                                <div className="row">
                                    <div className="col-6 mb-3">
                                        <div className="info-label-sm">Sujet / Titre</div>
                                        <div className="info-value-sm fw-semibold">{stageDetails?.titre || '—'}</div>
                                    </div>
                                    <div className="col-6 mb-3">
                                        <div className="info-label-sm">Structure d'accueil</div>
                                        <div className="info-value-sm fw-semibold">{entrepriseNom}</div>
                                    </div>
                                    <div className="col-6 mb-3">
                                        <div className="info-label-sm">Date de début</div>
                                        <div className="info-value-sm">{formatDate(stageDetails?.dateDebut)}</div>
                                    </div>
                                    <div className="col-6 mb-3">
                                        <div className="info-label-sm">Fin prévisionnelle</div>
                                        <div className="info-value-sm">{formatDate(stageDetails?.dateFin)}</div>
                                    </div>
                                    <div className="col-12">
                                        <div className="info-label-sm">Encadrant Professionnel</div>
                                        <div className="info-value-sm">{stageDetails?.nomEncadrant || stageDetails?.encadrant?.nom || "Non assigné"}</div>
                                    </div>
                                </div>
                                <div className="progress-modern mt-2">
                                    <div className="progress-label">Validation globale du plan de travail</div>
                                    <div className="progress">
                                        <div className="progress-bar bg-gradient" style={{ width: `${tauxCompletion}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Objectifs */}
                <div className="card-glass mb-4">
                    <div className="card-header-glass d-flex justify-content-between align-items-center">
                        <span><i className="bi bi-bullseye me-2"></i>Suivi des Objectifs</span>
                        <div className="d-flex gap-2">
                            <span className="badge bg-light text-dark rounded-pill">{objectifs.length} livrable(s)</span>
                            <button 
                                className="btn btn-sm btn-primary rounded-pill" 
                                onClick={() => navigate(`/entreprise/ajouterObjectif/${stageId}`)}
                            >
                                <i className="bi bi-plus-lg me-1"></i> Objectif
                            </button>
                        </div>
                    </div>
                    <div className="card-body-glass">
                        {objectifs.length === 0 ? (
                            <div className="empty-state">
                                <i className="bi bi-clipboard-x"></i>
                                <p>Aucun objectif défini</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table objectifs-table">
                                    <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th>Priorité</th>
                                            <th>Échéance</th>
                                            <th>Statut</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {objectifs.map((obj) => (
                                            <tr key={obj.id}>
                                                <td className="objectif-description">{obj.description}</td>
                                                <td>
                                                    <span className={`priority-badge priority-${obj.priorite?.toLowerCase()}`}>
                                                        {obj.priorite || 'MOYENNE'}
                                                    </span>
                                                </td>
                                                <td>{formatDate(obj.dateEcheance)}</td>
                                                <td>
                                                    <span className={`status-badge ${
                                                        obj.statut === 'VALIDE' ? 'status-valid' : 
                                                        obj.statut === 'REJETE' ? 'status-rejected' : 
                                                        'status-pending'
                                                    }`}>
                                                        {obj.statut || 'EN ATTENTE'}
                                                    </span>
                                                </td>
                                                <td className="objectif-actions">
                                                    {obj.statut !== 'VALIDE' && (
                                                        <>
                                                            <button className="btn-icon btn-success-icon" onClick={() => handleValiderObjectif(obj)} title="Valider"><i className="bi bi-check-lg"></i></button>
                                                            <button className="btn-icon btn-danger-icon" onClick={() => handleRefuserObjectif(obj)} title="Refuser"><i className="bi bi-x-lg"></i></button>
                                                        </>
                                                    )}
                                                    <button className="btn-icon btn-edit-icon" onClick={() => handleModifierObjectif(obj.id)} title="Modifier"><i className="bi bi-pencil-square"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rapports */}
                <div className="card-glass mb-4">
                    <div className="card-header-glass">
                        <i className="bi bi-files me-2"></i> Livrables et Rapports
                    </div>
                    <div className="card-body-glass">
                        {rapports.length === 0 ? (
                            <div className="empty-state">
                                <i className="bi bi-file-earmark-text"></i>
                                <p>Aucun livrable déposé.</p>
                            </div>
                        ) : (
                            <div className="rapports-grid">
                                {rapports.map((rap) => (
                                    <div key={rap.id} className="rapport-card">
                                        <div className="rapport-icon">
                                            <i className="bi bi-file-earmark-pdf-fill text-danger"></i>
                                        </div>
                                        <div className="rapport-details">
                                            <div className="rapport-title">{rap.titre}</div>
                                            <div className="rapport-date">
                                                <i className="bi bi-clock"></i> Déposé le : {formatDate(rap.dateSoumission)}
                                            </div>
                                        </div>
                                        <div className="rapport-actions">
                                            {/* BOUTON VOIR CORRIGÉ */}
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleVoirRapport(rap.id, rap.fichierType)}
                                                title="Voir le rapport"
                                            >
                                                <i className="bi bi-eye me-1"></i> Voir
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuiviStagiaire;