import React, { useEffect, useState } from "react";
import rapportService from "../../Services/rapportService";
import authService from "../../Services/authService";

function RapportsEncadres() {

    const [rapports, setRapports] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Define your functions FIRST
    const chargerRapports = async (idEncadrant) => {
        try {
            setLoading(true);
            const data = await rapportService.getByEncadrant(idEncadrant);
            setRapports(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erreur chargement rapports:", error);
            setRapports([]);
        } finally {
            setLoading(false);
        }
    };

    const validerRapport = async (id) => {
        try {
            await rapportService.update(id, "VALIDE");
            chargerRapports(authService.getCurrentUser().id);
        } catch (error) {
            console.error(error);
            alert("Erreur validation rapport");
        }
    };

    const handleVoirRapport = async (rapportId, type) => {
        try {
            const blobData = await rapportService.getFichier(rapportId);
            const file = new Blob([blobData], { type: type || 'application/pdf' });

            const url = window.URL.createObjectURL(file);
            window.open(url, '_blank');

            setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        } catch (err) {
            console.error("Erreur lors de la lecture du fichier :", err);
            alert("Impossible d'afficher le fichier. Vérifiez vos permissions.");
        }
    };

    // 2. Call them in useEffect SECOND
    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user?.id) {
            chargerRapports(user.id);
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" />
            </div>
        );
    }
    return (
        <div className="container mt-4">

            <div className="card shadow border-0">

                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">
                        Rapports des étudiants encadrés
                    </h4>
                </div>

                <div className="card-body">

                    {/* DEBUG TEMPORAIRE */}
                    {/* <pre>{JSON.stringify(rapports, null, 2)}</pre> */}

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Titre</th>
                                <th>Contenu</th>
                                <th>Statut</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>

                            {rapports.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        Aucun rapport trouvé
                                    </td>
                                </tr>
                            ) : (
                                rapports.map((rapport, index) => (
                                    <tr key={rapport.id}>

                                        <td>{index + 1}</td>

                                        <td>{rapport.titre}</td>

                                        <td>{rapport.contenu}</td>

                                        <td>
                                                <span className={
                                                    rapport.statutRapport === "VALIDE"
                                                        ? "badge bg-success"
                                                        : rapport.statutRapport === "REJETE"
                                                            ? "badge bg-danger"
                                                            : "badge bg-warning text-dark"
                                                }>
                                                    {rapport.statutRapport}
                                                </span>
                                        </td>

                                        <td className="d-flex gap-2">

                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleVoirRapport(rapport.id, rapport.fichierType)}
                                            >
                                                Voir
                                            </button>

                                            <button
                                                className="btn btn-success btn-sm"
                                                disabled={rapport.statutRapport === "VALIDE"}
                                                onClick={() => validerRapport(rapport.id)}
                                            >
                                                Valider
                                            </button>

                                        </td>

                                    </tr>
                                ))
                            )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default RapportsEncadres;