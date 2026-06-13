import React, { useState } from 'react';
import '../../Style/Offre/PostulerOffre.css';

export default function FormulaireCandidature() {
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        statut: '',
        nomEncadrant: '',
        nomEntreprise: '',
        conventionId: '',
        lettreMotivation: '',
        cv: null,
        etudiantId: ''
    });

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { id, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Validation des dates
        if (formData.dateDebut && formData.dateFin) {
            const debut = new Date(formData.dateDebut);
            const fin = new Date(formData.dateFin);
            if (fin < debut) {
                alert('Erreur : La date de fin doit être postérieure à la date de début.');
                setIsSubmitting(false);
                return;
            }
        }

        // Simulation d'envoi (remplacer par votre API)
        setTimeout(() => {
            console.log('Données du formulaire :', formData);
            setShowConfirmation(true);
            setIsSubmitting(false);
            
            // Masquer la confirmation après 5 secondes
            setTimeout(() => setShowConfirmation(false), 5000);
        }, 1000);
    };

    const handleReset = () => {
        setFormData({
            titre: '',
            description: '',
            dateDebut: '',
            dateFin: '',
            statut: '',
            nomEncadrant: '',
            nomEntreprise: '',
            conventionId: '',
            lettreMotivation: '',
            cv: null,
            etudiantId: ''
        });
        setShowConfirmation(false);
    };

    return (
        <div className="form-horizontal-container">
            <div className="card-horizontal">
                <div className="card-header-horizontal">
                    <h2>
                        <i className="fas fa-graduation-cap"></i> Formulaire de candidature
                    </h2>
                    <p>Veuillez remplir tous les champs obligatoires pour soumettre votre candidature</p>
                </div>

                <div className="card-body-horizontal">
                    {showConfirmation && (
                        <div className="alert-horizontal alert-success-horizontal" style={{ marginBottom: '25px' }}>
                            <i className="fas fa-check-circle" style={{ marginRight: '10px' }}></i>
                            Votre candidature a été soumise avec succès !
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Section Informations du Stage */}
                        <div className="form-section">
                            <div className="form-section-title">
                                <div className="section-icon">
                                    <i className="fas fa-briefcase"></i>
                                </div>
                                Informations du stage
                            </div>

                            <div className="grid-2">
                                <div className="form-group-horizontal">
                                    <label htmlFor="titre" className="form-label-horizontal">
                                        Titre du stage <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="titre"
                                        className="form-control-horizontal"
                                        placeholder="Ex: Développeur Full Stack"
                                        value={formData.titre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group-horizontal">
                                    <label htmlFor="statut" className="form-label-horizontal">
                                        Statut <span className="required">*</span>
                                    </label>
                                    <select
                                        id="statut"
                                        className="form-control-horizontal"
                                        value={formData.statut}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Sélectionner un statut</option>
                                        <option value="EN_ATTENTE">En attente</option>
                                        <option value="VALIDE">Validé</option>
                                        <option value="REJETE">Rejeté</option>
                                        <option value="TERMINE">Terminé</option>
                                        <option value="ANNULE">Annulé</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group-full">
                                <label htmlFor="description" className="form-label-horizontal">
                                    Description <span className="required">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    className="form-control-horizontal"
                                    rows="4"
                                    placeholder="Décrivez les missions et objectifs du stage..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid-2">
                                <div className="form-group-horizontal">
                                    <label htmlFor="dateDebut" className="form-label-horizontal">
                                        Date de début <span className="required">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="dateDebut"
                                        className="form-control-horizontal"
                                        value={formData.dateDebut}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group-horizontal">
                                    <label htmlFor="dateFin" className="form-label-horizontal">
                                        Date de fin <span className="required">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="dateFin"
                                        className="form-control-horizontal"
                                        value={formData.dateFin}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section Informations Entreprise */}
                        <div className="form-section">
                            <div className="form-section-title">
                                <div className="section-icon">
                                    <i className="fas fa-building"></i>
                                </div>
                                Informations entreprise
                            </div>

                            <div className="grid-2">
                                <div className="form-group-horizontal">
                                    <label htmlFor="nomEntreprise" className="form-label-horizontal">
                                        Nom de l'entreprise <span className="required">*</span>
                                    </label>
                                    <div className="input-icon-group">
                                        <i className="fas fa-building"></i>
                                        <input
                                            type="text"
                                            id="nomEntreprise"
                                            className="form-control-horizontal"
                                            placeholder="Nom de l'entreprise"
                                            value={formData.nomEntreprise}
                                            onChange={handleChange}
                                            style={{ paddingLeft: '40px' }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group-horizontal">
                                    <label htmlFor="conventionId" className="form-label-horizontal">
                                        N° Convention
                                    </label>
                                    <input
                                        type="text"
                                        id="conventionId"
                                        className="form-control-horizontal"
                                        placeholder="Numéro de convention"
                                        value={formData.conventionId}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group-full">
                                <label htmlFor="nomEncadrant" className="form-label-horizontal">
                                    Nom de l'encadrant <span className="required">*</span>
                                </label>
                                <div className="input-icon-group">
                                    <i className="fas fa-user-tie"></i>
                                    <input
                                        type="text"
                                        id="nomEncadrant"
                                        className="form-control-horizontal"
                                        placeholder="Nom et prénom de l'encadrant"
                                        value={formData.nomEncadrant}
                                        onChange={handleChange}
                                        style={{ paddingLeft: '40px' }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section Documents */}
                        <div className="form-section">
                            <div className="form-section-title">
                                <div className="section-icon">
                                    <i className="fas fa-file-alt"></i>
                                </div>
                                Documents & Candidature
                            </div>

                            <div className="form-group-full">
                                <label htmlFor="lettreMotivation" className="form-label-horizontal">
                                    Lettre de motivation <span className="required">*</span>
                                </label>
                                <textarea
                                    id="lettreMotivation"
                                    className="form-control-horizontal"
                                    rows="5"
                                    placeholder="Rédigez votre lettre de motivation..."
                                    value={formData.lettreMotivation}
                                    onChange={handleChange}
                                    required
                                />
                                <span className="text-muted">
                                    <i className="fas fa-info-circle"></i> Décrivez vos motivations et vos compétences
                                </span>
                            </div>

                            <div className="form-group-full">
                                <label htmlFor="cv" className="form-label-horizontal">
                                    CV <span className="required">*</span>
                                </label>
                                <input
                                    type="file"
                                    id="cv"
                                    className="form-control-horizontal"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="text-muted">
                                    <i className="fas fa-cloud-upload-alt"></i> Formats acceptés: PDF, DOC, DOCX (max 5MB)
                                </span>
                            </div>

                            <div className="form-group-full">
                                <label htmlFor="etudiantId" className="form-label-horizontal">
                                    ID Étudiant <span className="required">*</span>
                                </label>
                                <div className="input-icon-group">
                                    <i className="fas fa-id-card"></i>
                                    <input
                                        type="text"
                                        id="etudiantId"
                                        className="form-control-horizontal"
                                        placeholder="Numéro d'étudiant"
                                        value={formData.etudiantId}
                                        onChange={handleChange}
                                        style={{ paddingLeft: '40px' }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section Conditions */}
                        <div className="form-section">
                            <div className="form-check" style={{ marginBottom: '10px' }}>
                                <input type="checkbox" className="form-check-input" id="conditions" required />
                                <label className="form-check-label" htmlFor="conditions">
                                    Je certifie que les informations fournies sont exactes et complètes
                                </label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="newsletter" />
                                <label className="form-check-label" htmlFor="newsletter">
                                    Je souhaite recevoir des offres similaires par email
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="form-actions">
                            <button type="button" className="btn-horizontal btn-secondary-horizontal" onClick={handleReset}>
                                <i className="fas fa-redo-alt"></i> Réinitialiser
                            </button>
                            <button type="submit" className="btn-horizontal btn-primary-horizontal" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane"></i> Soumettre la candidature
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}