import React from 'react';
import Button from './Button';
import Input from './Input';

const FiltersBar = ({ search, onSearchChange, lieu, onLieuChange, sort, onSortChange, onReset }) => {
  return (
    <div className="filter-card p-3 p-md-4 mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-md-5">
          <Input
            label="Recherche"
            placeholder="Titre, entreprise, compétences, lieu..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold small text-secondary">
            <i className="bi bi-geo-alt-fill me-1"></i> Lieu
          </label>
          <select className="form-select" value={lieu} onChange={(e) => onLieuChange(e.target.value)}>
            <option value="all">Tous les lieux</option>
            <option value="Casablanca">Casablanca</option>
            <option value="Rabat">Rabat</option>
            <option value="Tanger">Tanger</option>
            <option value="Marrakech">Marrakech</option>
            <option value="Remote">Remote / Télétravail</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label fw-semibold small text-secondary">Trier par</label>
          <select className="form-select" value={sort} onChange={(e) => onSortChange(e.target.value)}>
            <option value="recent">Plus récentes</option>
            <option value="remuneration">Rémunération (desc)</option>
            <option value="duree">Durée (longue)</option>
          </select>
        </div>
        <div className="col-md-2">
          <Button text="Réinitialiser" type="outline-secondary" onClick={onReset} />
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;