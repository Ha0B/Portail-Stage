import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../Style/Candidature/CandidatureForm.css';
import Icon, { Icons } from '../../Componentes/Icon';
import candidatureService from '../../Services/candidatureService';
import authService from '../../Services/authService';

export default function CandidatureForm() {
    const { idOffre, idCandidature } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const user = authService.getCurrentUser();

    // Mode édition : vrai si un idCandidature est présent (ou si le state contient une candidature)
    const candidatureFromState = location.state?.candidature;
    const isEditMode = !!(candidatureFromState || idCandidature);

    // Initialisation du formulaire
    const [formData, setFormData] = useState({
        lettreMotivation: candidatureFromState?.lettreMotivation || '',
        cvNom: candidatureFromState?.cvNom || '',
        idEtudiant: user?.etudiantId || user?.id,
        idOffre: idOffre || candidatureFromState?.idOffre || '',
    });
    const [cvFile, setCvFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    // Si on est en édition mais qu'aucune candidature n'est dans le state,
    // on ne peut pas récupérer les données → afficher message + bouton retour
    if (isEditMode && !candidatureFromState) {
        return (
            <div className="form-card fade-up">
                <div className="alert alert-danger">
                    Impossible de charger la candidature (données manquantes).
                    <br />
                    <button
                        className="btn btn-primary mt-2"
                        onClick={() => navigate('/etudiant/candidatures')}
                    >
                        Retour à mes candidatures
                    </button>
                </div>
            </div>
        );
    }

    // Gestion fichier CV (uniquement pour la création)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCvFile(file);
            setFormData((prev) => ({ ...prev, cvNom: file.name }));
        }
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        const texteBrut = formData.lettreMotivation.replace(/<[^>]*>/g, '').trim();

        // Validations communes
        if (!texteBrut) {
            setMessage({ type: 'error', text: 'La lettre de motivation est obligatoire.' });
            return;
        }
        if (!formData.idEtudiant) {
            setMessage({ type: 'error', text: 'Utilisateur non identifié.' });
            return;
        }

        // CORRECTION ICI : Validations exclusives au mode CRÉATION
        if (!isEditMode && !formData.idOffre) {
            setMessage({ type: 'error', text: 'Offre non trouvée.' });
            return;
        }
        if (!isEditMode && !cvFile && !formData.cvNom) {
            setMessage({ type: 'error', text: 'Veuillez sélectionner un CV.' });
            return;
        }

        try {
            setIsSubmitting(true);
            setMessage(null);

            if (isEditMode) {
                // MODIFICATION (JSON)
                const updatePayload = {
                    lettreMotivation: formData.lettreMotivation,
                };
                await candidatureService.update(
                    candidatureFromState.id || idCandidature,
                    updatePayload
                );
                setMessage({ type: 'success', text: 'Candidature modifiée avec succès.' });
            } else {
                // CRÉATION (MULTIPART)
                const multipartData = new FormData();
                multipartData.append('file', cvFile);
                multipartData.append(
                    'candidatureInput',
                    new Blob(
                        [
                            JSON.stringify({
                                lettreMotivation: formData.lettreMotivation,
                                idEtudiant: Number(formData.idEtudiant),
                                idOffre: Number(formData.idOffre),
                            }),
                        ],
                        { type: 'application/json' }
                    )
                );
                await candidatureService.create(multipartData);
                setMessage({ type: 'success', text: 'Candidature envoyée avec succès.' });
            }

            setTimeout(() => navigate(-1), 1500);
        } catch (error) {
            console.error(error);
            setMessage({
                type: 'error',
                text: error?.response?.data?.message || "Erreur lors de l'opération.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Affichage si aucune offre (création sans idOffre ni candidature)
    if (!formData.idOffre && !isEditMode) {
        return (
            <div className="form-card fade-up">
                <div className="alert alert-danger">
                    Offre non spécifiée.
                    <br />
                    <button
                        className="btn btn-primary mt-2"
                        onClick={() => navigate('/etudiant/offres')}
                    >
                        Retour aux offres
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="form-card fade-up">
            <div className="form-header">
                <h2 className="form-title">
                    {isEditMode ? 'Modifier ma candidature' : 'Envoyer une candidature'}
                </h2>
            </div>

            {message && (
                <div className={`alert alert-${message.type}`}>{message.text}</div>
            )}

            <form onSubmit={handleSubmit} className="custom-form">
                <input type="hidden" value={formData.idOffre} name="idOffre" />

                {/* Champ CV */}
                <div className="form-group">
                    <label className="form-label">Curriculum Vitae (PDF, DOC, DOCX)</label>
                    {isEditMode ? (
                        <div className="file-upload-ui">
                            <Icon d={Icons.file} size={20} />
                            <span>{formData.cvNom || 'Aucun CV'}</span>
                            <small className="text-muted"> (modification du CV non autorisée)</small>
                        </div>
                    ) : (
                        <div className="file-upload-wrapper">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="file-input"
                                onChange={handleFileChange}
                                required={!formData.cvNom}
                            />
                            <div className="file-upload-ui">
                                <Icon d={Icons.file} size={20} />
                                <span>
                                    {cvFile ? cvFile.name : formData.cvNom || 'Sélectionner un fichier'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Lettre de motivation */}
                <div className="form-group">
                    <label className="form-label">Lettre de motivation</label>
                    <textarea
                        className="form-control"
                        rows={8}
                        value={formData.lettreMotivation}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                lettreMotivation: e.target.value,
                            }))
                        }
                        placeholder="Rédigez votre lettre de motivation..."
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => navigate(-1)}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? 'Envoi en cours...'
                            : isEditMode
                                ? 'Enregistrer les modifications'
                                : 'Envoyer ma candidature'}
                    </button>
                </div>
            </form>
        </div>
    );
}