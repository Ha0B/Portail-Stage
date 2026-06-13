import React, {
  useState,
  useEffect
} from 'react';

import {
  useNavigate,
  useParams
} from 'react-router-dom';

import offreService from '../../Services/offreService';

const ModifierOffre = () => {

  // Params
  const { id } = useParams();

  const navigate = useNavigate();

  // States
  const [loading, setLoading] = useState(false);

  const [initialLoading, setInitialLoading] =
    useState(true);

  const [error, setError] = useState('');

  const [form, setForm] = useState({

    titre: '',

    description: '',

    dateExpiration: '',

    duree: 3,

    remuneration: 0,

    lieu: '',

    competencesRequises: ''

  });

  // Charger offre
  useEffect(() => {

    fetchOffre();

  }, []);

  const fetchOffre = async () => {

    try {

      const offre =
        await offreService.getById(id);

      // Format date
      let formattedDate = '';

      if (offre.dateExpiration) {

        const [day, month, year] =
          offre.dateExpiration.split('-');

        formattedDate =
          `${year}-${month}-${day}`;
      }

      setForm({

        titre: offre.titre || '',

        description:
          offre.description || '',

        dateExpiration: formattedDate,

        duree: offre.duree || 3,

        remuneration:
          offre.remuneration || 0,

        lieu: offre.lieu || '',

        competencesRequises:
          offre.competencesRequises || ''

      });

    } catch (err) {

      console.error(err);

      setError(
        "Impossible de charger l'offre"
      );

    } finally {

      setInitialLoading(false);

    }
  };

  // Change input
  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });
  };

  // Submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');

    setLoading(true);

    try {

      // Format date
      let formattedDate = '';

      if (form.dateExpiration) {

        const [year, month, day] =
          form.dateExpiration.split('-');

        formattedDate =
          `${day}-${month}-${year}`;
      }

      const payload = {

        titre: form.titre,

        description: form.description,

        dateExpiration: formattedDate,

        duree: parseInt(form.duree),

        remuneration: parseFloat(
          form.remuneration
        ),

        lieu: form.lieu,

        competencesRequises:
          form.competencesRequises

      };

      await offreService.update(
        id,
        payload
      );

      alert(
        'Offre modifiee avec succes'
      );

      navigate('/entreprise/offres');

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        'Erreur modification'
      );

    } finally {

      setLoading(false);

    }
  };

  // Loading
  if (initialLoading) {

    return (

      <div className="text-center mt-5">

        Chargement...

      </div>
    );
  }

  return (

    <div className="container mt-4">

      <div className="card shadow border-0 rounded-4">

        {/* Header */}
        <div className="card-header bg-white py-3 border-0">

          <h4 className="mb-0 fw-bold">

            Modifier offre

          </h4>

        </div>

        {/* Body */}
        <div className="card-body">

          {/* Error */}
          {error && (

            <div className="alert alert-danger">

              {error}

            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Titre + date */}
            <div className="row">

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Titre
                </label>

                <input
                  type="text"
                  name="titre"
                  className="form-control"
                  value={form.titre}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Date expiration
                </label>

                <input
                  type="date"
                  name="dateExpiration"
                  className="form-control"
                  value={form.dateExpiration}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* Description */}
            <div className="mb-3">

              <label className="form-label">
                Description
              </label>

              <textarea
                name="description"
                rows="4"
                className="form-control"
                value={form.description}
                onChange={handleChange}
                required
              />

            </div>

            {/* Duree + remuneration + lieu */}
            <div className="row">

              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Duree
                </label>

                <input
                  type="number"
                  name="duree"
                  className="form-control"
                  min="1"
                  value={form.duree}
                  onChange={handleChange}
                />

              </div>

              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Remuneration
                </label>

                <input
                  type="number"
                  name="remuneration"
                  className="form-control"
                  step="0.01"
                  value={form.remuneration}
                  onChange={handleChange}
                />

              </div>

              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Lieu
                </label>

                <input
                  type="text"
                  name="lieu"
                  className="form-control"
                  value={form.lieu}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* Competences */}
            <div className="mb-3">

              <label className="form-label">
                Competences requises
              </label>

              <textarea
                name="competencesRequises"
                rows="3"
                className="form-control"
                value={
                  form.competencesRequises
                }
                onChange={handleChange}
              />

            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate(
                    '/entreprise/offres'
                  )
                }
              >
                Annuler
              </button>

              <button
                type="submit"
                className="btn btn-dark"
                disabled={loading}
              >

                {loading
                  ? 'Modification...'
                  : 'Modifier offre'}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default ModifierOffre;