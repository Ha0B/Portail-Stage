import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import EtudiantLayout from '../Layouts/EtudiantLayout';

// Dashboard / Accueil
import EtudiantDashboard from '../Pages/Etudiant/EtudiantDashboard';

// Offres
import ConsulterOffre from '../Pages/Offres/ConsulterOffre';

// Candidatures
import MesCandidatures from '../Pages/Candidatures/MesCandidatures';
import CandidatureForm from '../Pages/Candidatures/CandidatureForm';

// Conventions
import ConsulterConvention from '../Pages/Convention/ListeConvention';

// Suivi de stage
import MesStages from '../Pages/Stage/MesStages';
import SuiviStage from '../Pages/Suivi/SuiviStage';

// Soutenances
import MaSoutenance from '../Pages/Soutenance/MaSoutenance';

// Notes
import MesNotes from '../Pages/Note/MesNotes';
import ListeSoutenance from "../Pages/Soutenance/ListeSoutenance";

export default function EtudiantApp() {
    return (

        <Routes>

            {/* Route parent */}
            <Route path="/" element={<EtudiantLayout /> } >

                {/* Route par defaut */}
                <Route index element={<EtudiantDashboard /> } />

                {/* Offres */}
                <Route path="offres" element={<ConsulterOffre /> } />

                {/* Candidatures */}
                <Route path="candidatures" element={<MesCandidatures /> } />
                <Route path="ajouterCandidature/:idOffre" element={<CandidatureForm /> } />
                <Route path="modifierCandidature/:idCandidature" element={<CandidatureForm /> } />

                {/* Conventions */}
                <Route path="conventions" element={<ConsulterConvention /> } />

                {/* Suivi de stage */}
                <Route path="mesStages" element={<MesStages /> } />
                <Route path="suivi/:stageId" element={<SuiviStage /> } />

                {/* Soutenances */}
                <Route path="soutenances" element={<MaSoutenance /> } />

                {/* Notes */}
                <Route path="notes" element={<ListeSoutenance /> } />

            </Route>
        </Routes>
    );
}