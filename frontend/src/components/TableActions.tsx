import React from 'react';
import {Genre} from '../../types/movie.ts';

interface TableActionsProps {
    filters: Record<string, string>;
    onFilterChange: (field: string, value: string) => void;
    onAddMovie: () => void;
}

const TableActions: React.FC<TableActionsProps> = ({filters, onFilterChange, onAddMovie}) => {
    return (
        <div className="table-actions">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Titre"
                    value={filters.title || ''}
                    onChange={(e) => onFilterChange('title', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={filters.description || ''}
                    onChange={(e) => onFilterChange('description', e.target.value)}
                />
                <select
                    name="genre"
                    value={filters.genre || ''}
                    onChange={(e) => onFilterChange('genre', e.target.value)}
                >
                    <option value="">Tous les genres</option>
                    {Object.values(Genre).map((g) => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Durée (min)"
                    value={filters.duration || ''}
                    onChange={(e) => onFilterChange('duration', e.target.value)}
                />
                <input
                    type="date"
                    name="release_date"
                    value={filters.release_date || ''}
                    onChange={(e) => onFilterChange('release_date', e.target.value)}
                />
            </div>
            <button className="btn btn-add" onClick={onAddMovie}>➕ Ajouter un film</button>
        </div>
    );
};

export default TableActions;
