import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import stageService from '../../Services/stageService';
import objectifService from '../../Services/objectifService';
import rapportService from '../../Services/rapportService';
import authService from '../../Services/authService';
import '../../Style/Suivi/SuiviStage.css';

const SuiviStage = () => {
    const { stageId } = useParams();
    const [stage, setStage] = useState(null);
    const [objectifs, setObjectifs] = useState([]);
    const [rapports, setRapports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        if (!stageId) {
            setError("Aucun identifiant de stage fourni.");
            setLoading(false);
            return;
        }

        try {
            let stageData;
            if (stageService.getById) {
                stageData = await stageService.getById(stageId);
            } else {
                const currentUser = authService.getCurrentUser();
                const etudiantId = currentUser?.etudiantId || currentUser?.id;
                const allStages = await stageService.getByEtudiant(etudiantId);
                stageData = allStages.find(s => s.id === parseInt(stageId));
            }

            console.log(stageData);

            if (!stageData) {
                setError("Stage introuvable.");
                setLoading(false);
                return;
            }

            setStage(stageData);

            const [objectifsData, rapportsData] = await Promise.all([
                objectifService.getByStage(stageId),
                rapportService.getRapportsParStage(stageId)
            ]);

            setObjectifs(objectifsData || []);
            setRapports(rapportsData || []);
        } catch (err) {
            console.error("Erreur lors du chargement des données:", err);
            setError("Impossible de charger les données du tableau de bord.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [stageId]);

    // Calcul de la progression
    const calculateProgress = () => {
        if (objectifs.length === 0) return { percent: 0, valid: 0, total: 0 };
        const valid = objectifs.filter(obj => obj.statut === 'VALIDE' || obj.statut === 'DONE').length;
        return {
            percent: Math.round((valid / objectifs.length) * 100),
            valid,
            total: objectifs.length
        };
    };
    const progress = calculateProgress();

    // Marquer un objectif comme "À valider"
    const handleMarquerAValider = async (objectifId) => {
        try {
            await objectifService.update(objectifId, { statut: 'EN_ATTENTE_VALIDATION' });
            // Recharger les objectifs après mise à jour
            const updatedObjectifs = await objectifService.getByStage(stageId);
            setObjectifs(updatedObjectifs);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la mise à jour de l'objectif");
        }
    };

    const handleVoirFichier = async (rapportId, type) => {
        try {
            // Appelle le backend en incluant votre token (via l'intercepteur API)
            const blobData = await rapportService.getFichier(rapportId);

            // Crée un objet Blob en forçant le type (ex: 'application/pdf')
            const file = new Blob([blobData], { type: type || 'application/pdf' });

            // Crée une URL temporaire locale pour le navigateur
            const fileUrl = window.URL.createObjectURL(file);

            // Ouvre le fichier dans un nouvel onglet
            window.open(fileUrl, '_blank');

            // Libère la mémoire après quelques secondes
            setTimeout(() => window.URL.revokeObjectURL(fileUrl), 10000);
        } catch (err) {
            console.error("Erreur lors de la lecture du fichier :", err);
            alert("Impossible d'afficher le fichier. Vérifiez vos permissions.");
        }
    };

    // Suppression d'un rapport
    const handleSupprimerRapport = async (rapportId) => {
        // 1. Demander confirmation à l'utilisateur pour éviter les erreurs
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce rapport ? Cette action est irréversible.");

        if (!confirmation) return;

        try {
            // 2. Appel à l'API pour supprimer
            await rapportService.delete(rapportId);

            // 3. Mettre à jour l'affichage en retirant le rapport supprimé
            setRapports(prevRapports => prevRapports.filter(rapport => rapport.id !== rapportId));

            alert("Rapport supprimé avec succès.");
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            alert("Erreur lors de la suppression du rapport. Vérifiez que vous avez les droits nécessaires.");
        }
    };

    // Upload d'un rapport
    const handleUploadRapport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        // creer l'objet JSON attendu par le backend (RapportDTO.CreateInput)
        const rapportInput = {
            titre: file.name, // ou demandez un titre à l'utilisateur
            contenu: "Dépôt du livrable",
            idStage: stage.id
        };

        // L'attacher en spécifiant que c'est du JSON (très important pour Spring Boot)
        formData.append('rapportInput', new Blob([JSON.stringify(rapportInput)], {
            type: 'application/json'
        }));

        try {
            await rapportService.create(formData);
            const updatedRapports = await rapportService.getRapportsParStage(stageId);
            setRapports(updatedRapports);
            alert("Rapport déposé avec succès.");
        } catch (err) {
            console.error(err);
            alert("Erreur lors du dépôt du livrable");
        }
    };

    if (loading) return <div className="container"><p>Chargement de votre espace...</p></div>;
    if (error) return <div className="container"><p style={{ color: 'red' }}>{error}</p></div>;
    if (!stage) return <div className="container"><p>Aucun stage trouvé.</p></div>;

    return (
        <div className="container">
            {/* GRID TOP */}
            <div className="grid">
                <div className="card">
                    <h3>🏢 Mon Stage</h3>
                    <p><b>Entreprise :</b> {stage.nomEntreprise || 'Non spécifié'}</p>
                    <p><b>Sujet :</b> {stage.titre || 'Non défini'}</p>
                    <p><b>Encadrant :</b> {stage.nomEncadrant || 'Non assigné'}</p>
                    <p><b>Période :</b> {stage.dateDebut} / {stage.dateFin}</p>
                    <p><b>Statut :</b> <span style={{ color: '#3498db', fontWeight: 'bold' }}>{stage.statut}</span></p>
                </div>

                <div className="card">
                    <h3>📊 Progression globale</h3>
                    <div className="progress-container">
                        <div className="progress">
                            <div className="progress-bar" style={{ width: `${progress.percent}%` }}></div>
                        </div>
                        <p style={{ fontWeight: 'bold', margin: '5px 0 0 0' }}>{progress.percent}% complété</p>
                        <p className="small">{progress.valid} sur {progress.total} objectifs validés par l'entreprise</p>
                    </div>
                </div>
            </div>

            {/* OBJECTIFS */}
            <div className="card" style={{ marginBottom: '25px' }}>
                <h3>🎯 Objectifs de stage</h3>
                {objectifs.length === 0 ? (
                    <p className="small">Aucun objectif défini pour le moment.</p>
                ) : (
                    objectifs.map((objectif) => {
                        let containerClass = "objectif todo";
                        let badgeClass = "badge-todo";
                        let badgeText = "❌ À faire";

                        if (objectif.statut === 'VALIDE' || objectif.statut === 'DONE') {
                            containerClass = "objectif done";
                            badgeClass = "badge-done";
                            badgeText = "✔ Validé par l'entreprise";
                        } else if (objectif.statut === 'EN_COURS' || objectif.statut === 'PROGRESSING') {
                            containerClass = "objectif progressing";
                            badgeClass = "badge-progressing";
                            badgeText = "⏳ En cours";
                        }

                        return (
                            <div key={objectif.id} className={containerClass}>
                                <div className="objectif-header">
                                    <div>
                                        <b style={{ fontSize: '16px' }}>{objectif.titre || objectif.description}</b>
                                        <div className="small">Dernière mise à jour : {objectif.dateMaj || 'Récemment'}</div>
                                    </div>
                                    <span className={`status-badge ${badgeClass}`}>{badgeText}</span>
                                </div>

                                {objectif.feedback && (
                                    <div className="feedback-box">
                                        💬 <b>Feedback :</b> {objectif.feedback}
                                    </div>
                                )}

                                {containerClass === "objectif progressing" && (
                                    <div className="actions">
                                        <button
                                            className="btn btn-action"
                                            onClick={() => handleMarquerAValider(objectif.id)}
                                        >
                                            ⚙️ Marquer comme "À valider"
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* LIVRABLES */}
            <div className="card">
                <h3>📄 Rapports & Livrables</h3>
                <div className="upload-zone" onClick={() => document.getElementById('file-upload').click()}>
                    <span style={{ fontSize: '24px' }}>📤</span>
                    <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', fontSize: '14px' }}>Déposer un nouveau livrable</p>
                    <p className="small">Formats acceptés : PDF, ZIP (Max 10Mo)</p>
                    <input
                        type="file"
                        id="file-upload"
                        style={{ display: 'none' }}
                        onChange={handleUploadRapport}
                    />
                </div>

                {rapports.length === 0 ? (
                    <p className="small">Aucun rapport déposé pour le moment.</p>
                ) : (
                    rapports.map((rapport) => (
                        <div key={rapport.id} className="rapport-item">
                            <div>
                                <b>{rapport.titre || `Rapport #${rapport.id}`}</b>
                                <div className="small">Déposé le {rapport.dateDepot}</div>
                                {rapport.statut === 'REJETE' && (
                                    <>
                                        <div className="small" style={{ marginTop: '5px', color: '#e74c3c', fontWeight: 'bold' }}>
                                            ❌ Rejeté - À corriger
                                        </div>
                                        {rapport.feedback && (
                                            <div className="feedback-box" style={{ marginTop: '5px', background: '#fff5f5', borderLeftColor: '#e74c3c' }}>
                                                ⚠️ Motif : {rapport.feedback}
                                            </div>
                                        )}
                                    </>
                                )}
                                {rapport.statut === 'VALIDE' && (
                                    <div className="small" style={{ marginTop: '5px', color: '#2ecc71', fontWeight: 'bold' }}>
                                        ✔️ Validé
                                    </div>
                                )}
                                {(rapport.statut === 'EN_ATTENTE' || !rapport.statut) && (
                                    <div className="small" style={{ marginTop: '5px', color: '#f39c12', fontWeight: 'bold' }}>
                                        ⏳ En attente de validation
                                    </div>
                                )}
                            </div>
                            <div>
                                <button
                                    className="btn btn-view"
                                    onClick={() => handleVoirFichier(rapport.id, rapport.fichierType)}>
                                    Voir le fichier
                                </button>
                                <button
                                    className="btn"
                                    style={{ marginLeft: '10px', backgroundColor: '#e74c3c', color: 'white' }}
                                    onClick={() => handleSupprimerRapport(rapport.id)}>
                                    🗑️ Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SuiviStage;