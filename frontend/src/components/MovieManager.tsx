import { useEffect, useState } from 'react';
import ActionSelect from './ActionSelect';
import MovieList from './MovieList';
import MovieCreateForm from './MovieCreateForm';
import MovieEditForm from './MovieEditForm';
import type { Movie } from '../types/movie';
import { Genre } from '../types/movie';
import type { MovieFormData } from '../types/movie';

const API_URL = 'http://localhost:8002/api';

type RawMovie = {
    id: number;
    title: string;
    description: string | null;
    genre: string;
    duration: number;
    release_date: string;
    image: string | null;
};

function mapGenre(genreStr: string | undefined | null): Genre | null {
    if (!genreStr || typeof genreStr !== 'string') return null;
    const genreValues = Object.values(Genre);
    const found = genreValues.find((g) => g.toLowerCase() === genreStr.toLowerCase());
    return found ?? null;
}

function transformMovie(raw: RawMovie): Movie {
    return {
        id: raw.id,
        title: raw.title,
        description: raw.description,
        genre: mapGenre(raw.genre),
        duration: raw.duration,
        release_date: raw.release_date,
        image: raw.image,
    };
}

export default function MovieManager() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<string>('list');
    const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
    const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/movies`)
            .then((res) => {
                if (!res.ok) throw new Error('Erreur lors du chargement des films');
                return res.json();
            })
            .then((data: RawMovie[]) => {
                const movies = data.map(transformMovie);
                setMovies(movies);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const confirmDelete = async () => {
        if (!movieToDelete) return;
        try {
            const res = await fetch(`${API_URL}/movies/${movieToDelete.id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Erreur lors de la suppression');
            setMovies((prev) => prev.filter((m) => m.id !== movieToDelete.id));
            setMovieToDelete(null);
            setShowDeleteConfirm(false);
            setSelectedAction('list');
        } catch (err) {
            alert(`Erreur : ${(err as Error).message}`);
        }
    };

    if (loading) return <p>Chargement des films...</p>;
    if (error) return <p>Erreur : {error}</p>;

    if (selectedAction === 'list') {
        return (
            <div key={movies.length}> {/* force un rerender à chaque modif */}
                <h1>Liste des films</h1>
                <ActionSelect value={selectedAction} onActionSelect={setSelectedAction} />
                {console.log(movies)}
                <MovieList movies={movies} editable={false} />
            </div>
        );
    }

    if (selectedAction === 'create') {
        return (
            <div>
                <h1>Liste des films</h1>
                <ActionSelect value={selectedAction} onActionSelect={setSelectedAction} />
                <p>🟢 Formulaire de création ici</p>
                <MovieCreateForm
                    onCreated={async (formData: FormData) => {
                        const res = await fetch(`${API_URL}/movies`, {
                            method: 'POST',
                            body: formData,
                        });
                        if (!res.ok) throw new Error('Erreur création');
                        const rawCreatedMovie: RawMovie = await res.json();
                        const createdMovie = transformMovie(rawCreatedMovie);
                        if (createdMovie.id === null) return;
                        setMovies((prev) => [...prev, createdMovie]);
                        setSelectedAction('list');
                    }}
                />
            </div>
        );
    }

    if (selectedAction === 'update') {
        return (
            <div>
                <h1>Liste des films</h1>
                <ActionSelect
                    value={selectedAction}
                    onActionSelect={(action) => {
                        setSelectedAction(action);
                        if (action !== 'update') setMovieToEdit(null);
                    }}
                />
                {!movieToEdit && (
                    <>
                        <p>🟡 Choisissez un film à modifier</p>
                        <MovieList
                            movies={movies}
                            editable={true}
                            onEdit={(movie) => setMovieToEdit(movie)}
                        />
                    </>
                )}
                {movieToEdit && (
                    <>
                        <p>🟡 Modification du film</p>
                        <MovieEditForm
                            movie={movieToEdit}
                            onUpdated={(updatedMovie) => {
                                setMovies((prev) =>
                                    prev.map((m) => (m.id === updatedMovie.id ? updatedMovie : m))
                                );
                                setMovieToEdit(null);
                                setSelectedAction('list');
                            }}
                            onCancel={() => setMovieToEdit(null)}
                        />
                    </>
                )}
            </div>
        );
    }

    if (selectedAction === 'delete') {
        return (
            <div>
                <h1>Liste des films</h1>
                <ActionSelect value={selectedAction} onActionSelect={setSelectedAction} />
                <p>🔴 Choisissez un film à supprimer</p>
                <MovieList
                    movies={movies}
                    editable={true}
                    onDelete={(movie) => {
                        setMovieToDelete(movie);
                        setShowDeleteConfirm(true);
                    }}
                />
                {showDeleteConfirm && movieToDelete && (
                    <div className="alert alert-danger mt-3">
                        <p>Confirmez-vous la suppression du film : <strong>{movieToDelete.title}</strong> ?</p>
                        <button className="btn btn-danger me-2" onClick={confirmDelete}>
                            ✅ Oui, supprimer
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setShowDeleteConfirm(false);
                                setMovieToDelete(null);
                            }}
                        >
                            ❌ Annuler
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return null;
}
