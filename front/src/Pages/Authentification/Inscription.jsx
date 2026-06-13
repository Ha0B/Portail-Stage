import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../Style/Auth/Inscription.css';
import authService from '../../Services/authService';

export default function Inscription() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('ETUDIANT');
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // champs communs
  const nomField = useRef();
  const prenomField = useRef();
  const emailField = useRef();
  const pwdField = useRef();
  const pwdField2 = useRef();

  // Etudiant
  const numEtudRef = useRef();
  const filiereRef = useRef();
  const niveauRef = useRef();
  const promotionRef = useRef();

  // Entreprise
  const nomEntrepriseRef = useRef();
  const secteurRef = useRef();
  const adresseRef = useRef();
  const villeRef = useRef();
  const telephoneEntrepriseRef = useRef();

  // Encadrant
  const posteRef = useRef();
  const departementRef = useRef();
  const telephoneEncadrantRef = useRef();

  const validerForm = () => {
    const newErrors = [];
    const nom = nomField.current.value.trim();
    const prenom = prenomField.current.value.trim();
    const email = emailField.current.value.trim();
    const pwd = pwdField.current.value;
    const pwdConfirm = pwdField2.current.value;

    if (!nom) newErrors.push('Nom obligatoire');
    if (!prenom) newErrors.push('Prénom obligatoire');
    if (!email) newErrors.push('Email obligatoire');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.push('Email invalide');
    if (!pwd) newErrors.push('Mot de passe obligatoire');
    else if (pwd.length < 8) newErrors.push('Le mot de passe doit contenir au moins 8 caractères');
    if (pwd !== pwdConfirm) newErrors.push('Les mots de passe ne correspondent pas');

    // Etudiant
    if (userType === 'ETUDIANT') {
      if (!numEtudRef.current.value.trim()) newErrors.push('Numéro étudiant obligatoire');
      if (!filiereRef.current.value) newErrors.push('Filière obligatoire');
      if (!niveauRef.current.value) newErrors.push('Niveau obligatoire');
    }

    // Entreprise
    if (userType === 'ENTREPRISE') {
      if (!nomEntrepriseRef.current.value.trim()) newErrors.push('Nom entreprise obligatoire');
      if (!secteurRef.current.value) newErrors.push('Secteur obligatoire');
      if (!villeRef.current.value.trim()) newErrors.push('Ville obligatoire');
    }

    // Encadrant
    if (userType === 'ENCADRANT') {
      if (!posteRef.current.value.trim()) newErrors.push('Poste obligatoire');
      if (!departementRef.current.value.trim()) newErrors.push('Département obligatoire');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validerForm()) return;
    setIsLoading(true);
    try {
      const formData = {
        nom: nomField.current.value,
        prenom: prenomField.current.value,
        email: emailField.current.value,
        motDePasse: pwdField.current.value,
        role: userType
      };

      if (userType === 'ETUDIANT') {
        formData.numeroEtudiant = numEtudRef.current.value;
        formData.filiere = filiereRef.current.value;
        formData.niveau = niveauRef.current.value;
        formData.promotion = promotionRef.current.value;
      }
      if (userType === 'ENTREPRISE') {
        formData.nomEntreprise = nomEntrepriseRef.current.value;
        formData.secteurActivite = secteurRef.current.value;
        formData.adresse = adresseRef.current.value;
        formData.ville = villeRef.current.value;
        formData.telephoneEntreprise = telephoneEntrepriseRef.current.value;
      }
      if (userType === 'ENCADRANT') {
        formData.poste = posteRef.current.value;
        formData.departement = departementRef.current.value;
        formData.telephoneEncadrant = telephoneEncadrantRef.current.value;
      }

      await authService.register(formData);
      navigate('../connection');
    } catch (error) {
      console.error(error);
      setErrors([error.response?.data?.message || "Erreur lors de l'inscription"]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inscription-page">
      <div className="inscription-container">
        <h2 className="inscription-title">Inscription</h2>

        <form className="inscription-form" onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="alert alert-danger">
              <ul>
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Type d'utilisateur avec radio*/}
          <div className="form-group">
            <label>Type d'utilisateur</label>
            <div className="user-type-group">
              {[
                { value: 'ETUDIANT', label: 'Étudiant' },
                { value: 'ENTREPRISE', label: 'Entreprise' },
                { value: 'ENCADRANT', label: 'Encadrant' }
              ].map((type) => (
                <label key={type.value} className="user-type-label">
                  <input
                    type="radio"
                    name="userType"
                    value={type.value}
                    checked={userType === type.value}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 1ère ligne : Nom + Prénom */}
          <div className="form-row">
            <div className="form-group">
              <label>Nom *</label>
              <input type="text" ref={nomField} placeholder="Votre nom" />
            </div>
            <div className="form-group">
              <label>Prénom *</label>
              <input type="text" ref={prenomField} placeholder="Votre prénom" />
            </div>
          </div>

          {/* Email */}
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input type="email" ref={emailField} placeholder="exemple@email.com" />
            </div>
            <div className="form-group">
              {/*  champ vide pour respecter grille, ou on peut décaler */}
            </div>
          </div>

          {/*Mot de passe + confirmation */}
          <div className="form-row">
            <div className="form-group">
              <label>Mot de passe *</label>
              <input type="password" ref={pwdField} placeholder="Minimum 8 caractères" />
            </div>
            <div className="form-group">
              <label>Confirmation *</label>
              <input type="password" ref={pwdField2} placeholder="Répéter le mot de passe" />
            </div>
          </div>

          {/* Champs spécifiques selon le type */}
          {userType === 'ETUDIANT' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Numéro étudiant *</label>
                  <input type="text" ref={numEtudRef} placeholder="Ex: 2024XXXX" />
                </div>
                <div className="form-group">
                  <label>Filière *</label>
                  <input type="text" ref={filiereRef} placeholder="Informatique, Gestion..." />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Niveau *</label>
                  <input type="text" ref={niveauRef} placeholder="L1, M2, ..." />
                </div>
                <div className="form-group">
                  <label>Promotion (année)</label>
                  <input type="text" ref={promotionRef} placeholder="2024-2025" />
                </div>
              </div>
            </>
          )}

          {userType === 'ENTREPRISE' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom entreprise *</label>
                  <input type="text" ref={nomEntrepriseRef} />
                </div>
                <div className="form-group">
                  <label>Secteur d'activité *</label>
                  <input type="text" ref={secteurRef} placeholder="Tech, Finance, ..." />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Adresse</label>
                  <input type="text" ref={adresseRef} />
                </div>
                <div className="form-group">
                  <label>Ville *</label>
                  <input type="text" ref={villeRef} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Téléphone</label>
                  <input type="tel" ref={telephoneEntrepriseRef} />
                </div>
                <div className="form-group">{/* vide */}</div>
              </div>
            </>
          )}

          {userType === 'ENCADRANT' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Poste *</label>
                  <input type="text" ref={posteRef} />
                </div>
                <div className="form-group">
                  <label>Département *</label>
                  <input type="text" ref={departementRef} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Téléphone</label>
                  <input type="tel" ref={telephoneEncadrantRef} />
                </div>
                <div className="form-group">{/* vide */}</div>
              </div>
            </>
          )}

          <button type="submit" className="inscription-btn" disabled={isLoading}>
            {isLoading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <div className="login-link">
          Déjà un compte ? <Link to="/connection">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}