import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Genre } from '../types/movie';
import type { Movie, MovieFormData } from '../types/movie';

type Props = {
    movie: Movie;
    onUpdated: (updated: Movie) => void;
    onCancel: () => void;
};

const genres: Genre[] = Object.values(Genre);

export default function MovieEditForm({ movie, onUpdated, onCancel }: Props) {
    const [form, setForm] = useState<MovieFormData>({
        title: movie.title ?? '',
        description: movie.description ?? '',
        genre: movie.genre ?? 'Action',
        duration: movie.duration ?? 90,
        release_date: movie.release_date?.slice(0, 10) ?? '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const API_URL = 'http://localhost:8002/api';

    function handleChange(e: React.ChangeEvent<any>) {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'duration' ? Number(value) : value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/movies/${movie.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Erreur lors de la modification');

            const updatedMovie: Movie = await res.json();
            onUpdated(transformMovie(updatedMovie));
        } catch (err: any) {
            setError(err.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3">
                <Form.Label>Titre</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Genre</Form.Label>
                <Form.Select name="genre" value={form.genre} onChange={handleChange} required>
                    {genres.map(g => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Durée (min)</Form.Label>
                <Form.Control
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    min={1}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Date de sortie</Form.Label>
                <Form.Control
                    type="date"
                    name="release_date"
                    value={typeof form.release_date === 'string' ? form.release_date : form.release_date?.toISOString().slice(0, 10) ?? ''}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Button type="submit" disabled={loading}>
                {loading ? 'Modification...' : 'Enregistrer'}
            </Button>
            {' '}
            <Button variant="secondary" onClick={onCancel} disabled={loading}>
                Annuler
            </Button>
        </Form>
    );
}

function transformMovie(updatedMovie: Movie): Movie {
    // Ensure release_date is always a string in 'YYYY-MM-DD' format
    return {
        ...updatedMovie,
        release_date: updatedMovie.release_date
            ? updatedMovie.release_date.slice(0, 10)
            : '',
    };
}
