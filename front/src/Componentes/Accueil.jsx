import React from "react";
import "../Style/Accueil.css";

export default function Accueil() {
  return (
    <div className="home">

      {/* HERO SECTION */}
      <section className="hero-section"  id="main">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title">
                Gestion des <span>Stages</span>
                <br />
                et Conventions
              </h1>
              <p className="hero-text">
                Une plateforme moderne pour gérer les offres de stages,
                les candidatures, les conventions et les soutenances.
              </p>
              <div className="hero-buttons">
                <a href="/connection" className="btn-dark-custom text-decoration-none d-inline-block text-center" style={{ padding: "10px 24px", borderRadius: "6px" }}>
                  Commencer
                </a>
                
              </div>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
                alt="students"
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3">
              <div className="stat-card">
                <h2>250+</h2>
                <p>Étudiants</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <h2>80+</h2>
                <p>Entreprises</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <h2>120+</h2>
                <p>Stages</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card">
                <h2>98%</h2>
                <p>Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-title">
            <h2>Fonctionnalités</h2>
            <p>Une solution complète pour étudiants et entreprises.</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">💼</div>
                <h4>Gestion des stages</h4>
                <p>Publication et consultation des offres de stages.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">📄</div>
                <h4>Conventions PDF</h4>
                <p>Génération automatique des conventions PDF.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">🎓</div>
                <h4>Soutenances</h4>
                <p>Gestion des jurys et des évaluations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <h4>PortailStages</h4>
              <p>Plateforme de gestion des stages et conventions.</p>
            </div>
            <div className="col-lg-4">
              <h4>Liens</h4>
              <a href="/">Accueil</a>
              <a href="/#features">Services</a>
              <a href="/offres">Stages</a>
              <a href="/connection">Connexion</a>
            </div>
            <div className="col-lg-4">
              <h4>Contact</h4>
              <p>contact@portailstages.com</p>
              <p>+212 600000000</p>
              <p>Casablanca, Maroc</p>
            </div>
          </div>
          <div className="footer-bottom">
            © 2026 PortailStages - Tous droits réservés
          </div>
        </div>
      </footer>

    </div>
  );
}