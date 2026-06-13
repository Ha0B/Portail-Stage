import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import entrepriseService from '../../Services/entrepriseService';

const ListeEntreprises = () => {
    const [entreprises, setEntreprises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const chargerEntreprises = async () => {
            try {
                const data = await entrepriseService.getAll();
                setEntreprises(data);
            } catch (err) {
                console.error('Erreur lors du chargement des entreprises :', err);
                setError('Impossible de charger la liste des entreprises.');
            } finally {
                setLoading(false);
            }
        };

        chargerEntreprises();
    }, []);

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2">Chargement des entreprises...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Liste des entreprises</h2>
            <div className="table-responsive">
                <table className="table table-striped  table-hover align-middle">
                    <thead className="table">
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Date création</th>
                        <th>Actif</th>
                        <th>Nom entreprise</th>
                        <th>Secteur activité</th>
                        <th>Adresse</th>
                        <th>Ville</th>
                        <th>Site Web</th>
                        <th>Téléphone</th>
                        <th>Description</th>
                        <th>Offres</th>
                    </tr>
                    </thead>
                    <tbody>
                    {entreprises.map((entreprise) => (
                        <tr key={entreprise.id}>
                            <td>{entreprise.id}</td>
                            <td>{entreprise.nom}</td>
                            <td>{entreprise.prenom}</td>
                            <td>
                                <a href={`mailto:${entreprise.email}`}>{entreprise.email}</a>
                            </td>
                            <td>
                                <span className="badge bg-primary">{entreprise.role}</span>
                            </td>
                            <td>
                                {new Date(entreprise.dateCreation).toLocaleDateString('fr-FR')}
                            </td>
                            <td>
                                {entreprise.actif ? (
                                    <span className="badge bg-success">Actif</span>
                                ) : (
                                    <span className="badge bg-secondary">Inactif</span>
                                )}
                            </td>
                            <td>{entreprise.nomEntreprise}</td>
                            <td>{entreprise.secteurActivite}</td>
                            <td>{entreprise.adresse}</td>
                            <td>{entreprise.ville}</td>
                            <td>
                                {entreprise.siteWeb ? (
                                    <a href={entreprise.siteWeb} target="_blank" rel="noopener noreferrer">
                                        {entreprise.siteWeb}
                                    </a>
                                ) : (
                                    <span className="text-muted">—</span>
                                )}
                            </td>
                            <td>
                                {entreprise.telephone ? (
                                    <a href={`tel:${entreprise.telephone}`}>{entreprise.telephone}</a>
                                ) : (
                                    <span className="text-muted">—</span>
                                )}
                            </td>
                            <td className="text-truncate" style={{ maxWidth: '200px' }} title={entreprise.description}>
                                {entreprise.description || <span className="text-muted">—</span>}
                            </td>
                            <td>
                  <span className="badge bg-info">
                    {entreprise.idOffres?.length ?? 0}
                  </span>
                            </td>
                        </tr>
                    ))}
                    {entreprises.length === 0 && (
                        <tr>
                            <td colSpan="15" className="text-center text-muted">
                                Aucune entreprise trouvée.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListeEntreprises;