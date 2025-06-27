import { Card, Button } from 'react-bootstrap';
import type { Movie } from '../types/movie';
import './MovieCard.css';

interface MovieCardProps {
    movie: Movie;
    editable?: boolean;
    onEdit?: (movie: Movie) => void;
    onDelete?: (movie: Movie) => void;
}

export default function MovieCard({ movie, editable = false, onEdit, onDelete }: MovieCardProps) {
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
        <Card className="movie-card h-100">
            <Card.Img
                variant="top"
                src={movie.image ? `http://localhost:8001/uploads/movies/${movie.image}` : '/placeholder.jpg'}
                alt={movie.title}
                className="movie-card-image"
            />
            <Card.Body>
                <Card.Title className="h5 mb-3">{movie.title ?? '—'}</Card.Title>
                <div className="movie-meta mb-3">
                    <span className="genre-tag">{movie.genre ?? '—'}</span>
                    <span className="duration-tag">{movie.duration} min</span>
                </div>
                <Card.Text className="movie-description">
                    {movie.description ?? '—'}
                </Card.Text>
                {editable && (
                    <div className="mt-3">
                        {onEdit && (
                            <Button
                                variant="outline-light"
                                size="sm"
                                className="me-2"
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
                    </div>
                )}
            </Card.Body>
            <Card.Footer className="text-muted">
                <small>Sortie: {formatDate(movie.release_date)}</small>
            </Card.Footer>
        </Card>
    );
}
