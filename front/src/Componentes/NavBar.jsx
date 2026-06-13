import React from 'react';
import { Link } from 'react-router-dom';
import '../Style/NavBar.css';

export default function NavBar() {
    return (
        <nav>
            <div className="navbar-container">
            <Link to="/" className="navbar-logo">Portail Stages</Link>

            <div className="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul className="navbar-menu">
                <li className="navbar-item">
                <a href="/#main" className="navbar-link">Accueil</a>
                </li>
                <li className="navbar-item">
                <a href="/#features" className="navbar-link">Services</a>
                </li>
                <li className="navbar-item">
                <a href="/#footer" className="navbar-link">Contact</a>
                </li>
                <li className="navbar-item">
                <Link to="/connection" className="navbar-cta">Se Connecter</Link>
                </li>
            </ul>
            </div>
        </nav>
    );
}