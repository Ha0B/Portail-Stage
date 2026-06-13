import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import encadrantService from '../../Services/encadrantService';

const ListeEncadrants = () => {
    const [encadrants, setEncadrants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const chargerEncadrants = async () => {
            try {
                const data = await encadrantService.getAll();
                setEncadrants(data);
            } catch (err) {
                console.error('Erreur lors du chargement des encadrants :', err);
                setError('Impossible de charger la liste des encadrants.');
            } finally {
                setLoading(false);
            }
        };

        chargerEncadrants();
    }, []);

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2">Chargement des encadrants...</p>
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
            <h2 className="mb-4">Liste des encadrants</h2>
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
                        <th>Poste</th>
                        <th>Département</th>
                        <th>Téléphone</th>
                    </tr>
                    </thead>
                    <tbody>
                    {encadrants.map((encadrant) => (
                        <tr key={encadrant.id}>
                            <td>{encadrant.id}</td>
                            <td>{encadrant.nom}</td>
                            <td>{encadrant.prenom}</td>
                            <td>
                                <a href={`mailto:${encadrant.email}`}>{encadrant.email}</a>
                            </td>
                            <td>
                                <span className="badge bg-primary">{encadrant.role}</span>
                            </td>
                            <td>
                                {new Date(encadrant.dateCreation).toLocaleDateString('fr-FR')}
                            </td>
                            <td>
                                {encadrant.actif ? (
                                    <span className="badge bg-success">Actif</span>
                                ) : (
                                    <span className="badge bg-secondary">Inactif</span>
                                )}
                            </td>
                            <td>{encadrant.poste || <span className="text-muted">—</span>}</td>
                            <td>{encadrant.departement || <span className="text-muted">—</span>}</td>
                            <td>
                                {encadrant.telephone ? (
                                    <a href={`tel:${encadrant.telephone}`}>{encadrant.telephone}</a>
                                ) : (
                                    <span className="text-muted">—</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    {encadrants.length === 0 && (
                        <tr>
                            <td colSpan="10" className="text-center text-muted">
                                Aucun encadrant trouvé.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListeEncadrants;