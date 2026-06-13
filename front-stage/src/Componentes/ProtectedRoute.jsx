import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({
    children,
    role
}) => {

    // RECUPERATION TOKEN
    const token = localStorage.getItem("token");

    // RECUPERATION ROLE
    const userRole = localStorage.getItem("role");

    // SI PAS CONNECTE
    if (!token) {
        return <Navigate to="/login" />;
    }

    // SI ROLE NON AUTORISE
    if (role && userRole !== role) {
        return <Navigate to="/unauthorized" />;
    }

    // SI AUTORISE
    return children;
};

export default ProtectedRoute;