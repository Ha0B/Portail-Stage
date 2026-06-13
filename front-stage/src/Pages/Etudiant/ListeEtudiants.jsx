import React, { useState, useEffect } from 'react';
import etudiantService from '../../Services/etudiantService';

const ListeEtudiants = () => {
    const [etudiants, setEtudiants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const chargerEtudiants = async () => {
            try {
                const data = await etudiantService.getAll();
                setEtudiants(data);
            } catch (err) {
                console.error('Erreur lors du chargement des étudiants :', err);
                setError('Impossible de charger la liste des étudiants.');
            } finally {
                setLoading(false);
            }
        };

        chargerEtudiants();
    }, []);

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2">Chargement des étudiants...</p>
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
            <h2 className="mb-4">Liste des étudiants</h2>
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table">
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Date création</th>
                        <th>Actif</th>
                        <th>N° Étudiant</th>
                        <th>Filière</th>
                        <th>Niveau</th>
                        <th>Promotion</th>
                        <th>CV</th>
                        <th>Lettre motivation</th>
                        <th>Candidatures</th>
                        <th>Stages</th>
                    </tr>
                    </thead>
                    <tbody>
                    {etudiants.map((etudiant) => (
                        <tr key={etudiant.id}>
                            <td>{etudiant.id}</td>
                            <td>{etudiant.nom}</td>
                            <td>{etudiant.prenom}</td>
                            <td>
                                <a href={`mailto:${etudiant.email}`}>{etudiant.email}</a>
                            </td>
                            <td>
                                <span className="badge bg-primary">{etudiant.role}</span>
                            </td>
                            <td>
                                {new Date(etudiant.dateCreation).toLocaleDateString('fr-FR')}
                            </td>
                            <td>
                                {etudiant.actif ? (
                                    <span className="badge bg-success">Actif</span>
                                ) : (
                                    <span className="badge bg-secondary">Inactif</span>
                                )}
                            </td>
                            <td>{etudiant.numeroEtudiant}</td>
                            <td>{etudiant.filiere}</td>
                            <td>{etudiant.niveau}</td>
                            <td>{etudiant.promotion}</td>
                            <td>
                                {etudiant.cv ? (
                                    <a href={etudiant.cv} target="_blank" rel="noopener noreferrer">
                                        Voir CV
                                    </a>
                                ) : (
                                    <span className="text-muted">Aucun</span>
                                )}
                            </td>
                            <td>
                                {etudiant.lettreMotivation ? (
                                    <a href={etudiant.lettreMotivation} target="_blank" rel="noopener noreferrer">
                                        Voir LM
                                    </a>
                                ) : (
                                    <span className="text-muted">Aucune</span>
                                )}
                            </td>
                            <td>
                  <span className="badge bg-info">
                    {etudiant.idCandidatures?.length ?? 0}
                  </span>
                            </td>
                            <td>
                  <span className="badge bg-warning text-dark">
                    {etudiant.idStages?.length ?? 0}
                  </span>
                            </td>
                        </tr>
                    ))}
                    {etudiants.length === 0 && (
                        <tr>
                            <td colSpan="15" className="text-center text-muted">
                                Aucun étudiant trouvé.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListeEtudiants;