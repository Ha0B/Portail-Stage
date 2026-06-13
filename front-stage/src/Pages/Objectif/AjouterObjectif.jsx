import React, { useState } from 'react';
import '../../Style/Objectif/AjouterObjectif.css';
import objectifService from '../../Services/objectifService';
import { useParams ,useNavigate} from 'react-router-dom';

const AjouterObjectif = ({ onSuccess, onCancel }) => {
    const params = useParams() ;
    const navigate = useNavigate();
    const stageId = params.stageId || params.id;  
    const [formData, setFormData] = useState({
        description: '',
        dateEcheance: '',
        statut: 'NON_COMMENCE',
        priorite: 'MOYENNE',
    });
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isValidDateDDMMYYYY = (dateStr) => {
        if (!dateStr) return true;
        const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
        if (!regex.test(dateStr)) return false;
        const day = parseInt(dateStr.split('-')[0], 10);
        const month = parseInt(dateStr.split('-')[1], 10);
        const year = parseInt(dateStr.split('-')[2], 10);
        if (month < 1 || month > 12) return false;
        const daysInMonth = new Date(year, month, 0).getDate();
        return day >= 1 && day <= daysInMonth;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.description.trim()) {
        showNotification("La description est obligatoire.", "danger");
        return;
        }
        if (formData.dateEcheance && !isValidDateDDMMYYYY(formData.dateEcheance)) {
        showNotification("Format date invalide (JJ-MM-AAAA).", "danger");
        return;
        }

        const payload = {
        description: formData.description.trim(),
        dateEcheance: formData.dateEcheance || null,
        statut: formData.statut,
        priorite: formData.priorite,
        idStage: stageId,
        };

        setSaving(true);
        try {
        await objectifService.create(payload);   // ✅ appel correct
        showNotification("Objectif ajouté avec succès !", "success");
        setFormData({
            description: '',
            dateEcheance: '',
            statut: 'NON_COMMENCE',
            priorite: 'MOYENNE',
            
        });
        
        if (onSuccess) onSuccess();
        } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || "Erreur lors de l'ajout";
        showNotification(errorMsg, "danger");
        } finally {
        setSaving(false);
        }
    };

    return (
        <div className="add-objective-container">
        <div className="card-custom">
            <div className="card-header-custom">
            <i className="fas fa-tasks me-2"></i> Ajouter un objectif
            </div>
            <div className="card-body-custom">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                <label htmlFor="description" className="form-label required">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="mb-3">
                <label htmlFor="dateEcheance" className="form-label">Date d'échéance</label>
                <input
                    type="text"
                    className="form-control"
                    id="dateEcheance"
                    name="dateEcheance"
                    placeholder="JJ-MM-AAAA (ex: 15-08-2026)"
                    value={formData.dateEcheance}
                    onChange={handleChange}
                />
                <small className="text-muted">Format : jour-mois-année (optionnel)</small>
                </div>

                <div className="mb-3">
                </div>

                <div className="mb-3">
                <label htmlFor="priorite" className="form-label">Priorité</label>
                <select
                    className="form-select"
                    id="priorite"
                    name="priorite"
                    value={formData.priorite}
                    onChange={handleChange}
                >
                    <option value="BASSE">Basse</option>
                    <option value="MOYENNE">Moyenne</option>
                    <option value="HAUTE">Haute</option>
                    <option value="CRITIQUE">Critique</option>
                </select>
                </div>

                <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-submit" disabled={saving}>
                    {saving ? 'Ajout en cours...' : 'Ajouter l\'objectif'}
                </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                        Retour
                    </button>
                    {onCancel && (
                        <button type="button" className="btn btn-reset" onClick={onCancel}>
                            Annuler
                        </button>
                    )}
                </div>
            </form>
            </div>
        </div>

        {notification && (
            <div className={`alert alert-${notification.type} alert-fixed`}>
            <strong>{notification.type === 'success' ? '✓ Succès' : '⚠️ Erreur'}</strong> {notification.message}
            </div>
        )}
        </div>
    );
};

export default AjouterObjectif;