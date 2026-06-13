import React, { useState } from "react";
import CsvService  from "../../Services/CsvService";

export default function DataExport() {

    // ================= FILTRES =================
    const [candidaturesFilters, setCandidaturesFilters] = useState({
        offreId: "",
        promo: "",
        statut: ""
    });

    const [soutenancesFilters, setSoutenancesFilters] = useState({
        salle: "",
        jury: ""
    });

    const [notesFilters, setNotesFilters] = useState({
        min: "",
        max: ""
    });

    const [conventionsFilters, setConventionsFilters] = useState({
        entreprise: "",
        etat: ""
    });

    const statutCandidatureOptions = ["", "EN_ATTENTE", "ACCEPTEE", "REFUSEE", "ANNULEE"];
    const statutConventionOptions = ["", "EN_ATTENTE", "SIGNEE_PAR_ENTREPRISE"];

    // ================= FONCTION UTILITAIRE DE TÉLÉCHARGEMENT =================
    // Cette fonction prend le fichier (blob) renvoyé par le backend et le télécharge
    const downloadExcelFile = (blobData, filename) => {
        const url = window.URL.createObjectURL(new Blob([blobData]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    // ================= HANDLERS D'EXPORT (Appels Backend) =================
    const handleCandidaturesExport = async () => {
        if (!candidaturesFilters.offreId) {
            alert("Veuillez renseigner l'ID de l'offre pour exporter.");
            return;
        }
        try {
            const blobData = await CsvService.exportCandidatures(candidaturesFilters);
            downloadExcelFile(blobData, `candidatures_offre_${candidaturesFilters.offreId}.xlsx`);
        } catch (error) {
            console.error("Erreur lors de l'export candidatures:", error);
            alert("Échec de la génération du fichier Excel.");
        }
    };

    const handleSoutenancesExport = async () => {
        try {
            const blobData = await CsvService.exportSoutenances(soutenancesFilters);
            downloadExcelFile(blobData, "soutenances.xlsx");
        } catch (error) {
            console.error("Erreur lors de l'export soutenances:", error);
            alert("Échec de la génération du fichier Excel.");
        }
    };

    const handleNotesExport = async () => {
        try {
            const blobData = await CsvService.exportNotes(notesFilters);
            downloadExcelFile(blobData, "notes.xlsx");
        } catch (error) {
            console.error("Erreur lors de l'export notes:", error);
            alert("Échec de la génération du fichier Excel.");
        }
    };

    const handleConventionsExport = async () => {

        console.log("Filtres :", conventionsFilters);

        try {

            const response = await CsvService.exportConventions(conventionsFilters);

            console.log("Succès", response);

            downloadExcelFile(response, "conventions.xlsx");

        } catch (error) {

            console.log("STATUS :", error.response?.status);
            console.log("DATA :", error.response?.data);
            console.log("HEADERS :", error.response?.headers);

            alert(error.response?.status);
        }
    };

    // ================= UI =================
    return (
        <div className="container py-4" style={{ background: "#f4f6f9" }}>
            <h2 className="mb-4">📤 Export Dashboard </h2>

            {/* ================= CARD 1: CANDIDATURES ================= */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h5>📌 Candidatures par offre</h5>
                    <div className="row">
                        <div className="col-md-4">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="ID de l'offre (Requis)"
                                value={candidaturesFilters.offreId}
                                onChange={e => setCandidaturesFilters({ ...candidaturesFilters, offreId: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                className="form-control"
                                placeholder="Promo (ex: 2024)"
                                value={candidaturesFilters.promo}
                                onChange={e => setCandidaturesFilters({ ...candidaturesFilters, promo: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={candidaturesFilters.statut}
                                onChange={e => setCandidaturesFilters({ ...candidaturesFilters, statut: e.target.value })}>
                                {statutCandidatureOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt === "" ? "Tous les statuts" : opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleCandidaturesExport}>
                        Export Excel
                    </button>
                </div>
            </div>

            {/* ================= CARD 2: SOUTENANCES ================= */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h5>🗓 Planning des soutenances</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <input className="form-control" placeholder="Salle"
                                   onChange={e => setSoutenancesFilters({ ...soutenancesFilters, salle: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                            <input className="form-control" placeholder="Jury"
                                   onChange={e => setSoutenancesFilters({ ...soutenancesFilters, jury: e.target.value })} />
                        </div>
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleSoutenancesExport}>
                        Export Excel
                    </button>
                </div>
            </div>

            {/* ================= CARD 3: NOTES ================= */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h5>📊 Notes détaillées & moyennes</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <input type="number" className="form-control" placeholder="Moyenne min"
                                   onChange={e => setNotesFilters({ ...notesFilters, min: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                            <input type="number" className="form-control" placeholder="Moyenne max"
                                   onChange={e => setNotesFilters({ ...notesFilters, max: e.target.value })} />
                        </div>
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleNotesExport}>
                        Export Excel
                    </button>
                </div>
            </div>

            {/* ================= CARD 4: CONVENTIONS ================= */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h5>📄 Conventions par entreprise</h5>
                    <input
                        className="form-control mb-2"
                        placeholder="Nom de l'entreprise"
                        value={conventionsFilters.entreprise}
                        onChange={e => setConventionsFilters({ ...conventionsFilters, entreprise: e.target.value })}
                    />
                    <select className="form-select"
                            value={conventionsFilters.etat}
                            onChange={e => setConventionsFilters({ ...conventionsFilters, etat: e.target.value })}>
                        {statutConventionOptions.map(opt => (
                            <option key={opt} value={opt}>{opt === "" ? "Tous les états" : opt}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary mt-3" onClick={handleConventionsExport}>
                        Export Excel
                    </button>
                </div>
            </div>

        </div>
    );
}

