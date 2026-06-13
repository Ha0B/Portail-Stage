import React, { useState, useEffect } from 'react';
import '../../Style/Objectif/ModifierObjectif.css';
import objectifService from '../../Services/objectifService';
import { useParams } from 'react-router-dom';

const ModifierObjectif = ({ onSuccess, onCancel }) => {
  const { id } = useParams();
  const objectifId = id;
  const [formData, setFormData] = useState({
    description: '',
    priorite: '',
  });
  const [originalDate, setOriginalDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchObjectif = async () => {
      try {
        const data = await objectifService.getById(objectifId);
        setFormData({
          description: data.description || '',
          priorite: data.priorite || 'MOYENNE',
        });
        setOriginalDate(data.dateEcheance);
      } catch (error) {
        console.error(error);
        showNotification("Impossible de charger l'objectif.", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchObjectif();
  }, [objectifId]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      showNotification("La description est obligatoire.", "danger");
      return;
    }

    const payload = {
      description: formData.description.trim(),
      statut: formData.statut,
      priorite: formData.priorite,
    };

    setSaving(true);
    try {
      await objectifService.update(objectifId, payload);
      showNotification("Objectif modifié avec succès !", "success");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Erreur lors de la mise à jour.", "danger");
    } finally {
      setSaving(false);
    }
  };

  const getPayloadPreview = () => ({
    description: formData.description || "",
    statut: formData.statut,
    priorite: formData.priorite,
  });

  if (loading) {
    return (
      <div className="edit-objective-container">
        <div className="card-custom">
          <div className="card-header-custom">Modifier l'objectif</div>
          <div className="loading-spinner">Chargement des données...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-objective-container">
      <div className="card-custom">
        <div className="card-header-custom">
          <i className="fas fa-edit me-2"></i> Modifier l'objectif
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

            {originalDate && (
              <div className="mb-3">
                <label className="form-label">Date d'échéance (lecture seule)</label>
                <input type="text" className="form-control" value={originalDate} disabled />
                <small className="text-muted">La date ne peut pas être modifiée.</small>
              </div>
            )}

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
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
              {onCancel && (
                <button type="button" className="btn btn-cancel" onClick={onCancel}>
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

export default ModifierObjectif;