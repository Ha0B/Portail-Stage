import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Style/Offre/ListeOffres.css';
import OffreCard from '../../Componentes/Offre/OffreCard';
import offreService from '../../Services/offreService';
import authService from '../../Services/authService';

const ConsulterOffre = () => {
  // Navigate
  const navigate = useNavigate();

  // States
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  // User
  const user = authService.getCurrentUser();
  console.log(user);

  // Role
  const role = user?.role;

  // Load offres
  useEffect(() => {
    fetchOffres();
  }, []);

  // Fetch offres
  const fetchOffres = async () => {
    try {
      setLoading(true);
      // Get all offres
      const data = await offreService.getAll();
      // Entreprise
      if (role === 'ENTREPRISE') {
        // Filter entreprise offres
        const mesOffres = data.filter(
          (offre) => offre.entrepriseId === user?.id
        );
        setOffres(mesOffres);
      } else {
        // Etudiant
        setOffres(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Add offre
  const handleAdd = () => {
    navigate('/entreprise/offres/ajouter');
  };

  // Edit offre
  const handleEdit = (offre) => {
    navigate(`/entreprise/offres/modifier/${offre.id}`);
  };

  // Delete offre
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Voulez-vous supprimer cette offre ?');
    if (!confirmDelete) return;

    try {
      await offreService.delete(id);
      setOffres((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleApply = (offre) => {
  const idOffre = offre.id;
  if (!idOffre) {
    console.error("Offre sans identifiant :", offre);
    alert("Impossible de postuler : offre invalide.");
    return;
  }
  navigate(`/etudiant/ajouterCandidature/${idOffre}`, { state: { offre } });
};

  // Loading
  if (loading) {
    return <div className="text-center mt-5">Chargement...</div>;
  }

  return (
    <div className="container-fluid py-4 px-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">
          {role === 'ENTREPRISE' ? 'Mes Offres' : 'Liste des Offres'}
        </h3>

        {/* Add button */}
        {role === 'ENTREPRISE' && (
          <button className="btn btn-dark " onClick={handleAdd}>
            + Ajouter une offre
          </button>
        )}
      </div>

      {/* Offres */}
      <div className="row">
        {offres.length > 0 ? (
          offres.map((offre) => (
            <div className="col-md-6 col-lg-4 mb-4" key={offre.id}>
              <OffreCard
                offre={offre}
                role={role}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onApply={() => handleApply(offre)} 
              />
            </div>
          ))
        ) : (
          <div className="text-center mt-5">
            <h5>Aucune offre disponible</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsulterOffre;