import React from 'react';
import { Routes, Route } from 'react-router-dom';

// // DASHBOARD & LAYOUT
import AdminLayout from "../Layouts/AdminLayout";
import DashboardAdmin from '../Pages/Admin/AdminDashboard';

// // UTILISATEURS

import ListeEtudiants from '../Pages/Etudiant/ListeEtudiants';
import ListeEntreprises from '../Pages/Entreprise/ListeEntreprises';
import ListeEncadrants from '../Pages/Encadrent/ListeEncadrants';
import ListeAdmins from '../Pages/Admin/ListeAdmins';

// // STAGES

import ListeStage from '../Pages/Stage/ListeStage';

// // OFFRES

import ConsulterOffre from '../Pages/Offres/ConsulterOffre';

// // CONVENTIONS

import ListeConvention from '../Pages/Convention/ListeConvention';
import SignerConvention from "../Pages/Convention/SignerConvention";

// // SOUTENANCES

import ListeSoutenance from "../Pages/Soutenance/ListeSoutenance";
import AffecterJury from "../Pages/Jury/AffecterJury";
import AjouterSoutenance from "../Pages/Soutenance/AjouterSoutenance";

// // RUBRIQUES

import Rubriques from "../Pages/Rubrique/Rubriques";
import DataExport from "../Pages/Admin/DataExport";

// EXPORTS

// import ExportExcel from '../pages/admin/exports/ExportExcel';


const AdminApp = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                {/* DASHBOARD */}
                <Route index element={<DashboardAdmin />} />

                {/* UTILISATEURS */}
                <Route path="/etudiants" element={<ListeEtudiants />} />
                <Route path="/entreprises" element={<ListeEntreprises />} />
                <Route path="/encadrants" element={<ListeEncadrants />} />
                <Route path="/admins" element={<ListeAdmins />} />

                {/* STAGES */}
                <Route path="stages" element={< ListeStage/>} />

                {/* OFFRES */}
                <Route path="offres" element={<ConsulterOffre />} />

                {/* CONVENTIONS */}
                <Route path="conventions" element={<ListeConvention />} />
                <Route path="conventions/signature/:id" element={<SignerConvention />} />

                {/* SOUTENANCES*/}
                <Route path="soutenances" element={<ListeSoutenance />} />
                <Route path="soutenances/ajouter" element={<AjouterSoutenance />} />
                <Route path="soutenances/:id/jury" element={<AffecterJury />} />

                {/*RUBRIQUES*/}
                <Route path="rubriques" element={<Rubriques />} />

                 <Route path="exports" element={<DataExport />} />
            </Route>
        </Routes>
    );
};

export default AdminApp;