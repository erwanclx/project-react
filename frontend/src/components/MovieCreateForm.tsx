import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import type { Genre, MovieFormData } from '../types/movie';

const genres: Genre[] = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Documentary',
    'Drama', 'Fiction', 'Fantasy', 'History', 'Horror', 'Music',
    'Police', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
];

type Props = {
    onCreated: (newMovie: MovieFormData) => void;  // <-- changé ici
};

export default function MovieCreateForm({ onCreated }: Props) {
    const [form, setForm] = useState<MovieFormData>({
        title: '',
        description: '',
        genre: 'Action',
        duration: 90,
        release_date: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'duration' ? Number(value) : value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!form.title.trim()) return setError('Le titre est obligatoire');
        if (!form.genre) return setError('Le genre est obligatoire');
        if (!form.duration || form.duration <= 0) return setError('La durée doit être positive');
        if (!form.release_date) return setError('La date de sortie est obligatoire');

        setLoading(true);

        try {
            // Ici on passe simplement le form (MovieFormData) à onCreated
            await onCreated(form);
            setForm({
                title: '',
                description: '',
                genre: 'Action',
                duration: 90,
                release_date: '',
            });
        } catch (err: any) {
            setError(err.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3" controlId="title">
                <Form.Label>Titre</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Titre du film"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    rows={3}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="genre">
                <Form.Label>Genre</Form.Label>
                <Form.Select name="genre" value={form.genre} onChange={handleChange} required>
                    {genres.map(g => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="duration">
                <Form.Label>Durée (en minutes)</Form.Label>
                <Form.Control
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    min={1}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="release_date">
                <Form.Label>Date de sortie</Form.Label>
                <Form.Control
                    type="date"
                    name="release_date"
                    value={typeof form.release_date === 'string' ? form.release_date : form.release_date?.toISOString().slice(0, 10) || ''}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Button type="submit" disabled={loading}>
                {loading ? 'Création en cours...' : 'Créer le film'}
            </Button>
        </Form>
    );
}
