// AjouterSoutenance.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import soutenanceService from '../../Services/soutenanceService';

const AjouterSoutenance = () => {
    const navigate = useNavigate();
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        const formData = new FormData(e.target);
        const data = {
            date: formData.get('date'),
            heure: formData.get('heure'),
            salle: formData.get('salle'),
            duree: parseInt(formData.get('duree'), 10),
            idStage: parseInt(formData.get('idStage'), 10),
        };

        try {
            await soutenanceService.create(data);
            alert('Soutenance créée avec succès.');
            navigate('/admin/soutenances'); // Retour à la liste admin
        } catch (err) {
            alert('Erreur lors de la création.');
            console.error(err);
        } finally {
            setSending(false);
            console.log(data);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Nouvelle soutenance</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Date (JJ-MM-AAAA)</label>
                    <input
                        type="text"
                        className="form-control"
                        name="date"
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
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Durée (minutes)</label>
                    <input
                        type="number"
                        className="form-control"
                        name="duree"
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
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={sending}>
                    {sending ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate('/admin/soutenances')}
                >
                    Annuler
                </button>
            </form>
        </div>
    );
};

export default AjouterSoutenance;