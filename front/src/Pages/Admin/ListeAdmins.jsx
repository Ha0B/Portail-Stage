import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import adminService from '../../Services/adminService';

const ListeAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const chargerAdmins = async () => {
            try {
                const data = await adminService.getAll();
                setAdmins(data);
            } catch (err) {
                console.error('Erreur lors du chargement des administrateurs :', err);
                setError('Impossible de charger la liste des administrateurs.');
            } finally {
                setLoading(false);
            }
        };

        chargerAdmins();
    }, []);

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2">Chargement des administrateurs...</p>
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
            <h2 className="mb-4">Liste des administrateurs</h2>
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
                        <th>Niveau d'accès</th>
                    </tr>
                    </thead>
                    <tbody>
                    {admins.map((admin) => (
                        <tr key={admin.id}>
                            <td>{admin.id}</td>
                            <td>{admin.nom}</td>
                            <td>{admin.prenom}</td>
                            <td>
                                <a href={`mailto:${admin.email}`}>{admin.email}</a>
                            </td>
                            <td>
                                <span className="badge bg-primary">{admin.role}</span>
                            </td>
                            <td>
                                {new Date(admin.dateCreation).toLocaleDateString('fr-FR')}
                            </td>
                            <td>
                                {admin.actif ? (
                                    <span className="badge bg-success">Actif</span>
                                ) : (
                                    <span className="badge bg-secondary">Inactif</span>
                                )}
                            </td>
                            <td>
                                <span className="badge bg-dark">{admin.niveauAcces}</span>
                            </td>
                        </tr>
                    ))}
                    {admins.length === 0 && (
                        <tr>
                            <td colSpan="8" className="text-center text-muted">
                                Aucun administrateur trouvé.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListeAdmins;