import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import LayoutEncadrant from '../Layouts/EncadrantLayout';

// Pages
import DashboardEncadrant from '../Pages/Encadrent/EncadrentDashboard';
import ListeEtudiants from '../Pages/Etudiant/ListerEtudiant';

import PlanningProfesseur from "../Pages/Soutenance/PlanningProfesseur";

import MonPlanning from "../Pages/Soutenance/MonPlanning";
import SaisieNotesJury from "../Pages/Note/SaisirNotesJury";

import RapportsEncadres from "../Pages/Rapport/RapportsEncadres";

const EncadrantApp = () => {
    return (
        <Routes>
            <Route path="/" element={<LayoutEncadrant />}>
                {/* Dashboard (index) */}
                <Route index element={<DashboardEncadrant />} />

                {/* Étudiants */}
                <Route path="etudiants" element={<ListeEtudiants />} />
                {/* <Route path="etudiants/:id" element={<DetailEtudiant />} /> */}

                {/* Rapports */}
                <Route path="rapports" element={<RapportsEncadres />} />
        
                {/* Soutenances */}
                <Route path="soutenances" element={<PlanningProfesseur />} />
                <Route path="monPlanning" element={<MonPlanning />} />

                {/* Notes */}
                <Route path="saisie-notes/:id" element={<SaisieNotesJury />} />

            </Route>
        </Routes>
    );
};

export default EncadrantApp;