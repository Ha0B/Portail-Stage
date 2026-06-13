import React, {
  useEffect,
  useState
} from "react";

import "../../Style/Entreprise/Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import offreService from "../../Services/offreService";
import candidatureService from "../../Services/candidatureService";
import authService from "../../Services/authService";

export default function DashboardEntreprise() {

  // USER CONNECTÉ
  const user = authService.getCurrentUser();
    console.log(user);

  // =========================
  // STATES
  // =========================
  const [stats, setStats] = useState({
    offres: 0,
    candidatures: 0,
    stagiaires: 0,
    conventions: 0,
  });

  const [offres, setOffres] = useState([]);

  const [candidatures, setCandidatures] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // CHARGER DONNÉES
  // =========================
  useEffect(() => {

    fetchDashboardData();

  }, []);

  const fetchDashboardData = async () => {

    try {

      setLoading(true);

      // =========================
      // OFFRES
      // =========================
      const offresData =
        await offreService.getAll();

      // seulement les offres de cette entreprise
      const mesOffres = offresData.filter(
        (offre) =>
          offre.entreprise?.id === user?.id
      );

      setOffres(mesOffres);

      // =========================
      // CANDIDATURES
      // =========================
      const candidaturesData =
        await candidatureService.getAll();

      // candidatures liées aux offres de cette entreprise
      const mesCandidatures =
        candidaturesData.filter((cand) =>
          cand.offre?.entreprise?.id === user?.id
        );

      setCandidatures(mesCandidatures);

      
      // =========================
      // STATS
      // =========================
      setStats({

        offres: mesOffres.length,

        candidatures: mesCandidatures.length,

        stagiaires:
          mesCandidatures.filter(
            (c) => c.status === "ACCEPTEE"
          ).length,

        conventions: 0,

      });

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <div className="text-center mt-5">
        Chargement...
      </div>
    );
  }

  return (

    <div className="dashboard-content">

      {/* HEADER */}
      <div className="dashboard-header">

        <div>

          <h1>
            Tableau de bord
          </h1>

          <p>
            Bienvenue {user?.nom}
          </p>

        </div>

      </div>

      {/* STATS */}
      <div className="row g-4 mb-4">

        {/* OFFRES */}
        <div className="col-lg-3 col-md-6">

          <div className="stat-card">

            <div className="stat-icon">
              <i className="bi bi-file-earmark-text"></i>
            </div>

            <div>

              <span>
                Offres publiées
              </span>

              <h2>
                {stats.offres}
              </h2>

            </div>

          </div>

        </div>

        {/* CANDIDATURES */}
        <div className="col-lg-3 col-md-6">

          <div className="stat-card">

            <div className="stat-icon">
              <i className="bi bi-file-earmark-person"></i>
            </div>

            <div>

              <span>
                Candidatures reçues
              </span>

              <h2>
                {stats.candidatures}
              </h2>

            </div>

          </div>

        </div>

        {/* STAGIAIRES */}
        <div className="col-lg-3 col-md-6">

          <div className="stat-card">

            <div className="stat-icon">
              <i className="bi bi-people"></i>
            </div>

            <div>

              <span>
                Stagiaires acceptés
              </span>

              <h2>
                {stats.stagiaires}
              </h2>

            </div>

          </div>

        </div>

        {/* CONVENTIONS */}
        <div className="col-lg-3 col-md-6">

          <div className="stat-card">

            <div className="stat-icon">
              <i className="bi bi-file-earmark-check"></i>
            </div>

            <div>

              <span>
                Conventions signées
              </span>

              <h2>
                {stats.conventions}
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="row g-4">

        {/* CANDIDATURES */}
        <div className="col-lg-6">

          <div className="content-card">

            <div className="card-header-custom">

              <h3>
                Candidatures récentes
              </h3>

            </div>

            {candidatures.length > 0 ? (

              candidatures.map((item) => (

                <div
                  className="candidate-item"
                  key={item.id}
                >

                  <div className="candidate-left">

                    <div>

                      <h5>
                        {item.etudiant?.nom}
                      </h5>

                      <p>
                        {item.offre?.titre}
                      </p>

                      <span>
                        {item.dateCandidature}
                      </span>

                    </div>

                  </div>

                  <div
                    className={`status-badge ${
                      item.status === "ACCEPTEE"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {item.status}
                  </div>

                </div>

              ))

            ) : (

              <p>
                Aucune candidature
              </p>

            )}

          </div>

        </div>

        {/* OFFRES */}
        <div className="col-lg-6">

          <div className="content-card">

            <div className="card-header-custom">

              <h3>
                Mes offres
              </h3>

            </div>

            {offres.length > 0 ? (

              offres.map((item) => (

                <div
                  className="offer-item"
                  key={item.id}
                >

                  <div>

                    <h5>
                      {item.titre}
                    </h5>

                    <p>
                      {item.datePublication}
                    </p>

                  </div>

                  <div className="status-badge badge-success">

                    Active

                  </div>

                </div>

              ))

            ) : (

              <p>
                Aucune offre
              </p>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}