import { Table, Button } from 'react-bootstrap';
import type { Movie } from '../types/movie';

type Props = {
    movies: Movie[];
    editable?: boolean;
    onEdit?: (movie: Movie) => void;
    onDelete?: (movie: Movie) => void;
};

export default function MovieList({ movies, editable = false, onEdit, onDelete }: Props) {
    // Fonction pour formater une date ISO en format lisible FR
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Image</th>
                    <th>Genre</th>
                    <th>Durée (min)</th>
                    <th>Date de sortie</th>
                    <th>Description</th>
                    {editable && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {movies.length === 0 ? (
                    <tr>
                        <td colSpan={editable ? 6 : 5} className="text-center">
                            Aucun film à afficher.
                        </td>
                    </tr>
                ) : (
                    movies.map((movie) => (
                        <tr key={movie.id}>
                            <td>{movie.title ?? '—'}</td>
                            <td>
                                {movie.image ? (
                                    <img
                                        src={`http://localhost:8002/uploads/movies/${movie.image}`}
                                        alt={movie.title}
                                        style={{ maxWidth: '100px' }}
                                    />
                                ) : (
                                    <div style={{ maxWidth: '100px', textAlign: 'center' }}>
                                        Aucune image
                                    </div>
                                )}
                            </td>
                            <td>{movie.genre ?? '—'}</td>
                            <td>{movie.duration ?? '—'}</td>
                            <td>{formatDate(movie.release_date)}</td>
                            <td style={{ maxWidth: '300px', whiteSpace: 'normal' }}>
                                {movie.description ?? '—'}
                            </td>
                            {editable && (
                                <td>
                                    {onEdit && (
                                        <Button
                                            variant="light"
                                            size="sm"
                                            className="me-2"
                                            style={{ background: '#dfe090', color: '#333' }}
                                            onClick={() => onEdit(movie)}
                                        >
                                            ✏️ Modifier
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => onDelete(movie)}
                                        >
                                            🗑 Supprimer
                                        </Button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))
                )}
            </tbody>
        </Table>
    );
}
