import React, { useState, useEffect } from 'react';
import '../../Style/Etudiant/ListerEtudiant.css';
import etudiantService from "../../Services/etudiantService";
import stageService from "../../Services/stageService";
import authService from "../../Services/authService";

export default function ListerEtudiant({ etudiants: propEtudiants = [], onModifier, onSupprimer }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedEtudiant, setSelectedEtudiant] = useState(null);
    const [etudiants, setEtudiants] = useState(propEtudiants);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
        if (propEtudiants.length === 0) {
            chargerEtudiants();
        }
    }, []);
    console.log('Etudiants chargés :', etudiants);

    const chargerEtudiants = async () => {
        try {
            setLoading(true);
            const currentUser = authService.getCurrentUser();
            let data = await etudiantService.getAll();
            let filteredEtudiants = data;

            if (currentUser && currentUser.role && currentUser.role.includes('ENCADRANT')) {
                try {
                    filteredEtudiants = await stageService.getEtudiantByEncadrant(currentUser.id);
                } catch (innerError) {
                    console.warn('Impossible de charger les étudiants par encadrant; fallback sur le filtre local', innerError);
                    filteredEtudiants = data.filter((etudiant) =>
                        etudiant.encadrant?.id && String(etudiant.encadrant.id) === String(currentUser.id)
                    );
                }
            }

            setEtudiants(filteredEtudiants || []);
        } catch (error) {
            console.error('Erreur lors du chargement des étudiants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModifier = (etudiant) => {
        if (onModifier) onModifier(etudiant);
        else alert(`Modifier : ${etudiant.prenom} ${etudiant.nom}`);
    };

    const handleSupprimerClick = (etudiant) => {
        setSelectedEtudiant(etudiant);
        setShowConfirmModal(true);
    };

    const handleSupprimerConfirm = async () => {
        if (onSupprimer) await onSupprimer(selectedEtudiant.id);
        else alert(`Supprimer : ${selectedEtudiant.prenom} ${selectedEtudiant.nom}`);
        
        setShowConfirmModal(false);
        setSelectedEtudiant(null);
        await chargerEtudiants();
    };

    const handleSupprimerAnnuler = () => {
        setShowConfirmModal(false);
        setSelectedEtudiant(null);
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p>Chargement des étudiants...</p>
            </div>
        );
    }

    return (
        <>
            <div className="lister-etudiant-container">
                <div className="table-responsive">
                    <table className="table table-hover table-bordered align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Date création</th>
                                <th>N° Étudiant</th>
                                <th>Filière</th>
                                <th>Niveau</th>
                                <th>Promotion</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {etudiants.length > 0 ? (
                                etudiants.map((etudiant) => (
                                    <tr key={etudiant.id}>
                                                <td>{etudiant.id}</td>
                                        <td>{etudiant.nom}</td>
                                        <td>{etudiant.prenom}</td>
                                        <td>{etudiant.email}</td>
                                        <td>{etudiant.role || 'N/A'}</td>
                                        <td>{etudiant.dateCreation || 'Non renseignée'}</td>
                                        <td>{etudiant.numeroEtudiant}</td>
                                        <td>{etudiant.filiere}</td>
                                        <td>{etudiant.niveau}</td>
                                        <td>{etudiant.promotion}</td>
                                        <td>
                                            <span className={`badge ${etudiant.actif ? 'bg-success' : 'bg-danger'}`}>
                                                {etudiant.actif ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="12" className="text-center">Aucun étudiant disponible</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}