import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ← Ajout
import Button from '../../Componentes/Button';
import '../../Style/Convention/ListeConvention.css';
import conventionService from '../../Services/conventionService';

const ListeConvention = () => {
    const navigate = useNavigate(); 
    const [conventions, setConventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchConventions();
    }, []);

    const fetchConventions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await conventionService.getAll();
            const conventionsList = Array.isArray(data) ? data : data?.content || [];
            setConventions(conventionsList);
        } catch (err) {
            console.error(err);
            setError("Impossible de charger les conventions. Vérifiez l'API.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = async (conventionId, sujet) => {
        if (!conventionId) return;
        try {
            const blob = await conventionService.generatePdf(conventionId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const cleanSujet = (sujet || 'convention').replace(/[^a-z0-9]/gi, '_').substring(0, 40);
            link.download = `convention_${conventionId}_${cleanSujet}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erreur lors du téléchargement PDF :", error);
            alert("Impossible de générer le PDF. Veuillez réessayer.");
        }
    };

    // Redirection vers la page de signature
    const handleSign = (conventionId) => {
        navigate(`../conventions/signature/${conventionId}`);
    };

    const renderStatutBadge = (statut) => {
        const mapping = {
            'EN_ATTENTE': { label: 'En attente', class: 'badge-attente' },
            'VALIDE': { label: 'Validée', class: 'badge-valide' },
            'REJETEE': { label: 'Rejetée', class: 'badge-rejetee' },
            'EN_COURS': { label: 'En cours', class: 'badge-encours' },
            'TERMINEE': { label: 'Terminée', class: 'badge-terminee' }
        };
        const upperStatut = statut?.toUpperCase() || '';
        const { label, class: className } = mapping[upperStatut] || { label: statut || 'Indéfini', class: 'badge-default' };
        return <span className={`badge-status ${className}`}>{label}</span>;
    };

    const formatDate = (dateStr) => dateStr || '—';

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p>Chargement des conventions...</p>
            </div>
        );
    }

    return (
        <div className="convention-table-container">
            <div className="table-header">
                <h2><i className="bi bi-file-text-fill"></i> Conventions de stage</h2>
                <Button text="Rafraîchir" type="secondary" onClick={fetchConventions} />
            </div>

            {error && <div className="alert alert-warning">{error} (affichage de données de démonstration)</div>}

            <div className="table-responsive">
                <table className="table convention-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date début</th>
                            <th>Date fin</th>
                            <th>Date création</th>
                            <th>Sujet du stage</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conventions.length === 0 ? (
                            <tr className="empty-row">
                                <td colSpan="7">Aucune convention trouvée</td>
                            </tr>
                        ) : (
                            conventions.map((conv) => (
                                <tr key={conv.id}>
                                    <td className="fw-semibold">{conv.id}</td>
                                    <td>{formatDate(conv.dateDebut)}</td>
                                    <td>{formatDate(conv.dateFin)}</td>
                                    <td>{formatDate(conv.dateCreation)}</td>
                                    <td className="sujet-cell">{conv.sujetStage || '—'}</td>
                                    <td>{renderStatutBadge(conv.statut)}</td>
                                    <td className="action-cell">
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Button
                                                text="PDF"
                                                type="danger"
                                                onClick={() => handleDownloadPdf(conv.id, conv.sujetStage)}
                                            />
                                            <Button
                                                text="Signer"
                                                type="primary"
                                                onClick={() => handleSign(conv.id)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListeConvention;