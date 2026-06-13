import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../Style/Auth/Connection.css';
import authService from '../../Services/authService';
import entrepriseService from '../../Services/entrepriseService';
import etudiantService from '../../Services/etudiantService';
import encadrantService from '../../Services/encadrantService'; 
import adminService from '../../Services/adminService';         

export default function Connection() {
  const emailfield = useRef();
  const pwdfield = useRef();
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validerForm = () => {
    const emailValue = emailfield.current.value;
    const pwdValue = pwdfield.current.value;
    let newErrors = [];
    if (!emailValue.trim()) newErrors.push('Email obligatoire');
    if (!pwdValue.trim()) newErrors.push('Mot de passe obligatoire');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validerForm()) return;

    try {
      setIsLoading(true);

      const loginData = {
        email: emailfield.current.value,
        motDePasse: pwdfield.current.value
      };

      const data = await authService.login(loginData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userNom', data.nom);
      localStorage.setItem('userPrenom', data.prenom);

      switch (data.role) {
        case "ETUDIANT":
          navigate("/etudiant");
          break;
        case "ENTREPRISE":
          navigate("/entreprise");
          break;
        case "ENCADRANT":
          navigate("/encadrant");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error(error);
      setErrors([error.response?.data?.message || 'Email ou mot de passe incorrect']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Connexion</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <div className="alert alert-danger">
              <ul>{errors.map((err, index) => <li key={index}>{err}</li>)}</ul>
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" ref={emailfield} placeholder="Votre email" />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" ref={pwdfield} placeholder="Votre mot de passe" />
          </div>
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
          <div className="links-container">
            <Link to="/inscription">Créer un compte</Link>
          </div>
        </form>
      </div>
    </div>
  );
}