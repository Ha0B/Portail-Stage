import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import offreService from '../../Services/offreService';
import authService from '../../Services/authService';

const AjouterOffre = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const user = authService.getCurrentUser();

      // Format date
      let formattedDate = '';

      if (form.dateExpiration) {
        const [year, month, day] =
          form.dateExpiration.split('-');

        formattedDate = `${day}-${month}-${year}`;
      }

      const payload = {
        titre: form.titre,
        description: form.description,
        dateExpiration: formattedDate,
        duree: parseInt(form.duree, 10),
        remuneration: parseFloat(form.remuneration),
        lieu: form.lieu,
        competencesRequises: form.competencesRequises,
        entrepriseId: user.entrepriseId
      };

      await offreService.create(payload);

      navigate('/entreprise/offres');
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          'Erreur lors de la création'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">

      <div className="card shadow border-0 rounded-4">

        <div className="card-header bg-white py-3 border-0">
          <h4 className="mb-0 fw-bold">
            ➕ Nouvelle offre
          </h4>
        </div>

        <div className="card-body">

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* TITRE + DATE */}
            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Titre *
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
                  Date d'expiration *
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

            {/* DESCRIPTION */}
            <div className="mb-3">
              <label className="form-label">
                Description *
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

            {/* DUREE + REMUNERATION + LIEU */}
            <div className="row">

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Durée (mois)
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
                  Rémunération (MAD)
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
                  Lieu *
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

            {/* COMPETENCES */}
            <div className="mb-3">
              <label className="form-label">
                Compétences requises
              </label>

              <textarea
                name="competencesRequises"
                rows="3"
                className="form-control"
                value={form.competencesRequises}
                onChange={handleChange}
                placeholder="Ex: Java, Spring Boot, React..."
              />
            </div>

            {/* BOUTONS */}
            <div className="d-flex justify-content-end gap-2 mt-4">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/entreprise/offres')}
              >
                Annuler
              </button>

              <button
                type="submit"
                className="btn btn-dark"
                disabled={loading}
              >
                {loading
                  ? 'Création...'
                  : 'Créer l’offre'}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AjouterOffre;