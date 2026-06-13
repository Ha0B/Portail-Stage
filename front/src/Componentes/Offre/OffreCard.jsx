import React from 'react';

const OffreCard = ({
  offre,
  role,
  onEdit,
  onDelete,
  onApply
}) => {

  return (

    <div className="card shadow-sm border-0 h-100 rounded-4">

      <div className="card-body d-flex flex-column">

        {/* Titre */}
        <h5 className="fw-bold mb-3">
          {offre.titre}
        </h5>

        {/* Description */}
        <p className="text-muted">
          {offre.description}
        </p>

        {/* Infos */}
        <div className="mt-2">

          <p className="mb-1">
            <strong>Lieu :</strong>{' '}
            {offre.lieu}
          </p>

          <p className="mb-1">
            <strong>Duree :</strong>{' '}
            {offre.duree} mois
          </p>

          <p className="mb-1">
            <strong>Remuneration :</strong>{' '}
            {offre.remuneration} MAD
          </p>

          <p className="mb-1">
            <strong>Competences :</strong>{' '}
            {offre.competencesRequises}
          </p>

        </div>

        {/* Buttons */}
        <div className="d-flex gap-2 mt-auto pt-3">

          {/* Entreprise */}
          {role === 'ENTREPRISE' && (

            <>

              <button
                className="
                  btn
                  btn-outline-primary
                  w-100
                "
                onClick={() =>
                  onEdit(offre)
                }
              >
                Modifier
              </button>

              <button
                className="
                  btn
                  btn-outline-danger
                  w-100
                "
                onClick={() =>
                  onDelete(offre.id)
                }
              >
                Supprimer
              </button>

            </>

          )}

          {/* Etudiant */}
          {role === 'ETUDIANT' && (

            <button
              className="
                btn
                btn-dark
                w-100
              "
              onClick={() =>
                onApply(offre)
              }
            >
              Postuler
            </button>

          )}

        </div>

      </div>

    </div>
  );
};

export default OffreCard;