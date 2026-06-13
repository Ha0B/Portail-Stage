import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import soutenanceService from '../../Services/soutenanceService';
import rubriqueService from '../../Services/rubriqueService';
import noteService from '../../Services/noteService';
import authService from '../../Services/authService';
import stageService from '../../Services/stageService';

const SaisieNotesJury = () => {
    const { id: soutenanceId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [soutenance, setSoutenance] = useState(null);
    const [stage, setStage] = useState(null);
    const [rubriques, setRubriques] = useState([]);
    const [notes, setNotes] = useState({});
    const [appreciation, setAppreciation] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [juryId, setJuryId] = useState(null);

    useEffect(() => {
        if (!soutenanceId || isNaN(Number(soutenanceId))) {
            setError("Identifiant de soutenance invalide.");
            setLoading(false);
            return;
        }
        chargerDonnees();
    }, [soutenanceId]);

    const chargerDonnees = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Charger la soutenance
            const sout = await soutenanceService.getById(soutenanceId);
            setSoutenance(sout);

            // 2. ⚠️ CHARGER LE STAGE GRÂCE À idStage
            if (sout.idStage) {
                const stg = await stageService.getById(sout.idStage);
                setStage(stg);
            }

            // 3. Gérer le juryId
            const currentUser = authService.getCurrentUser();

            if (sout.membresJury) {
                const monJury = sout.membresJury.find(j => j.encadrant?.id === currentUser.id);
                if (monJury) setJuryId(monJury.id);
            } else {
                // ⚠️ SOLUTION DE SECOURS (car ton API ne renvoie pas membresJury)
                // On force l'ID à 1 pour que tu puisses tester l'insertion en base de données
                console.warn("L'API ne renvoie pas 'membresJury'. Utilisation de l'ID Jury = 1 par défaut pour tester.");
                setJuryId(1);
            }

            // 4. Charger les rubriques
            const rubs = await rubriqueService.getAll();
            setRubriques(rubs);

            // 5. Initialiser les notes
            const init = {};
            rubs.forEach((r) => {
                init[r.id] = '';
            });
            setNotes(init);
        } catch (err) {
            console.error(err);
            setError('Impossible de charger les données de la soutenance.');
        } finally {
            setLoading(false);
        }
    };

    const handleNoteChange = (rubriqueId, value) => {
        setNotes((prev) => ({ ...prev, [rubriqueId]: value }));
    };

    const calculerMoyenne = () => {
        let totalCoeff = 0;
        let sommePonderee = 0;
        rubriques.forEach((r) => {
            const note = parseFloat(notes[r.id]);
            if (!isNaN(note) && note >= 0 && note <= r.noteMax) {
                sommePonderee += note * r.coefficient;
                totalCoeff += r.coefficient;
            }
        });
        return totalCoeff === 0 ? 0 : (sommePonderee / totalCoeff).toFixed(2);
    };

    const handleSave = async () => {
        if (!juryId) {
            alert("Erreur : Impossible de trouver votre identifiant de Jury.");
            return;
        }

        const saisiesValides = rubriques.every((r) => {
            const val = parseFloat(notes[r.id]);
            return !isNaN(val) && val >= 0 && val <= 20;
        });

        if (!saisiesValides) {
            alert("Veuillez saisir une note valide (entre 0 et 20) pour chaque rubrique.");
            return;
        }

        try {
            setSaving(true);
            const promesses = rubriques.map((r) => {
                const payload = {
                    valeur: parseFloat(notes[r.id]),
                    appreciation: appreciation,
                    idRubrique: r.id,
                    idJury: juryId,
                    idSoutenance: parseInt(soutenanceId, 10)
                };
                return noteService.ajouterNote(payload);
            });

            await Promise.all(promesses);

            setSuccess(true);
            setTimeout(() => navigate('/encadrant/monPlanning'), 1500);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement. Regardez la console (F12) pour plus de détails.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status" /><p>Chargement...</p></div>;
    if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
console.log(stage);
    return (
        <div className="container py-4">
            <h1 className="page-title mb-4">Évaluation de la Soutenance</h1>

            {/* Informations Étudiant & Stage */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Informations du Stage</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6 col-lg-3">
                            <div className="bg-light p-3 rounded">
                                <span className="text-muted">Étudiant</span>
                                <strong className="d-block text-dark">
                                    {stage?.nomEtudiant ? `${stage.prenomEtudiant} ${stage.nomEtudiant}` : 'Non renseigné'}
                                </strong>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="bg-light p-3 rounded">
                                <span className="text-muted">Entreprise</span>
                                <strong className="d-block text-dark">
                                    {stage?.nomEntreprise || 'Non renseignée'}
                                </strong>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6">
                            <div className="bg-light p-3 rounded">
                                <span className="text-muted">Sujet du stage</span>
                                <strong className="d-block text-dark">{stage?.titre || 'Non renseigné'}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grille de Notation */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Grille d'Évaluation</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="table-dark">
                            <tr>
                                <th>Rubrique</th>
                                <th>Coefficient</th>
                                <th>Note Max</th>
                                <th style={{ width: '150px' }}>Note / 20</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rubriques.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.intitule}</td>
                                    <td>{r.coefficient}</td>
                                    <td>{r.noteMax}</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            max="20"
                                            step="0.5"
                                            className="form-control text-center"
                                            value={notes[r.id]}
                                            onChange={(e) => handleNoteChange(r.id, e.target.value)}
                                            placeholder="0.0"
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Appréciation globale */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Appréciation Générale</h5>
                </div>
                <div className="card-body">
                    <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Saisissez vos remarques globales..."
                        value={appreciation}
                        onChange={(e) => setAppreciation(e.target.value)}
                    />
                </div>
            </div>

            {/* Résultat et Validation */}
            <div className="card shadow-sm border-0 bg-light">
                <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div className="px-4 py-2 border border-primary rounded bg-white shadow-sm">
                        <span className="text-muted fw-bold d-block mb-1">Moyenne Pondérée</span>
                        <h3 className="text-primary mb-0 m-0">{calculerMoyenne()} / 20</h3>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-secondary px-4" onClick={() => navigate(-1)} disabled={saving}>
                            Annuler
                        </button>
                        <button className="btn btn-success px-4" onClick={handleSave} disabled={saving || success || rubriques.length === 0}>
                            {saving ? 'Enregistrement...' : success ? 'Notes enregistrées !' : 'Valider les notes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaisieNotesJury;