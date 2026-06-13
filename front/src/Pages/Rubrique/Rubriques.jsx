import React, { useState, useEffect } from 'react';
import rubriqueService from '../../Services/rubriqueService';

const ROLES_TYPES = ['RAPPORT', 'PRESENTATION', 'TECHNIQUE', 'QUESTION_REPONSE'];

const RubriquesAdmin = () => {
    const [rubriques, setRubriques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        intitule: '',
        coefficient: '',
        noteMax: '',
        typeRubrique: 'RAPPORT',   // <- renommé ici
        description: '',
    });

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        chargerRubriques();
    }, []);

    const chargerRubriques = async () => {
        try {
            setLoading(true);
            const data = await rubriqueService.getAll();
            setRubriques(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Impossible de charger les rubriques.');
            setRubriques([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const nouvelle = await rubriqueService.create({
                intitule: formData.intitule,
                coefficient: parseFloat(formData.coefficient),
                noteMax: parseInt(formData.noteMax, 10),
                typeRubrique: formData.typeRubrique,   // <- renommé
                description: formData.description,
            });
            setRubriques(prev => [...prev, nouvelle]);
            setFormData({ intitule: '', coefficient: '', noteMax: '', typeRubrique: 'RAPPORT', description: '' });
            setError(null);
        } catch (err) {
            alert("Erreur lors de l'ajout");
        }
    };

    const startEdit = (rubrique) => {
        setEditingId(rubrique.id);
        setEditData({ ...rubrique });
    };

    const saveEdit = async () => {
        try {
            const updated = await rubriqueService.update(editingId, editData);
            setRubriques(prev => prev.map(r => (r.id === editingId ? updated : r)));
            setEditingId(null);
        } catch (err) {
            alert("Erreur lors de la modification");
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cette rubrique ?')) return;
        try {
            await rubriqueService.delete(id);
            setRubriques(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    const totalCoefficient = rubriques.reduce((sum, r) => sum + (r.coefficient || 0), 0);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

    return (
        <div className="container py-4">
            <h1 className="mb-4 fw-bold text-secondary">Gestion des Rubriques de Notation</h1>

            {error && <div className="alert alert-warning">{error}</div>}

            <div className="row g-3 mb-4">
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">Rubriques</h6>
                            <p className="fs-3 fw-bold text-primary">{rubriques.length}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h6 className="text-muted">Coefficient Total</h6>
                            <p className="fs-3 fw-bold text-primary">{totalCoefficient}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Ajouter une Rubrique</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleAdd}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Intitule</label>
                                <input type="text" className="form-control" placeholder="Rapport" name="intitule" value={formData.intitule} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Coefficient (%)</label>
                                <input type="number" className="form-control" placeholder="40" name="coefficient" value={formData.coefficient} onChange={handleInputChange} required />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Note maximale</label>
                                <input type="number" className="form-control" placeholder="20" name="noteMax" value={formData.noteMax} onChange={handleInputChange} required />
                            </div>
                            {/* Le select a maintenant name="typeRubrique" */}
                            <div className="col-md-4">
                                <label className="form-label">Type</label>
                                <select className="form-select" name="typeRubrique" value={formData.typeRubrique} onChange={handleInputChange}>
                                    {ROLES_TYPES.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" rows="3" placeholder="Description de la rubrique..." name="description" value={formData.description} onChange={handleInputChange} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">Ajouter la Rubrique</button>
                    </form>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Liste des Rubriques</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Intitule</th>
                                <th>Type</th>
                                <th>Coefficient</th>
                                <th>Note Max</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rubriques.length === 0 && (
                                <tr><td colSpan="7" className="text-center text-muted py-4">Aucune rubrique trouvee</td></tr>
                            )}
                            {rubriques.map(r => (
                                <tr key={r.id}>
                                    {editingId === r.id ? (
                                        <>
                                            <td>{r.id}</td>
                                            <td><input type="text" className="form-control form-control-sm" name="intitule" value={editData.intitule || ''} onChange={handleEditChange} /></td>
                                            <td>
                                                <select className="form-select form-select-sm" name="typeRubrique" value={editData.typeRubrique || ''} onChange={handleEditChange}>
                                                    {ROLES_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </td>
                                            <td><input type="number" className="form-control form-control-sm" name="coefficient" value={editData.coefficient || ''} onChange={handleEditChange} /></td>
                                            <td><input type="number" className="form-control form-control-sm" name="noteMax" value={editData.noteMax || ''} onChange={handleEditChange} /></td>
                                            <td><input type="text" className="form-control form-control-sm" name="description" value={editData.description || ''} onChange={handleEditChange} /></td>
                                            <td>
                                                <button className="btn btn-sm btn-success me-1" onClick={saveEdit}><i className="fas fa-save"></i> Enreg.</button>
                                                <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>Annuler</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{r.id}</td>
                                            <td>{r.intitule}</td>
                                            <td>{r.typeRubrique}</td>   {/* affichage aussi renommé */}
                                            <td>{r.coefficient}%</td>
                                            <td>{r.noteMax}</td>
                                            <td>{r.description}</td>
                                            <td>
                                                <button className="btn btn-sm btn-warning me-1" onClick={() => startEdit(r)}><i className="fas fa-edit"></i> Modifier</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}><i className="fas fa-trash"></i> Supprimer</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RubriquesAdmin;