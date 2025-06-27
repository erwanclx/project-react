import { Row, Col } from 'react-bootstrap';
import MovieCard from './MovieCard';
import type { Movie } from '../types/movie';

type Props = {
    movies: Movie[];
    editable?: boolean;
    onEdit?: (movie: Movie) => void;
    onDelete?: (movie: Movie) => void;
};

export default function MovieList({ movies, editable = false, onEdit, onDelete }: Props) {
    return (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {movies.length === 0 ? (
                <Col>
                    <div className="text-center p-5">
                        <h5>Aucun film à afficher.</h5>
                    </div>
                </Col>
            ) : (
                movies.map((movie) => (
                    <Col key={movie.id}>
                        <MovieCard
                            movie={movie}
                            editable={editable}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    </Col>
                ))
            )}
        </Row>
    );
}
