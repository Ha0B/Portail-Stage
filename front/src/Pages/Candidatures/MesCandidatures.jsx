import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Style/Candidature/MesCandidatures.css';
import Icon, { Icons } from '../../Componentes/Icon';
import candidatureService from "../../Services/candidatureService";

export default function MesCandidatures() {
    const navigate = useNavigate();
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidatures = async () => {
            try {
                const id = localStorage.getItem("userId");
                if (id) {
                    const data = await candidatureService.getByIdEtudiant(id);
                    setCandidatures(data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des candidatures :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidatures();
    }, []);

    const handleModifier = (candidature) => {
        navigate(`/etudiant/modifierCandidature/${candidature.id}`, {
            state: { candidature }
        });
    };

    const getBadgeClass = (statut) => {
        switch (statut) {
            case "EN_ATTENTE": return "badge-warning";
            case "ACCEPTEE": return "badge-success";
            case "REFUSEE": return "badge-danger";
            default: return "badge-gray";
        }
    };

    if (loading) return <div className="text-center mt-5">Chargement...</div>;

    return (
        <div className="page-content fade-up">
            <div className="page-header">
                <h1 className="page-title">Mes Candidatures</h1>
            </div>

            <div className="table-card">
                <table className="custom-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Offre (ID)</th>
                        <th>CV</th>
                        <th>Lettre de motivation</th>
                        <th>Statut</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {candidatures.length > 0 ? (
                        candidatures.map((cand) => (
                            <tr key={cand.id}>
                                <td>{cand.dateCandidature}</td>
                                <td className="font-semibold">Offre #{cand.idOffre}</td>
                                <td><div className="file-cell"><Icon d={Icons.file} size={16} /> {cand.cvNom}</div></td>
                                <td><div className="file-cell"><Icon d={Icons.file} size={16} /> {cand.lettreMotivation}</div></td>
                                <td><span className={`badge ${getBadgeClass(cand.statut)}`}>{cand.statut}</span></td>
                                <td style={{ textAlign: 'right' }}>
                                    <button
                                        className="btn-modifier"
                                        onClick={() => handleModifier(cand)}
                                        disabled={cand.statut !== "EN_ATTENTE"}
                                    >
                                        Modifier
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">Aucune candidature trouvée.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}