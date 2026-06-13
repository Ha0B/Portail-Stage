import React, { useState, useEffect } from 'react';
import '../../Style/Candidature/ListeCandidature.css';
import candidatureService from '../../Services/candidatureService';
import etudiantService from '../../Services/etudiantService';
import offreService from '../../Services/offreService';

const ListeCandidature = () => {
    // Grouped candidatures: key = offer title, value = array of candidatures with details
    const [groupedCandidatures, setGroupedCandidatures] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    // Get current user from local storage (enterprise)
    const user = JSON.parse(localStorage.getItem('user'));


    const fetchCandidatures = async () => {
        try {
            // 1. All candidatures
            const allCandidatures = await candidatureService.getAll();

            // 2. Offers belonging to this enterprise
            const offresEntreprise = await offreService.getByEntreprise(user.id);
            const idsOffres = offresEntreprise.map((offre) => offre.id);

            // 3. Keep only candidatures linked to those offers
            const filtered = allCandidatures.filter((cand) =>
                idsOffres.includes(cand.idOffre)
            );

            // 4. Add student full name, email and offer title
            const withDetails = await Promise.all(
                filtered.map(async (cand) => {
                    try {
                        const etudiant = await etudiantService.getById(cand.idEtudiant);
                        const offre = await offreService.getById(cand.idOffre);
                        return {
                            ...cand,
                            nomComplet: `${etudiant.nom} ${etudiant.prenom}`,
                            email: etudiant.email,
                            titreOffre: offre.titre,
                        };
                    } catch (err) {
                        console.error('Failed to load details for candidature', cand.id, err);
                        return cand;
                    }
                })
            );

            // 5. Group by offer title
            const grouped = withDetails.reduce((acc, cand) => {
                const title = cand.titreOffre || 'Untitled offer';
                if (!acc[title]) acc[title] = [];
                acc[title].push(cand);
                return acc;
            }, {});

            setGroupedCandidatures(grouped);
        } catch (error) {
            console.error('Error loading candidatures', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidatures();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Open the CV in a new tab. The backend returns the file as a blob.
     */
    const voirCv = async (id) => {
        try {
            const blob = await candidatureService.getCv(id);
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error opening CV', error);
        }
    };

    /**
     * Accept a candidature (sets status to ACCEPTEE).
     * The backend automatically creates a Stage, so no extra call needed.
     */
    const accepterCandidature = async (cand) => {
        setActionLoading(cand.id);
        try {
            await candidatureService.updateAccepte(cand.id);
            // Refresh the list to reflect the new status
            await fetchCandidatures();
        } catch (error) {
            console.error('Error accepting candidature', error);
        } finally {
            setActionLoading(null);
        }
    };

    /**
     * Refuse a candidature (sets status to REFUSEE).
     */
    const refuserCandidature = async (id) => {
        setActionLoading(id);
        try {
            await candidatureService.updateRefuser(id);
            await fetchCandidatures();
        } catch (error) {
            console.error('Error refusing candidature', error);
        } finally {
            setActionLoading(null);
        }
    };

    /**
     * Returns a CSS class for the badge based on candidature status.
     */
    const getBadgeClass = (statut) => {
        switch (statut) {
            case 'ACCEPTEE':
                return 'badge-acceptee';
            case 'REFUSEE':
                return 'badge-refusee';
            default:
                return 'badge-attente';
        }
    };

    // ----- RENDER -----
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
                <p>Loading candidatures...</p>
            </div>
        );
    }

    return (
        <div className="container-candidatures">
            {Object.keys(groupedCandidatures).length === 0 && (
                <p>No candidatures for your offers yet.</p>
            )}

            {/* Each group is a block with a table for one offer title */}
            {Object.keys(groupedCandidatures).map((offreTitre) => (
                <div className="offre-section" key={offreTitre}>
                    <div className="offre-header">
                        <h2>Offer : {offreTitre}</h2>
                    </div>

                    <div className="table-responsive">
                        <table className="table-candidature">
                            <thead>
                            <tr>
                                <th>Full name</th>
                                <th>Email</th>
                                <th>Date</th>
                                <th>CV</th>
                                <th>Cover letter</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {groupedCandidatures[offreTitre].map((cand) => (
                                <tr key={cand.id}>
                                    <td>{cand.nomComplet}</td>
                                    <td>{cand.email}</td>
                                    <td>{cand.dateCandidature}</td>

                                    {/* View CV button */}
                                    <td>
                                        <button
                                            className="btn-cv"
                                            onClick={() => voirCv(cand.id)}
                                        >
                                            View CV
                                        </button>
                                    </td>

                                    {/* View motivation letter button */}
                                    <td>
                                        <button
                                            className="btn-lm"
                                            onClick={() => setSelectedLetter(cand.lettreMotivation)}
                                        >
                                            View letter
                                        </button>
                                    </td>

                                    {/* Status badge */}
                                    <td>
                      <span className={`badge ${getBadgeClass(cand.statut)}`}>
                        {cand.statut}
                      </span>
                                    </td>

                                    {/* Action buttons (accept / refuse) */}
                                    <td className="actions">
                                        <button
                                            className="btn-accepter"
                                            disabled={actionLoading === cand.id}
                                            onClick={() => accepterCandidature(cand)}
                                        >
                                            {actionLoading === cand.id ? '...' : 'Accept'}
                                        </button>

                                        <button
                                            className="btn-refuser"
                                            disabled={actionLoading === cand.id}
                                            onClick={() => refuserCandidature(cand.id)}
                                        >
                                            {actionLoading === cand.id ? '...' : 'Refuse'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {/* Modal for motivation letter (HTML content) */}
            {selectedLetter && (
                <div className="modal-lm">
                    <div className="modal-content">
                        <h3>Motivation letter</h3>
                        {/* Render HTML safely (the letter may contain formatting from ReactQuill) */}
                        <div
                            dangerouslySetInnerHTML={{ __html: selectedLetter }}
                            style={{ maxHeight: '400px', overflowY: 'auto' }}
                        />
                        <button onClick={() => setSelectedLetter(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListeCandidature;