import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import encadrantService from '../../Services/encadrantService';
import juryService from '../../Services/juryService';

const ROLES = ['PRESIDENT', 'EXAMINATEUR', 'INVITE'];

const AffecterJury = () => {
    const { id } = useParams(); // ID de la soutenance
    const navigate = useNavigate();

    const [encadrants, setEncadrants] = useState([]);          // Options pour react-select
    const [selected, setSelected] = useState([]);              // { encadrantId, label, role }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Chargement des encadrants
    useEffect(() => {
        const chargerEncadrants = async () => {
            try {
                const data = await encadrantService.getAll();
                const options = data.map(enc => ({
                    value: enc.id,
                    label: `${enc.prenom} ${enc.nom}`
                }));
                setEncadrants(options);
            } catch (err) {
                console.error('Erreur chargement encadrants', err);
                setError('Impossible de charger la liste des encadrants.');
            } finally {
                setLoading(false);
            }
        };
        chargerEncadrants();
    }, []);

    // Ajout / suppression d'encadrants via le Select
    const handleSelectionChange = (selectedOptions) => {
        if (!selectedOptions) {
            setSelected([]);
            return;
        }
        const updated = selectedOptions.map(opt => {
            const existing = selected.find(m => m.encadrantId === opt.value);
            return {
                encadrantId: opt.value,
                label: opt.label,
                role: existing ? existing.role : 'EXAMINATEUR' // rôle par défaut
            };
        });
        setSelected(updated);
    };

    // Changement de rôle d'un membre déjà sélectionné
    const handleRoleChange = (encadrantId, newRole) => {
        setSelected(prev =>
            prev.map(m => (m.encadrantId === encadrantId ? { ...m, role: newRole } : m))
        );
    };

    // Retirer un membre
    const handleRemoveMember = (encadrantId) => {
        setSelected(prev => prev.filter(m => m.encadrantId !== encadrantId));
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selected.length === 0) {
            setError('Veuillez sélectionner au moins un encadrant.');
            return;
        }
        // Vérifie que chaque membre a bien un rôle
        if (selected.some(m => !m.role)) {
            setError('Chaque membre du jury doit avoir un rôle.');
            return;
        }

        setSubmitLoading(true);
        setError(null);

        try {
            // Appel à l'API pour chaque membre
            const promesses = selected.map(m =>
                juryService.create({
                    soutenanceId: Number(id),      // ID de la soutenance
                    encadrantId: m.encadrantId,
                    roleJury: m.role
                })
            );
            await Promise.all(promesses);
            setSuccessMessage('Jury affecté avec succès !');
            setTimeout(() => navigate('/admin/soutenances'), 1500);
        } catch (err) {
            console.error('Erreur assignation', err);
            setError("Erreur lors de l'affectation du jury.");
        } finally {
            setSubmitLoading(false);
        }
    };

    // --- Rendu ---
    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p>Chargement des encadrants...</p>
            </div>
        );
    }

    if (error && encadrants.length === 0) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">{error}</div>
                <button className="btn btn-secondary" onClick={() => navigate('/admin/soutenances')}>
                    Retour à la liste
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>Affecter un jury à la soutenance #{id}</h2>
            <p className="text-muted">
                Recherchez et sélectionnez les encadrants, puis attribuez un rôle à chacun.
            </p>

            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="jury-select" className="form-label">
                        Encadrants
                    </label>
                    <Select
                        inputId="jury-select"
                        isMulti
                        options={encadrants}
                        value={selected.map(m => ({ value: m.encadrantId, label: m.label }))}
                        onChange={handleSelectionChange}
                        placeholder="Tapez un nom pour rechercher un encadrant..."
                        noOptionsMessage={() => "Aucun encadrant trouvé"}
                        isClearable
                        isSearchable
                    />
                </div>

                {selected.length > 0 && (
                    <div className="card p-3">
                        <h5>Rôles des membres du jury</h5>
                        {selected.map(m => (
                            <div key={m.encadrantId} className="row align-items-center mb-2">
                                <div className="col-md-6">
                                    <span>{m.label}</span>
                                </div>
                                <div className="col-md-4">
                                    <select
                                        className="form-select"
                                        value={m.role}
                                        onChange={(e) => handleRoleChange(m.encadrantId, e.target.value)}
                                    >
                                        {ROLES.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => handleRemoveMember(m.encadrantId)}
                                    >
                                        Retirer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-4">
                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={submitLoading || successMessage}
                    >
                        {submitLoading ? 'Enregistrement...' : "Valider l'affectation"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => navigate('/admin/soutenances')}
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AffecterJury;