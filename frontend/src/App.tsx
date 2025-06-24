import {useEffect, useState} from 'react'
import './App.css'

type Movie = {
    id: number;
    title: string;
    description: string;
    genre: string;
    duration: number;
    release_date: string;
};

function App() {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        fetch('/api/movies')
            .then((res) => res.json())
            .then(setMovies)
            .catch(console.error);
    }, []);

    return (
        <>
            <div className="app-container">
                <h1 className="page-title">Films de la filmothèque</h1>

                <div className="table-actions">
                    <button className="btn btn-primary">Ajouter un film</button>
                </div>

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
                                <td>{new Date(movie.release_date).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn btn-edit">Modifier</button>
                                    {' '}
                                    <button className="btn btn-delete">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default App
