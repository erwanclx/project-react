import React from 'react';
import type {Movie} from '../../types/movie.ts';
import {FaEdit, FaTrash} from 'react-icons/fa';

interface MovieTableProps {
    movies: Movie[];
}

const MovieTable: React.FC<MovieTableProps> = ({movies}) => {
    return (
        <div className="table-wrapper">
            <table className="movies-table">
                <thead>
                <tr>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Genre</th>
                    <th>Durée (min)</th>
                    <th>Date de sortie</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {movies.map((movie) => (
                    <tr key={movie.id}>
                        <td>{movie.title}</td>
                        <td>{movie.description}</td>
                        <td>{movie.genre}</td>
                        <td>{movie.duration}</td>
                        <td>
                            {movie.release_date
                                ? new Date(movie.release_date).toLocaleDateString()
                                : '—'}
                        </td>
                        <td>
                            <div className="btn-group">
                                <button className="btn btn-edit" title="Modifier">
                                    <FaEdit/>
                                </button>
                                <button className="btn btn-delete" title="Supprimer">
                                    <FaTrash/>
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MovieTable;
