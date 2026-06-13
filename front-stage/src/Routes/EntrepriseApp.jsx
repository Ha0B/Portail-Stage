import React from 'react';
import { Routes, Route } from 'react-router-dom';

//    LAYOUT
import LayoutEntreprise from '../Layouts/EntrepriseLayout';

//   DASHBOARD

import DashboardEntreprise from '../Pages/Entreprise/EntrepriseDashboard';

// OFFRES

import ConsulterOffre from '../Pages/Offres/ConsulterOffre';
import AjouterOffre from '../Pages/Offres/AjouterOffre';
import ModifierOffre from '../Pages/Offres/ModifierOffre';

// CANDIDATURES

import ListeCandidature from '../Pages/Candidatures/ListeCandidature';

// Conventions 
import ListeConvention from '../Pages/Convention/ListeConvention' ;
import SignerConvention from '../Pages/Convention/SignerConvention';

/// Objectifs
import AjouterObjectif from '../Pages/Objectif/AjouterObjectif';
import ModifierObjectif from '../Pages/Objectif/ModifierObjectif';
// Suivi

import SuiviStagiaire from '../Pages/Suivi/SuiviStagiaire';
import ListeStagiaires from '../Pages/Stage/ListeStagiaires.jsx';

const EntrepriseApp = () => {

    return (

        <Routes>

            {/* LAYOUT ENTREPRISE */}
            <Route
                path="/"
                element={<LayoutEntreprise />}
            >

                {/* DASHBOARD */}
                <Route
                    index
                    element={<DashboardEntreprise />}
                />

                {/* OFFRES */}
                <Route
                    path="offres"
                    element={<ConsulterOffre />}
                />

                <Route
                    path="offres/ajouter"
                    element={<AjouterOffre />}
                />

                <Route
                    path="offres/modifier/:id"
                    element={<ModifierOffre />}
                />

                {/* CANDIDATURES*/}
                <Route
                    path="candidatures"
                    element={<ListeCandidature />}
                />

                {/* CONVENTIONS */}

                <Route
                    path="conventions"
                    element={<ListeConvention />}
                />

                <Route
                    path="conventions/signature/:id"
                    element={<SignerConvention />}
                />

                {/* Suivi */}

                <Route
                    path="stagiaires"
                    element={<ListeStagiaires />}
                />

                <Route
                    path="suivi/:id"
                    element={<SuiviStagiaire />}
                />

                {/* Objectif */}

                <Route
                    path="AjouterObjectif/:id"
                    element={<AjouterObjectif />}
                />

                <Route
                    path="modifierObjectif/:id"
                    element={<ModifierObjectif />}
                />
                
            </Route>

        </Routes>
    );
};

export default EntrepriseApp;