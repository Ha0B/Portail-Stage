import React, { useState, useEffect } from 'react';
import soutenanceService from '../../Services/soutenanceService';
import stageService from '../../Services/stageService';
import noteService from '../../Services/noteService';
import juryService from '../../Services/juryService';
import encadrantService from '../../Services/encadrantService';
import authService from '../../Services/authService';
import '../../Style/Soutenance/MaSoutenance.css';
import { useNavigate } from 'react-router-dom';

const MesSoutenances = () => {
    const navigate = useNavigate();
    const [soutenances, setSoutenances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stageDetails, setStageDetails] = useState({});
    const [notesDetails, setNotesDetails] = useState({});
    const [juryDetails, setJuryDetails] = useState([]);

    const user = authService.getCurrentUser();
    const etudiantId = user?.etudiantId;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const soutenance = await soutenanceService.getSoutenancByEtudiant(etudiantId);
            if (!soutenance) {
                setSoutenances([]);
                setLoading(false);
                return;
            }
            setSoutenances([soutenance]);

            const promises = [];

            if (soutenance.idStage) {
                promises.push(
                    stageService.getById(soutenance.idStage)
                        .then(stage => setStageDetails({ [soutenance.idStage]: stage }))
                        .catch(e => console.error("Erreur stage", e))
                );
                promises.push(
                    noteService.getNotesParStage(soutenance.idStage)
                        .then(notes => setNotesDetails({ [soutenance.idStage]: notes }))
                        .catch(() => console.log("Aucune note disponible"))
                );
            }

            // Chargement des jurys PUIS enrichissement avec les noms des encadrants
            const loadJurys = async () => {
                try {
                    const jurys = await juryService.getBySoutenance(soutenance.id);
                    // Pour chaque jury on recupere l'encadrant si le nom n'est pas deja inclus
                    const jurysAvecNoms = await Promise.all(
                        jurys.map(async (jury) => {
                            let nomComplet = '';
                            if (jury.encadrant && jury.encadrant.nom) {
                                nomComplet = `${jury.encadrant.prenom} ${jury.encadrant.nom}`;
                            } else {
                                // Sinon on va chercher l'encadrant par son ID
                                try {
                                    const enc = await encadrantService.getById(jury.encadrantId);
                                    nomComplet = `${enc.prenom} ${enc.nom}`;
                                } catch (e) {
                                    nomComplet = `Encadrant #${jury.encadrantId}`;
                                }
                            }
                            return { ...jury, nomComplet };
                        })
                    );
                    setJuryDetails(jurysAvecNoms);
                } catch (e) {
                    console.error("Erreur jury", e);
                    setJuryDetails([]);
                }
            };

            promises.push(loadJurys());

            await Promise.allSettled(promises);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Impossible de charger les donnees.");
        } finally {
            setLoading(false);
        }
    };

    // Construction de l'affichage du jury
    const buildJuryDisplay = () => {
        if (!juryDetails?.length) {
            return {
                president: "Non renseigne",
                examinateurs: [],
                totalMembres: 0,
            };
        }

        const president = juryDetails.find(j => j.roleJury === "PRESIDENT");
        const examinateurs = juryDetails.filter(
            j => j.roleJury === "EXAMINATEUR" || j.roleJury === "INVITE"
        );

        return {
            president: president ? president.nomComplet : "Non renseigne",
            examinateurs: examinateurs.map(j => j.nomComplet),
            totalMembres: juryDetails.length,
        };
    };

    const renderStatusBadge = (statut) => {
        switch (statut) {
            case "PLANIFIEE":
                return <div className="badge-status planifiee"><i className="fas fa-clock"></i> Planifiee</div>;
            case "TERMINEE":
                return <div className="badge-status terminee"><i className="fas fa-check-circle"></i> Terminee</div>;
            case "ANNULEE":
                return <div className="badge-status annulee"><i className="fas fa-ban"></i> Annulee</div>;
            default:
                return null;
        }
    };

    if (loading) return <div className="loading-spinner">Chargement...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!soutenances.length) return <div className="no-data">Aucune soutenance trouvee.</div>;

    const soutenance = soutenances[0];
    const stage = stageDetails[soutenance.idStage] || {};
    const notes = notesDetails[soutenance.idStage] || {};
    const juryDisplay = buildJuryDisplay();

    const displayData = {
        sujet: stage.titre || "Titre non disponible",
        date: soutenance.date || "---",
        heure: soutenance.heure || "---",
        salle: soutenance.salle || "---",
        duree: soutenance.duree || "---",
        statut: soutenance.statut,
        jury: juryDisplay,
        stage: {
            titre: stage.titre || "",
            entreprise: stage.nomEntreprise || "Non renseignee",
            encadrantPedagogique: stage.nomEncadrant || "Non renseigne",
            dateDebut: stage.dateDebut || "",
            dateFin: stage.dateFin || ""
        },
        resultats: notes?.moyenne ? {
            moyenne: notes.moyenne,
            mention: notes.mention,
            rubriques: notes.rubriques || [],
            appreciation: notes.appreciation || ""
        } : null
    };

    return (
        <div className="container-soutenance">
            <div className="page-header">
                <h1><i className="fas fa-chalkboard-user"></i> Mes Soutenances</h1>
                <div className="student-badge">
                    <i className="fas fa-graduation-cap"></i> etudiant · Derniere soutenance
                </div>
            </div>

            <div className="soutenance-card">
                <div className="resume-section">
                    <div className="resume-title">
                        <span><i className="fas fa-microphone-alt"></i> Session de soutenance</span>
                        {renderStatusBadge(displayData.statut)}
                    </div>
                    <div className="resume-grid">
                        <div className="resume-item"><i className="fas fa-book-open"></i><span className="label">Sujet :</span><span className="value">{displayData.sujet}</span></div>
                        <div className="resume-item"><i className="far fa-calendar-alt"></i><span className="label">Date :</span><span className="value">{displayData.date}</span></div>
                        <div className="resume-item"><i className="far fa-clock"></i><span className="label">Heure :</span><span className="value">{displayData.heure}</span></div>
                        <div className="resume-item"><i className="fas fa-door-open"></i><span className="label">Salle :</span><span className="value">{displayData.salle}</span></div>
                        <div className="resume-item"><i className="fas fa-hourglass-half"></i><span className="label">Duree :</span><span className="value">{displayData.duree} min</span></div>
                    </div>
                </div>

                <div className="two-columns">
                    <div>
                        <div className="info-card">
                            <div className="card-header"><i className="fas fa-gavel"></i><h3>Membres du Jury</h3></div>
                            <div className="jury-list">
                                <div className="jury-row">
                                    <span className="jury-label"><i className="fas fa-user-tie"></i> President :</span>
                                    <span className="jury-names">{displayData.jury.president}</span>
                                </div>
                                <div className="jury-row">
                                    <span className="jury-label"><i className="fas fa-users"></i> Examinateurs :</span>
                                    <span className="jury-names">
                    {displayData.jury.examinateurs.length > 0
                        ? displayData.jury.examinateurs.join(', ')
                        : 'Aucun'}
                  </span>
                                </div>
                                <div className="jury-row">
                                    <span className="jury-label"><i className="fas fa-chalkboard"></i> Total membres :</span>
                                    <span className="total-badge">{displayData.jury.totalMembres}</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="card-header"><i className="fas fa-briefcase"></i><h3>Contexte stage</h3></div>
                            <div className="stage-details">
                                <p><span className="stage-label"><i className="fas fa-tag"></i> Titre :</span><span className="stage-value">{displayData.stage.titre}</span></p>
                                <p><span className="stage-label"><i className="fas fa-building"></i> Entreprise :</span><span className="stage-value">{displayData.stage.entreprise}</span></p>
                                <p><span className="stage-label"><i className="fas fa-chalkboard-user"></i> Encadrant pedagogique :</span><span className="stage-value">{displayData.stage.encadrantPedagogique}</span></p>
                                <p><span className="stage-label"><i className="fas fa-play-circle"></i> Debut :</span><span className="stage-value">{displayData.stage.dateDebut}</span></p>
                                <p><span className="stage-label"><i className="fas fa-flag-checkered"></i> Fin :</span><span className="stage-value">{displayData.stage.dateFin}</span></p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="documents-area">
                            <div className="doc-header"><i className="fas fa-folder-open"></i><h4>Documents officiels</h4></div>
                            <div className="buttons-group">
                                <button className="btn-download" onClick={() => alert("Telechargement rapport non disponible")}>
                                    <i className="fas fa-file-pdf"></i> Telecharger Rapport
                                </button>
                                <button className="btn-download" onClick={() => navigate("/etudiant/conventions")}>
                                    <i className="fas fa-file-signature"></i> Telecharger Convention
                                </button>
                            </div>
                            <div className="info-doc"><i className="fas fa-info-circle"></i> Les documents seront disponibles prochainement.</div>
                        </div>

                        {displayData.statut === "TERMINEE" && displayData.resultats ? (
                            <div className="results-area">
                                <div className="results-header"><i className="fas fa-chart-line"></i><h4>Resultats de la soutenance</h4></div>
                                <div className="average-mention">
                                    <span className="avg"><i className="fas fa-star-of-life"></i> Moyenne generale : <strong>{displayData.resultats.moyenne} / 20</strong></span>
                                    <span className="mention"><i className="fas fa-medal"></i> Mention : {displayData.resultats.mention}</span>
                                </div>
                                <table className="notes-table">
                                    <thead><tr><th>Rubrique d'evaluation</th><th>Note</th></tr></thead>
                                    <tbody>
                                    {displayData.resultats.rubriques.map((rub, idx) => (
                                        <tr key={idx}><td>{rub.nom}</td><td><span className="note-value">{rub.note} / 20</span></td></tr>
                                    ))}
                                    </tbody>
                                </table>
                                <div className="appreciation"><i className="fas fa-clipboard-list"></i> Appreciation : {displayData.resultats.appreciation}</div>
                            </div>
                        ) : (
                            <div className="info-waiting"><i className="fas fa-hourglass-half"></i> Les resultats seront disponibles apres la soutenance.</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="footer-note">
                <i className="fas fa-calendar-check"></i>{" "}
                {displayData.statut === "TERMINEE"
                    ? "Soutenance cloturee · Resultats definitifs"
                    : "Soutenance a venir · Restez informe"}
            </div>
        </div>
    );
};

export default MesSoutenances;